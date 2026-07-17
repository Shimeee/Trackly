import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BillingCycle = 'Monthly' | 'Yearly' | 'Weekly';
export type SubStatus = 'active' | 'trial' | 'paused' | 'cancelled';

export type Subscription = {
  id: string;
  name: string;
  categoryId: string;
  cost: number;
  billingCycle: BillingCycle;
  nextBillingDate: string; // ISO date
  startDate: string; // ISO date
  paymentMethod?: string;
  isFreeTrial: boolean;
  trialEndsDate?: string;
  autoRenew: boolean;
  status: SubStatus;
  notes?: string;
  color: string;
  reminders: {
    onBillingDate: boolean;
    daysBefore: number[];
    renewalReminder: boolean;
    freeTrialEnding: boolean;
    cancellationDeadline: boolean;
    muteNonCritical: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

export type NotificationItem = {
  id: string;
  subscriptionId: string | null;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

function toMonthly(cost: number, cycle: BillingCycle): number {
  if (cycle === 'Yearly') return cost / 12;
  if (cycle === 'Weekly') return cost * 4.345;
  return cost;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function daysUntil(dateIso: string): number {
  const ms = new Date(dateIso).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}

type SubscriptionsState = {
  subscriptions: Subscription[];
  notifications: NotificationItem[];
  addSubscription: (input: Omit<Subscription, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Subscription;
  updateSubscription: (id: string, patch: Partial<Subscription>) => void;
  pauseSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  restoreSubscription: (id: string) => void;
  deleteSubscription: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAll: () => void;
};

export const useSubscriptionsStore = create<SubscriptionsState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      notifications: [],

      addSubscription: (input) => {
        const now = new Date().toISOString();
        const sub: Subscription = {
          ...input,
          id: uid(),
          status: input.isFreeTrial ? 'trial' : 'active',
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({
          subscriptions: [sub, ...s.subscriptions],
          notifications: [
            {
              id: uid(),
              subscriptionId: sub.id,
              title: 'Subscription added',
              body: `${sub.name} was added to your subscriptions.`,
              createdAt: now,
              read: false,
            },
            ...s.notifications,
          ],
        }));
        return sub;
      },

      updateSubscription: (id, patch) => {
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...patch, updatedAt: new Date().toISOString() } : sub
          ),
        }));
      },

      pauseSubscription: (id) => {
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, status: 'paused', updatedAt: new Date().toISOString() } : sub
          ),
        }));
      },

      cancelSubscription: (id) => {
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, status: 'cancelled', autoRenew: false, updatedAt: new Date().toISOString() } : sub
          ),
        }));
      },

      restoreSubscription: (id) => {
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, status: 'active', updatedAt: new Date().toISOString() } : sub
          ),
        }));
      },

      deleteSubscription: (id) => {
        set((s) => ({ subscriptions: s.subscriptions.filter((sub) => sub.id !== id) }));
      },

      markAllNotificationsRead: () => {
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
      },

      clearAll: () => set({ subscriptions: [], notifications: [] }),
    }),
    { name: 'trackly-subscriptions', storage: createJSONStorage(() => AsyncStorage) }
  )
);

export { toMonthly, daysUntil };

// Pure derivation helpers — use these with useMemo in components instead of
// calling store methods inside a selector (methods return new array/object
// references on every call, which breaks useSyncExternalStore's snapshot caching
// and causes an infinite render loop).
export function selectActive(subscriptions: Subscription[]): Subscription[] {
  return subscriptions.filter((s) => s.status === 'active' || s.status === 'trial');
}

export function selectArchived(subscriptions: Subscription[]): Subscription[] {
  return subscriptions.filter((s) => s.status === 'paused' || s.status === 'cancelled');
}

export function selectMonthlySpend(subscriptions: Subscription[]): number {
  return selectActive(subscriptions).reduce((sum, s) => sum + toMonthly(s.cost, s.billingCycle), 0);
}

export function selectYearlyProjected(subscriptions: Subscription[]): number {
  return selectMonthlySpend(subscriptions) * 12;
}

export function selectDueSoon(subscriptions: Subscription[], withinDays = 30): Subscription[] {
  return selectActive(subscriptions)
    .filter((s) => {
      const d = daysUntil(s.nextBillingDate);
      return d >= 0 && d <= withinDays;
    })
    .sort((a, b) => daysUntil(a.nextBillingDate) - daysUntil(b.nextBillingDate));
}

export function selectCategoryBreakdown(subscriptions: Subscription[]): { categoryId: string; total: number; percent: number }[] {
  const activeSubs = selectActive(subscriptions);
  const total = activeSubs.reduce((sum, s) => sum + toMonthly(s.cost, s.billingCycle), 0);
  const byCategory: Record<string, number> = {};
  for (const s of activeSubs) {
    byCategory[s.categoryId] = (byCategory[s.categoryId] || 0) + toMonthly(s.cost, s.billingCycle);
  }
  return Object.entries(byCategory)
    .map(([categoryId, catTotal]) => ({
      categoryId,
      total: catTotal,
      percent: total > 0 ? Math.round((catTotal / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function selectMostExpensive(subscriptions: Subscription[], limit = 3): Subscription[] {
  return [...selectActive(subscriptions)].sort((a, b) => toMonthly(b.cost, b.billingCycle) - toMonthly(a.cost, a.billingCycle)).slice(0, limit);
}

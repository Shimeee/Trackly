import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Appearance = 'system' | 'light' | 'dark';
export type LanguagePreference = 'system' | 'en' | 'ar';

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export const defaultCategories: Category[] = [
  { id: 'entertainment', name: 'Entertainment', color: '#8B3DFF', icon: 'clapperboard' },
  { id: 'software', name: 'Software & Productivity', color: '#1DB855', icon: 'laptop' },
  { id: 'mobile', name: 'Mobile & Internet', color: '#EA8317', icon: 'wifi' },
  { id: 'health', name: 'Health & Fitness', color: '#DC3D3D', icon: 'heart-pulse' },
  { id: 'other', name: 'Other', color: '#64748B', icon: 'more-horizontal' },
];

type SettingsState = {
  appearance: Appearance;
  language: LanguagePreference;
  currency: string;
  region: string;
  dateFormat: string;
  defaultReminderDays: number;
  quietHoursStart: string;
  quietHoursEnd: string;
  categories: Category[];
  hasCompletedOnboarding: boolean;
  isSignedIn: boolean;
  notificationsEnabled: boolean;
  firstName: string;
  lastName: string;
  userName: string;
  userEmail: string;
  memberSince: string;
  setAppearance: (a: Appearance) => void;
  setLanguage: (l: LanguagePreference) => void;
  setCurrency: (c: string) => void;
  setRegion: (r: string) => void;
  setDateFormat: (f: string) => void;
  setDefaultReminderDays: (d: number) => void;
  setQuietHours: (start: string, end: string) => void;
  addCategory: (c: Category) => void;
  completeOnboarding: () => void;
  setName: (firstName: string, lastName: string) => void;
  setEmail: (email: string) => void;
  signIn: (firstName: string, lastName: string, email: string, createdAt?: string) => void;
  signOut: () => void;
  resetAccount: () => void;
  setNotificationsEnabled: (v: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      appearance: 'system',
      language: 'system',
      currency: 'EGP',
      region: 'Egypt',
      dateFormat: 'DD/MM/YYYY',
      defaultReminderDays: 3,
      quietHoursStart: '10:00 PM',
      quietHoursEnd: '8:00 AM',
      categories: defaultCategories,
      hasCompletedOnboarding: false,
      isSignedIn: false,
      notificationsEnabled: false,
      firstName: '',
      lastName: '',
      userName: '',
      userEmail: '',
      memberSince: '',
      setAppearance: (a) => set({ appearance: a }),
      setLanguage: (l) => set({ language: l }),
      setCurrency: (c) => set({ currency: c }),
      setRegion: (r) => set({ region: r }),
      setDateFormat: (f) => set({ dateFormat: f }),
      setDefaultReminderDays: (d) => set({ defaultReminderDays: d }),
      setQuietHours: (start, end) => set({ quietHoursStart: start, quietHoursEnd: end }),
      addCategory: (c) => set((s) => ({ categories: [...s.categories, c] })),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setName: (firstName, lastName) => set({ firstName, lastName, userName: `${firstName} ${lastName}`.trim() }),
      setEmail: (email) => set({ userEmail: email }),
      signIn: (firstName, lastName, email, createdAt) =>
        set({
          isSignedIn: true,
          firstName,
          lastName,
          userName: `${firstName} ${lastName}`.trim(),
          userEmail: email,
          memberSince: createdAt || get().memberSince || new Date().toISOString(),
        }),
      signOut: () => set({ isSignedIn: false }),
      resetAccount: () =>
        set({
          appearance: 'system',
          currency: 'EGP',
          region: 'Egypt',
          dateFormat: 'DD/MM/YYYY',
          defaultReminderDays: 3,
          quietHoursStart: '10:00 PM',
          quietHoursEnd: '8:00 AM',
          categories: defaultCategories,
          isSignedIn: false,
          notificationsEnabled: false,
          firstName: '',
          lastName: '',
          userName: '',
          userEmail: '',
          memberSince: '',
        }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
    }),
    { name: 'trackly-settings', storage: createJSONStorage(() => AsyncStorage) }
  )
);

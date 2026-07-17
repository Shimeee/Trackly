import { BillingCycle } from '../store/subscriptionsStore';

export type RootStackParamList = {
  Splash: undefined;
  OnboardingBenefits: undefined;
  OnboardingPreferences: undefined;
  NotificationPrePermission: undefined;
  Auth: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Main: undefined;
  AddServiceSelection: undefined;
  AddDetailsForm: { serviceName?: string; serviceColor?: string; categoryId?: string };
  AddReminderConfig: {
    serviceName: string;
    serviceColor: string;
    categoryId: string;
    cost: string;
    billingCycle: BillingCycle;
    nextBillingDate: string;
    paymentMethod: string;
    isFreeTrial: boolean;
    autoRenew: boolean;
  };
  AddConfirmation: undefined;
  SubscriptionDetails: { id: string };
  EditSubscription: { id: string };
  DeleteConfirmation: { id: string };
  PauseConfirmation: { id: string };
  RestoreConfirmation: { id: string };
  NotificationCenter: undefined;
  SearchFilters: undefined;
  NotificationPreferences: undefined;
  ManageCategories: undefined;
  AddCategory: undefined;
  Appearance: undefined;
  LanguagePicker: undefined;
  CurrencyPicker: undefined;
  RegionDateFormat: undefined;
  ReminderTimingPicker: undefined;
  QuietHoursPicker: undefined;
  ProfileAccount: undefined;
  PrivacySecurity: undefined;
  ExportData: undefined;
  CloudBackupSync: undefined;
  ArchivedSubscriptions: undefined;
  SignOutConfirmation: undefined;
  DeleteAccountConfirmation: undefined;
};

export type TabParamList = {
  Home: undefined;
  Calendar: undefined;
  AddTab: undefined;
  Insights: undefined;
  Settings: undefined;
};

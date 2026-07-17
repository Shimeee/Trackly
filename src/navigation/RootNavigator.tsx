import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { OnboardingBenefitsScreen } from '../screens/onboarding/OnboardingBenefitsScreen';
import { OnboardingPreferencesScreen } from '../screens/onboarding/OnboardingPreferencesScreen';
import { NotificationPrePermissionScreen } from '../screens/onboarding/NotificationPrePermissionScreen';
import { AuthScreen } from '../screens/onboarding/AuthScreen';
import { SignUpScreen } from '../screens/onboarding/SignUpScreen';
import { SignInScreen } from '../screens/onboarding/SignInScreen';

import { ServiceSelectionScreen } from '../screens/addSubscription/ServiceSelectionScreen';
import { DetailsFormScreen } from '../screens/addSubscription/DetailsFormScreen';
import { ReminderConfigScreen } from '../screens/addSubscription/ReminderConfigScreen';
import { ConfirmationScreen } from '../screens/addSubscription/ConfirmationScreen';

import { SubscriptionDetailsScreen } from '../screens/details/SubscriptionDetailsScreen';
import { EditSubscriptionScreen } from '../screens/details/EditSubscriptionScreen';

import { DeleteConfirmationScreen } from '../screens/dialogs/DeleteConfirmationScreen';
import { PauseConfirmationScreen } from '../screens/dialogs/PauseConfirmationScreen';
import { RestoreConfirmationScreen } from '../screens/dialogs/RestoreConfirmationScreen';
import { SignOutConfirmationScreen } from '../screens/dialogs/SignOutConfirmationScreen';
import { DeleteAccountConfirmationScreen } from '../screens/dialogs/DeleteAccountConfirmationScreen';

import { NotificationCenterScreen } from '../screens/core/NotificationCenterScreen';
import { SearchFiltersScreen } from '../screens/core/SearchFiltersScreen';

import { NotificationPreferencesScreen } from '../screens/settings/NotificationPreferencesScreen';
import { ManageCategoriesScreen } from '../screens/settings/ManageCategoriesScreen';
import { AddCategoryScreen } from '../screens/settings/AddCategoryScreen';
import { AppearanceScreen } from '../screens/settings/AppearanceScreen';
import { LanguagePickerScreen } from '../screens/settings/LanguagePickerScreen';
import { CurrencyPickerScreen } from '../screens/settings/CurrencyPickerScreen';
import { RegionDateFormatScreen } from '../screens/settings/RegionDateFormatScreen';
import { ReminderTimingPickerScreen } from '../screens/settings/ReminderTimingPickerScreen';
import { QuietHoursPickerScreen } from '../screens/settings/QuietHoursPickerScreen';
import { ProfileAccountScreen } from '../screens/settings/ProfileAccountScreen';
import { PrivacySecurityScreen } from '../screens/settings/PrivacySecurityScreen';
import { ExportDataScreen } from '../screens/settings/ExportDataScreen';
import { CloudBackupSyncScreen } from '../screens/settings/CloudBackupSyncScreen';
import { ArchivedSubscriptionsScreen } from '../screens/settings/ArchivedSubscriptionsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="OnboardingBenefits" component={OnboardingBenefitsScreen} />
      <Stack.Screen name="OnboardingPreferences" component={OnboardingPreferencesScreen} />
      <Stack.Screen name="NotificationPrePermission" component={NotificationPrePermissionScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />

      <Stack.Screen name="Main" component={TabNavigator} />

      <Stack.Screen name="AddServiceSelection" component={ServiceSelectionScreen} />
      <Stack.Screen name="AddDetailsForm" component={DetailsFormScreen} />
      <Stack.Screen name="AddReminderConfig" component={ReminderConfigScreen} />
      <Stack.Screen name="AddConfirmation" component={ConfirmationScreen} />

      <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetailsScreen} />
      <Stack.Screen name="EditSubscription" component={EditSubscriptionScreen} />

      <Stack.Screen name="DeleteConfirmation" component={DeleteConfirmationScreen} options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="PauseConfirmation" component={PauseConfirmationScreen} options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="RestoreConfirmation" component={RestoreConfirmationScreen} options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="SignOutConfirmation" component={SignOutConfirmationScreen} options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="DeleteAccountConfirmation" component={DeleteAccountConfirmationScreen} options={{ presentation: 'transparentModal', animation: 'fade' }} />

      <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} />
      <Stack.Screen name="SearchFilters" component={SearchFiltersScreen} />

      <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
      <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
      <Stack.Screen name="Appearance" component={AppearanceScreen} />
      <Stack.Screen name="LanguagePicker" component={LanguagePickerScreen} />
      <Stack.Screen name="CurrencyPicker" component={CurrencyPickerScreen} />
      <Stack.Screen name="RegionDateFormat" component={RegionDateFormatScreen} />
      <Stack.Screen name="ReminderTimingPicker" component={ReminderTimingPickerScreen} />
      <Stack.Screen name="QuietHoursPicker" component={QuietHoursPickerScreen} />
      <Stack.Screen name="ProfileAccount" component={ProfileAccountScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <Stack.Screen name="ExportData" component={ExportDataScreen} />
      <Stack.Screen name="CloudBackupSync" component={CloudBackupSyncScreen} />
      <Stack.Screen name="ArchivedSubscriptions" component={ArchivedSubscriptionsScreen} />
    </Stack.Navigator>
  );
}

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const webClientId = Constants.expoConfig?.extra?.googleWebClientId as string | undefined;
  GoogleSignin.configure({ webClientId: webClientId || undefined });
  configured = true;
}

export type GoogleUser = { firstName: string; lastName: string; email: string };

export async function signInWithGoogle(): Promise<GoogleUser | null> {
  if (Platform.OS === 'web') return null;
  ensureConfigured();
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return null;

    const { givenName, familyName, name, email } = response.data.user;
    const [fallbackFirst, ...fallbackRest] = (name || '').split(' ');
    return {
      firstName: givenName || fallbackFirst || '',
      lastName: familyName || fallbackRest.join(' ') || '',
      email,
    };
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) return null;
    throw error;
  }
}

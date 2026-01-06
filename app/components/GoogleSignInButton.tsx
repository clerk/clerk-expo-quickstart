import { useSignInWithGoogle } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { useState } from 'react'

/**
 * GoogleSignInButton Component
 *
 * This component provides native Google Sign-In functionality for iOS and Android devices.
 *
 * SETUP REQUIRED BEFORE USE:
 *
 * 1. Configure Google Cloud Console:
 *    - Create OAuth 2.0 credentials for iOS and Android
 *    - Add SHA-1 certificate fingerprints for Android
 *    - Configure iOS URL scheme
 *
 * 2. Configure Clerk Dashboard:
 *    - Enable Google as an SSO connection: https://dashboard.clerk.com/last-active?path=user-authentication/sso-connections
 *
 * 3. Add your iOS and Android apps to Clerk Dashboard → Native Applications:
 *    - iOS Bundle ID: Must match your app.json
 *    - Android Package Name: Must match your app.json
 *
 * 4. Set Environment Variables in your .env file:
 *    - EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
 *    - EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
 *    - EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
 *
 * 5. Build Configuration:
 *    - For EAS Build: Configure eas.json
 *    - For local build: Run `npx expo prebuild`
 *
 * @param onSignInComplete - Optional callback called when sign-in completes successfully
 * @param showDivider - Whether to show "OR" divider below button (default: true)
 */

interface GoogleSignInButtonProps {
  onSignInComplete?: () => void
  showDivider?: boolean
}

export default function GoogleSignInButton({ onSignInComplete, showDivider = true }: GoogleSignInButtonProps) {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Only render on iOS and Android
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return null
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      const { createdSessionId, setActive } = await startGoogleAuthenticationFlow()

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })

        if (onSignInComplete) {
          onSignInComplete()
        } else {
          router.replace('/')
        }
      }
    } catch (err: any) {
      // Handle user cancellation
      if (err.code === 'SIGN_IN_CANCELLED' || err.code === '-5') {
        return
      }

      Alert.alert('Google Sign-In Error', err.message || 'An error occurred during Google Sign-In')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.googleButtonText}> Signing in...</Text>
          </View>
        ) : (
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      {showDivider && (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButtonDisabled: {
    backgroundColor: '#93B8F4',
    opacity: 0.7,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
})

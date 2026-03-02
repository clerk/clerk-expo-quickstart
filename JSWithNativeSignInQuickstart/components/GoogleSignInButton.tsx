import { useSignInWithGoogle } from '@clerk/expo/google'
import { useRouter } from 'expo-router'
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface GoogleSignInButtonProps {
  onSignInComplete?: () => void
  showDivider?: boolean
}

export function GoogleSignInButton({
  onSignInComplete,
  showDivider = true,
}: GoogleSignInButtonProps) {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle()
  const router = useRouter()

  // Only render on iOS and Android
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return null
  }

  const handleGoogleSignIn = async () => {
    try {
      console.log('[GoogleSignIn] Starting authentication flow...')
      const result = await startGoogleAuthenticationFlow()
      console.log('[GoogleSignIn] Flow result:', JSON.stringify({
        createdSessionId: result.createdSessionId,
        hasSetActive: !!result.setActive,
        signInStatus: result.signIn?.status,
        signUpStatus: result.signUp?.status,
      }, null, 2))

      const { createdSessionId, setActive } = result

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })

        if (onSignInComplete) {
          onSignInComplete()
        } else {
          router.replace('/')
        }
      } else {
        console.warn('[GoogleSignIn] No createdSessionId returned. Full result:', JSON.stringify(result, null, 2))
      }
    } catch (err: any) {
      if (err.code === 'SIGN_IN_CANCELLED' || err.code === '-5') {
        return
      }

      Alert.alert('Error', err.message || 'An error occurred during Google Sign-In')
      console.error('Google Sign-In error:', JSON.stringify(err, null, 2))
    }
  }

  return (
    <>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
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
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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

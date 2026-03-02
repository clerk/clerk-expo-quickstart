import { useSignInWithApple } from '@clerk/expo/apple'
import { useSSO } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

export function AppleSignInButton({ onSignInComplete }: { onSignInComplete?: () => void }) {
  const { startAppleAuthenticationFlow } = useSignInWithApple()
  const { startSSOFlow } = useSSO()
  const router = useRouter()

  const handleAppleSignIn = async () => {
    try {
      if (Platform.OS === 'ios') {
        // Native Apple Sign-In on iOS
        const { createdSessionId, setActive } = await startAppleAuthenticationFlow()

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId })
          onSignInComplete?.() ?? router.replace('/')
        }
      } else {
        // Web-based OAuth Apple Sign-In on Android
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy: 'oauth_apple',
        })

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId })
          onSignInComplete?.() ?? router.replace('/')
        }
      }
    } catch (err: any) {
      if (err?.message?.includes('ERR_REQUEST_CANCELED')) return
      if (err?.code === 'ERR_CANCELED') return
      Alert.alert('Error', err.message || 'An error occurred during Apple Sign-In')
      console.error('Apple Sign-In error:', err)
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleAppleSignIn}
      >
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

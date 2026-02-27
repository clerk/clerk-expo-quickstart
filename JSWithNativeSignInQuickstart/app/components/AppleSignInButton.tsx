import { useSignInWithApple } from '@clerk/expo/apple'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

export function AppleSignInButton({ onSignInComplete }: { onSignInComplete?: () => void }) {
  const { signInWithApple } = useSignInWithApple()

  // Only show on iOS
  if (Platform.OS !== 'ios') return null

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple()
      onSignInComplete?.()
    } catch (err: any) {
      if (err?.message?.includes('ERR_REQUEST_CANCELED')) return
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

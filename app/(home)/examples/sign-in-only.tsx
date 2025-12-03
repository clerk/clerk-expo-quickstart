import { SignIn } from '@clerk/clerk-expo/native'
import { useRouter } from 'expo-router'

/**
 * Sign In Only Mode
 *
 * Restricts the interface to sign-in flows only
 * Users can only authenticate with existing accounts
 *
 * Includes all sign-in features:
 * - Email/password
 * - Phone/SMS
 * - Username
 * - OAuth providers
 * - Passkeys
 * - MFA (SMS, TOTP, backup codes)
 * - Password reset
 * - Alternative methods
 */
export default function SignInOnlyPage() {
  const router = useRouter()

  return (
    <SignIn
      mode="signIn"
      isDismissable={true}
      onSuccess={() => router.replace('/(home)')}
      onError={(error) => console.error('Sign in error:', error)}
    />
  )
}

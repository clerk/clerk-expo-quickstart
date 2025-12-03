import { SignIn } from '@clerk/clerk-expo/native'
import { useRouter } from 'expo-router'

/**
 * Sign Up Only Mode
 *
 * Restricts the interface to sign-up flows only
 * Users can only create new accounts
 *
 * Includes all sign-up features:
 * - Email sign-up with verification
 * - Phone sign-up with SMS verification
 * - Username registration
 * - OAuth registration
 * - Profile completion
 * - Field collection
 * - Custom fields
 */
export default function SignUpOnlyPage() {
  const router = useRouter()

  return (
    <SignIn
      mode="signUp"
      isDismissable={true}
      onSuccess={() => router.replace('/(home)')}
      onError={(error) => console.error('Sign up error:', error)}
    />
  )
}

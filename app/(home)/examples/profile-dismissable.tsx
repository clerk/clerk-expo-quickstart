import { UserProfile } from '@clerk/clerk-expo/native'
import { useRouter } from 'expo-router'

/**
 * Dismissable Profile Sheet
 *
 * User profile as a sheet that can be dismissed
 * Includes dismiss button in navigation bar
 * Perfect for modal profile views
 *
 * Provides access to 65+ profile management screens:
 *
 * Profile Section:
 * - View/edit profile info
 * - Manage emails (add, verify, remove, set primary)
 * - Manage phones (add, verify, remove, set primary)
 * - Update profile image
 *
 * Security Section:
 * - Change password
 * - Enable/configure MFA (SMS, TOTP)
 * - Manage backup codes
 * - Manage passkeys
 * - Connected OAuth accounts
 * - Active device sessions
 * - Revoke sessions
 *
 * Account Management:
 * - Account switching (multi-session)
 * - Add accounts
 * - Sign out
 * - Delete account
 */
export default function ProfileDismissablePage() {
  const router = useRouter()

  return (
    <UserProfile
      isDismissable={true}
      onSignOut={() => {
        console.log('User signed out')
        router.replace('/(auth)/sign-in')
      }}
    />
  )
}

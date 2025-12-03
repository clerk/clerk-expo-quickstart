import { UserProfile } from '@clerk/clerk-expo/native'
import { useRouter } from 'expo-router'

/**
 * Fullscreen Profile (Non-dismissable)
 *
 * Full-screen profile without dismiss button
 * Ideal for dedicated profile screens
 * User stays in profile until they navigate away
 *
 * All 65+ profile management features available:
 *
 * UserProfileDetailView:
 * - Profile information display and editing
 * - Name, username, email, phone management
 *
 * UserProfileSecurityView:
 * - Password management (UserProfileChangePasswordView)
 * - MFA configuration (UserProfileMfaSection)
 *   - SMS 2FA (UserProfileMfaAddSmsView)
 *   - TOTP 2FA (UserProfileMfaAddTotpView)
 *   - Backup codes (BackupCodesView)
 * - Passkey management (UserProfilePasskeySection)
 *   - Add passkeys
 *   - Rename passkeys (UserProfilePasskeyRenameView)
 *   - Remove passkeys
 * - Connected accounts (UserProfileExternalAccountRow)
 * - Active sessions (UserProfileDevicesSection)
 *
 * Account Actions:
 * - Sign out
 * - Delete account (UserProfileDeleteAccountSection)
 */
export default function ProfileFullscreenPage() {
  const router = useRouter()

  return (
    <UserProfile
      isDismissable={false}
      onSignOut={() => {
        console.log('User signed out from fullscreen profile')
        router.replace('/(auth)/sign-in')
      }}
    />
  )
}

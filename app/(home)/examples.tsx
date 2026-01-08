import { Link } from 'expo-router'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'

/**
 * Complete Examples of ALL Native Clerk Features
 *
 * This screen demonstrates access to native components from:
 * - iOS: clerk-ios (107 SwiftUI components)
 * - Android: clerk-android (Jetpack Compose components)
 *
 * All accessed through 3 React Native components
 */
export default function ExamplesPage() {
  const platformName = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Native'
  const sdkName = Platform.OS === 'ios' ? 'clerk-ios' : Platform.OS === 'android' ? 'clerk-android' : 'clerk-native'

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Native {platformName} Components</Text>
      <Text style={styles.subtitle}>All {sdkName} features available in React Native</Text>

      {/* Authentication Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication (SignIn Component)</Text>
        <Text style={styles.description}>
          35+ screens including sign-in, sign-up, OAuth, MFA, password reset, passkeys
        </Text>

        <Link href="/(home)/examples/sign-in-only" style={styles.link}>
          <Text style={styles.linkText}>Sign In Only Mode</Text>
        </Link>

        <Link href="/(home)/examples/sign-up-only" style={styles.link}>
          <Text style={styles.linkText}>Sign Up Only Mode</Text>
        </Link>

        <Link href="/(home)/examples/sign-in-or-up" style={styles.link}>
          <Text style={styles.linkText}>Sign In or Sign Up Mode</Text>
        </Link>

        <Link href="/(home)/examples/fullscreen-auth" style={styles.link}>
          <Text style={styles.linkText}>Fullscreen Authentication</Text>
        </Link>
      </View>

      {/* UserButton Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Button Component</Text>
        <Text style={styles.description}>
          4+ screens including avatar, popover, account switcher
        </Text>

        <Link href="/(home)/examples/user-button-demo" style={styles.link}>
          <Text style={styles.linkText}>User Button Demo</Text>
        </Link>
      </View>

      {/* UserProfile Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Profile Component</Text>
        <Text style={styles.description}>
          65+ screens including profile, security, MFA, devices, passkeys, connected accounts
        </Text>

        <Link href="/(home)/examples/profile-dismissable" style={styles.link}>
          <Text style={styles.linkText}>Dismissable Profile Sheet</Text>
        </Link>

        <Link href="/(home)/examples/profile-fullscreen" style={styles.link}>
          <Text style={styles.linkText}>Fullscreen Profile</Text>
        </Link>
      </View>

      {/* Feature List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Available Features</Text>

        <Text style={styles.featureCategory}>Authentication (35+ screens):</Text>
        <Text style={styles.feature}>✓ Email + Password</Text>
        <Text style={styles.feature}>✓ Phone + SMS OTP</Text>
        <Text style={styles.feature}>✓ Username</Text>
        <Text style={styles.feature}>✓ OAuth (Google, Apple, GitHub, etc.)</Text>
        <Text style={styles.feature}>✓ Passkeys (WebAuthn)</Text>
        <Text style={styles.feature}>✓ Multi-factor auth (SMS, TOTP)</Text>
        <Text style={styles.feature}>✓ Backup codes</Text>
        <Text style={styles.feature}>✓ Password reset</Text>
        <Text style={styles.feature}>✓ Account recovery</Text>

        <Text style={styles.featureCategory}>Profile Management (65+ screens):</Text>
        <Text style={styles.feature}>✓ Edit profile info</Text>
        <Text style={styles.feature}>✓ Manage emails (add, verify, remove, set primary)</Text>
        <Text style={styles.feature}>✓ Manage phones (add, verify, remove, set primary)</Text>
        <Text style={styles.feature}>✓ Change password</Text>
        <Text style={styles.feature}>✓ Configure MFA (SMS, TOTP)</Text>
        <Text style={styles.feature}>✓ Manage backup codes</Text>
        <Text style={styles.feature}>✓ Manage passkeys</Text>
        <Text style={styles.feature}>✓ Connected OAuth accounts</Text>
        <Text style={styles.feature}>✓ Active sessions & devices</Text>
        <Text style={styles.feature}>✓ Multi-session support</Text>
        <Text style={styles.feature}>✓ Account switching</Text>
        <Text style={styles.feature}>✓ Delete account</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by {sdkName}
        </Text>
        <Text style={styles.footerSubtext}>
          3 React Native components • Full native UI
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 10,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  featureCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  feature: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#666',
  },
})

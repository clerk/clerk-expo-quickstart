import { UserButton } from '@clerk/clerk-expo/native'
import { View, Text, StyleSheet } from 'react-native'

/**
 * UserButton Component Demo
 *
 * Displays user avatar and opens profile on tap
 * Automatically handles:
 * - Profile image display
 * - Profile sheet presentation
 * - Account switcher (if multi-session enabled)
 * - Sign out
 *
 * The UserButton internally includes:
 * - UserButtonPopover
 * - UserButtonAccountSwitcher
 * - UserPreviewView
 * - UserProfileRowView
 */
export default function UserButtonDemoPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>UserButton Demo</Text>
      <Text style={styles.description}>
        Tap the button to open your profile
      </Text>

      <View style={styles.buttonContainer}>
        <UserButton
          style={styles.userButton}
          onPress={() => console.log('UserButton tapped')}
        />
      </View>

      <View style={styles.features}>
        <Text style={styles.featureTitle}>Features:</Text>
        <Text style={styles.feature}>✓ User avatar display</Text>
        <Text style={styles.feature}>✓ Opens UserProfileView on tap</Text>
        <Text style={styles.feature}>✓ Account switcher (multi-session)</Text>
        <Text style={styles.feature}>✓ Quick sign out</Text>
        <Text style={styles.feature}>✓ Native iOS animations</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 32,
  },
  userButton: {
    width: 64,
    height: 64,
  },
  features: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  feature: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
})

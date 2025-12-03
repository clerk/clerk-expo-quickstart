import { UserProfile } from '@clerk/clerk-expo/native'
import { useRouter } from 'expo-router'
import { Platform, View, Text, StyleSheet } from 'react-native'

export default function ProfilePage() {
  const router = useRouter()

  // For non-iOS platforms, show a fallback message
  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          Native UserProfile is only available on iOS
        </Text>
      </View>
    )
  }

  return (
    <UserProfile
      isDismissable={false}
      onSignOut={() => {
        console.log('User signed out from profile')
        router.replace('/(auth)/sign-in')
      }}
      style={{ flex: 1 }}
    />
  )
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fallbackText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
})

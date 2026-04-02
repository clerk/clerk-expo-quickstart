import { useAuth, useUser, useClerk, useUserProfileModal } from '@clerk/expo'
import { AuthView, UserButton } from '@clerk/expo/native'
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'

export default function MainScreen() {
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false })
  const { user } = useUser()
  const { signOut } = useClerk()
  const { presentUserProfile } = useUserProfileModal()

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!isSignedIn) {
    return <AuthView mode="signInOrUp" />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <View style={{ width: 44, height: 44, borderRadius: 22, overflow: 'hidden' }}>
          <UserButton />
        </View>
      </View>
      <View style={styles.profileCard}>
        {user?.imageUrl && <Image source={{ uri: user.imageUrl }} style={styles.avatar} />}
        <View>
          <Text style={styles.email}>{user?.id}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.linkButton} onPress={presentUserProfile}>
        <Text style={styles.linkButtonText}>Manage Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.linkButton, { backgroundColor: '#666' }]} onPress={() => signOut()}>
        <Text style={styles.linkButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  linkButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

import { useState, useEffect } from 'react'
import { useAuth, useUser, useClerk } from '@clerk/expo'
import { AuthView, UserButton, UserProfileView } from '@clerk/expo/native'
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'

export default function MainScreen() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()

  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Reset modal state when auth state changes
  useEffect(() => {
    setShowAuth(false)
    setShowProfile(false)
  }, [isSignedIn])

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!isSignedIn) {
    if (showAuth) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <AuthView mode="signInOrUp" onDismiss={() => setShowAuth(false)} />
        </View>
      )
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Clerk + Expo</Text>
        <Text style={styles.subtitle}>Native Components</Text>
        <TouchableOpacity style={styles.signInButton} onPress={() => setShowAuth(true)}>
          <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <UserButton style={{ width: 44, height: 44 }} />
      </View>
      <View style={styles.profileCard}>
        {user?.imageUrl && <Image source={{ uri: user.imageUrl }} style={styles.avatar} />}
        <View>
          <Text style={styles.name}>
            {user?.firstName || 'User'} {user?.lastName || ''}
          </Text>
          <Text style={styles.email}>{user?.emailAddresses[0]?.emailAddress}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.linkButton} onPress={() => setShowProfile(true)}>
        <Text style={styles.linkButtonText}>Manage Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.linkButton, { backgroundColor: '#666' }]}
        onPress={() => signOut()}
      >
        <Text style={styles.linkButtonText}>Sign Out</Text>
      </TouchableOpacity>
      {showProfile && (
        <UserProfileView onDismiss={() => setShowProfile(false)} onSignOut={() => signOut()} />
      )}
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  signInButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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

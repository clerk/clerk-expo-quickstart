import { useAuth, useUser, useClerk, useSignIn, useUserProfileModal } from '@clerk/expo'
import { UserButton } from '@clerk/expo/native'
import { useRouter, type Href } from 'expo-router'
import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native'

function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [debugMsg, setDebugMsg] = React.useState('')

  const handleSubmit = async () => {
    try {
      setDebugMsg('Calling signIn.password...')
      const { error } = await signIn.password({ emailAddress, password })
      if (error) {
        setDebugMsg('Error: ' + JSON.stringify(error))
        return
      }

      setDebugMsg('Status: ' + signIn.status)

      if (signIn.status === 'complete') {
        setDebugMsg('Calling finalize...')
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            setDebugMsg('Navigate called, pushing...')
            router.push(decorateUrl('/') as Href)
          },
        })
        setDebugMsg('Finalize done')
      }
    } catch (e: any) {
      setDebugMsg('Caught: ' + e.message)
    }
  }

  return (
    <View style={styles.centered}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Sign in</Text>
      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      {errors.fields.identifier && (
        <Text style={styles.error}>{errors.fields.identifier.message}</Text>
      )}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666"
        secureTextEntry
        onChangeText={setPassword}
      />
      {errors.fields.password && <Text style={styles.error}>{errors.fields.password.message}</Text>}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!emailAddress || !password || fetchStatus === 'fetching') && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!emailAddress || !password || fetchStatus === 'fetching'}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
      {!!debugMsg && <Text style={{ color: 'blue', fontSize: 12, marginTop: 8 }}>{debugMsg}</Text>}
    </View>
  )
}

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
    return <SignInScreen />
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
    backgroundColor: '#fff',
    padding: 20,
    gap: 12,
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
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -8,
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

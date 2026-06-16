import { useAuth, useClerk, useUser } from '@clerk/expo'
import { UserButton } from '@clerk/expo/native'
import { useEffect } from 'react'
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'

import { useDebugEvent } from '../../debug-events'

export default function Page() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const addDebugEvent = useDebugEvent()

  console.log('[ClerkExpoSync Quickstart] SignedInScreen render', { isSignedIn, userId: user?.id })
  useEffect(() => {
    console.log('[ClerkExpoSync Quickstart] SignedInScreen mounted')
    addDebugEvent('SignedInScreen mounted')
    return () => {
      console.log('[ClerkExpoSync Quickstart] SignedInScreen unmounted')
      addDebugEvent('SignedInScreen unmounted')
    }
  }, [addDebugEvent])
  useEffect(() => {
    console.log('[ClerkExpoSync Quickstart] SignedInScreen auth changed', { isSignedIn, userId: user?.id })
    addDebugEvent(`SignedInScreen signedIn=${String(isSignedIn)} user=${user?.id ?? 'none'}`)
  }, [addDebugEvent, isSignedIn, user?.id])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>JS session: {isSignedIn ? 'signed in' : 'signed out'}</Text>
        <Text style={styles.statusLabel}>JS user: {user?.id ?? 'none'}</Text>
      </View>
      <Text>Hello {user?.id}</Text>
      <View style={styles.nativeUserButtonRow}>
        <Text>Native UserButton:</Text>
        <UserButton />
      </View>
      <Button title="Sign out" onPress={handleSignOut} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 48,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusCard: {
    gap: 6,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: '#0a7ea4',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  nativeUserButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
})

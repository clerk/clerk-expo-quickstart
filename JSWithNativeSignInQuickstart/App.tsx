import { ClerkProvider, useAuth } from '@clerk/expo'
import { AuthView } from '@clerk/expo/native'
import { tokenCache } from '@clerk/expo/token-cache'
import { useEffect, useMemo, useState } from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'

import SignInScreen from './app/(auth)/sign-in'
import SignedInScreen from './app/(home)/index'
import { DebugEventsContext, useDebugEvent } from './debug-events'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export default function App() {
  const [events, setEvents] = useState<Array<{ id: number; message: string }>>([])
  const addDebugEvent = useMemo(() => {
    return (message: string) => {
      setEvents(current => [
        { id: (current[0]?.id ?? 0) + 1, message: `${new Date().toLocaleTimeString()} ${message}` },
        ...current,
      ].slice(0, 8))
    }
  }, [])

  useEffect(() => {
    ;(globalThis as typeof globalThis & { __clerkExpoDebug?: (message: string) => void }).__clerkExpoDebug =
      addDebugEvent

    return () => {
      delete (globalThis as typeof globalThis & { __clerkExpoDebug?: (message: string) => void }).__clerkExpoDebug
    }
  }, [addDebugEvent])

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <DebugEventsContext.Provider value={addDebugEvent}>
        <AuthStateContent />
        <DebugEvents events={events} />
      </DebugEventsContext.Provider>
    </ClerkProvider>
  )
}

function AuthStateContent() {
  const { isLoaded, isSignedIn } = useAuth()
  const [showNativeAuth, setShowNativeAuth] = useState(false)
  const addDebugEvent = useDebugEvent()

  console.log('[ClerkExpoSync Quickstart] AuthStateContent render', { isLoaded, isSignedIn })
  useEffect(() => {
    console.log('[ClerkExpoSync Quickstart] AuthStateContent state changed', { isLoaded, isSignedIn })
    addDebugEvent(`AuthStateContent loaded=${String(isLoaded)} signedIn=${String(isSignedIn)}`)
  }, [addDebugEvent, isLoaded, isSignedIn])

  if (!isLoaded) {
    return null
  }

  return (
    <>
      {isSignedIn ? <SignedInScreen /> : <SignInScreen onPresentNativeAuth={() => setShowNativeAuth(true)} />}
      <Modal visible={showNativeAuth} animationType="slide" presentationStyle="pageSheet">
        <AuthView mode="signInOrUp" onDismiss={() => setShowNativeAuth(false)} />
      </Modal>
    </>
  )
}

function DebugEvents({ events }: { events: Array<{ id: number; message: string }> }) {
  return (
    <View pointerEvents="none" style={styles.debugPanel}>
      <Text style={styles.debugTitle}>Debug events</Text>
      {events.map(event => (
        <Text key={event.id} numberOfLines={1} style={styles.debugText}>
          {event.message}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  debugPanel: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
  },
  debugTitle: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
  },
})

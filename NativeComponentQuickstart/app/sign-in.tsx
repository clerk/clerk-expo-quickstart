import { useAuth } from '@clerk/expo'
import { AuthView } from '@clerk/expo/native'
import { Stack, useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'

// The auth flow pushed as a route. Clerk never leaves the route on its own, so
// this screen decides what completion means — here, pop back where we came from.
export default function SignInRoute() {
  const { sessionId } = useAuth()
  const router = useRouter()
  const initialSessionId = useRef(sessionId)

  useEffect(() => {
    if (sessionId && sessionId !== initialSessionId.current) {
      router.back()
    }
  }, [sessionId, router])

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthView isDismissible={false} onHostBack={() => router.back()} />
    </>
  )
}

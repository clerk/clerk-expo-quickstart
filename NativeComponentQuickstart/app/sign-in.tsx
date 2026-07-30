import { AuthScreen } from '@clerk/expo/native/router'

// Flavor 2 (auth): the sign-in flow pushed as a route under the app's header.
export default function SignInRoute() {
  return <AuthScreen options={{ title: 'Sign in' }} />
}

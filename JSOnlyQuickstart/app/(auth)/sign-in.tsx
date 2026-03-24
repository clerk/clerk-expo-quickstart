import * as React from 'react'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { useSSO } from '@clerk/expo'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { type Href, useRouter } from 'expo-router'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import { OAuthStrategy } from '@clerk/types'

// Preloads the browser for Android devices to reduce authentication load time
// See: https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS !== 'android') return
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function Page() {
  useWarmUpBrowser()

  const { startSSOFlow } = useSSO()
  const router = useRouter()
  const [submittingStrategy, setSubmittingStrategy] = React.useState<OAuthStrategy | null>(null)

  const onPress = async (oauthStrategy: OAuthStrategy) => {
    setSubmittingStrategy(oauthStrategy)
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: oauthStrategy,
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: 'clerkexpoquickstart',
          path: '/continue',
        }),
      })

      // If the session was created, set it as the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session, decorateUrl }) => {
            // Handle session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            if (session?.currentTask) {
              console.log(session?.currentTask)
              return
            }

            // If no session tasks, navigate the signed-in user to the home page
            const url = decorateUrl('/')
            if (url.startsWith('http')) {
              window.location.href = url
            } else {
              router.push(url as Href)
            }
          },
        })
      } else {
        // If the session was not created, navigate to the continue page to collect missing information
        router.push('/continue')
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setSubmittingStrategy(null)
    }
  }

  const providers = [
    { strategy: 'oauth_google', name: 'Google' },
    { strategy: 'oauth_github', name: 'GitHub' },
  ]

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Sign in
      </ThemedText>
      <ThemedText style={styles.subtitle}>Choose a provider to continue</ThemedText>
      <View style={styles.buttonContainer}>
        {providers.map((provider) => {
          const strategy = provider.strategy as OAuthStrategy
          const isThisProviderLoading = submittingStrategy === strategy
          const isAnyLoading = submittingStrategy !== null

          return (
            <Pressable
              key={provider.strategy}
              style={({ pressed }) => [
                styles.button,
                isAnyLoading && !isThisProviderLoading && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => onPress(strategy)}
              disabled={isAnyLoading}
            >
              <ThemedText style={styles.buttonText}>
                {isThisProviderLoading ? 'Opening…' : `Sign in with ${provider.name}`}
              </ThemedText>
            </Pressable>
          )
        })}
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.85,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'stretch',
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
  linkContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 12,
    alignItems: 'center',
  },
})

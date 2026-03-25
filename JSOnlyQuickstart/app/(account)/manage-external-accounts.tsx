import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useUser } from '@clerk/expo'
import * as AuthSession from 'expo-auth-session'
import { ExternalAccountResource, OAuthStrategy } from '@clerk/types'
import { Redirect } from 'expo-router'
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native'

// Capitalize the first letter of the provider name
// E.g. 'discord' -> 'Discord'
const capitalize = (provider: string) => {
  return `${provider.slice(0, 1).toUpperCase()}${provider.slice(1)}`
}

// Remove the 'oauth' prefix from the strategy string
// E.g. 'oauth_discord' -> 'discord'
// Used to match the strategy with the 'provider' field in externalAccounts
const normalizeProvider = (provider: string) => {
  return provider.split('_')[1]
}

export default function AddAccount() {
  const { isLoaded, isSignedIn, user } = useUser()

  // List the options the user can select when adding a new external account
  // Edit this array to include all of your enabled SSO connections
  const options: OAuthStrategy[] = ['oauth_discord', 'oauth_google', 'oauth_github']

  // Handle adding the new external account
  const addSSO = async (strategy: OAuthStrategy) => {
    await user
      ?.createExternalAccount({
        strategy,
        // Redirect back to the app after the user authenticates with the external provider
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: 'clerkexpoquickstart',
          path: '/account/manage-external-accounts',
        }),
      })
      .then((res) => {
        if (res?.verification?.externalVerificationRedirectURL) {
          Linking.openURL(res.verification.externalVerificationRedirectURL.href)
        }
      })
      .catch((err) => {
        console.log('ERROR', err)
      })
      .finally(() => {
        console.log('Redirected user to oauth provider')
      })
  }

  // Handle removing an external account
  const removeAccount = async (account: ExternalAccountResource) => {
    try {
      await account.destroy()
      await user?.reload()
    } catch (err) {
      console.error('Error removing account:', err)
    }
  }

  // Handle loading state
  if (!isLoaded) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    )
  }

  // Handle signed-out state
  if (!isSignedIn) return <Redirect href="/sign-in" />

  // Find the external accounts from the options array that the user has not yet added to their account
  // This prevents showing an 'add' button for existing external account types
  const unconnectedOptions = options.filter(
    (option) => !user?.externalAccounts.some((account) => account.provider === normalizeProvider(option))
  )

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Manage External Accounts
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Connected accounts
          </ThemedText>

          {user?.externalAccounts.length === 0 ? (
            <ThemedText style={styles.infoText}>No external accounts connected</ThemedText>
          ) : (
            <FlatList
              data={user?.externalAccounts}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item: account }) => (
                <View style={styles.accountCard}>
                  <View style={styles.accountInfo}>
                    <ThemedText style={styles.accountProvider}>{capitalize(account.provider)}</ThemedText>
                    <ThemedText style={styles.accountDetail}>Scopes: {account.approvedScopes}</ThemedText>
                    <View style={styles.statusRow}>
                      <ThemedText style={styles.accountDetail}>Status: </ThemedText>
                      {account.verification?.status === 'verified' ? (
                        <ThemedText style={styles.verifiedText}>{capitalize(account.verification?.status)}</ThemedText>
                      ) : (
                        <ThemedText style={styles.errorText}>{account.verification?.error?.longMessage}</ThemedText>
                      )}
                    </View>
                  </View>

                  <View style={styles.accountActions}>
                    {account.verification?.status !== 'verified' &&
                      account.verification?.externalVerificationRedirectURL && (
                        <Pressable
                          style={({ pressed }) => [styles.smallButton, pressed && styles.buttonPressed]}
                          onPress={() =>
                            Linking.openURL(account.verification?.externalVerificationRedirectURL?.href || '')
                          }
                        >
                          <ThemedText style={styles.smallButtonText}>
                            Reverify {capitalize(account.provider)}
                          </ThemedText>
                        </Pressable>
                      )}

                    <Pressable
                      style={({ pressed }) => [
                        styles.smallButton,
                        styles.dangerButton,
                        pressed && styles.buttonPressed,
                      ]}
                      onPress={() => removeAccount(account)}
                    >
                      <ThemedText style={styles.dangerButtonText}>Remove {capitalize(account.provider)}</ThemedText>
                    </Pressable>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        {unconnectedOptions.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Add a new external account
            </ThemedText>

            <View style={styles.optionsList}>
              {unconnectedOptions.map((strategy) => (
                <Pressable
                  key={strategy}
                  style={({ pressed }) => [styles.optionButton, pressed && styles.buttonPressed]}
                  onPress={() => addSSO(strategy)}
                >
                  <ThemedText style={styles.optionButtonText}>Add {capitalize(normalizeProvider(strategy))}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
  },
  accountCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  accountInfo: {
    gap: 6,
  },
  accountProvider: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
  },
  accountDetail: {
    fontSize: 14,
    opacity: 0.8,
    color: '#11181C',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
    fontWeight: '500',
    flex: 1,
  },
  accountActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  smallButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#c62828',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  dangerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  optionsList: {
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
})

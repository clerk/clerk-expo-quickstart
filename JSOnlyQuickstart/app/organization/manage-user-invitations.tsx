import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useOrganizationList } from '@clerk/expo'
import * as React from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native'

export default function UserInvitationsList() {
  const [acceptingId, setAcceptingId] = React.useState<string | null>(null)

  const { isLoaded, userInvitations } = useOrganizationList({
    userInvitations: {
      infinite: true,
      keepPreviousData: true,
    },
  })

  if (!isLoaded || userInvitations.isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Organization invitations
      </ThemedText>
      {userInvitations.data && userInvitations.data.length > 0 ? (
        <>
          <ScrollView style={styles.scrollView}>
            {userInvitations.data?.map((invitation) => (
              <View key={invitation.id} style={styles.card}>
                <ThemedText style={styles.label}>Email:</ThemedText>
                <ThemedText style={styles.value}>{invitation.emailAddress}</ThemedText>

                <ThemedText style={styles.label}>Organization name:</ThemedText>
                <ThemedText style={styles.value}>{invitation.publicOrganizationData?.name || 'N/A'}</ThemedText>

                <ThemedText style={styles.label}>Role:</ThemedText>
                <ThemedText style={styles.value}>{invitation.role}</ThemedText>

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    acceptingId === invitation.id && styles.buttonDisabled,
                    pressed && styles.buttonPressed,
                  ]}
                  disabled={acceptingId === invitation.id}
                  onPress={async () => {
                    try {
                      setAcceptingId(invitation.id)
                      await invitation.accept()
                      await userInvitations.revalidate()
                    } catch (err) {
                      console.error(err)
                    } finally {
                      setAcceptingId(null)
                    }
                  }}
                >
                  <ThemedText style={styles.buttonText}>
                    {acceptingId === invitation.id ? 'Accepting…' : 'Accept'}
                  </ThemedText>
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <Pressable
            style={({ pressed }) => [
              styles.loadMoreButton,
              (!userInvitations.hasNextPage || userInvitations.isFetching) && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            disabled={!userInvitations.hasNextPage || userInvitations.isFetching}
            onPress={() => userInvitations.fetchNext?.()}
          >
            <ThemedText style={styles.buttonText}>Load more</ThemedText>
          </Pressable>
        </>
      ) : (
        <ThemedText>No invitations found</ThemedText>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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
})

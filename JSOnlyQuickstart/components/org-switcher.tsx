import CreateOrganization from '@/components/create-org' // See https://clerk.com/docs/guides/development/custom-flows/organizations/create-organizations for this component

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth, useOrganizationList, useUser } from '@clerk/expo'
import { type Href, useRouter } from 'expo-router'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native'

// List user's organization memberships
export const OrganizationSwitcher = () => {
  const router = useRouter()
  const { user } = useUser()
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: true,
  })
  const { orgId } = useAuth()

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading...</ThemedText>
      </View>
    )
  }

  console.log(user?.organizationMemberships)
  console.log(userMemberships)

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Joined organizations
      </ThemedText>
      {userMemberships?.data?.length > 0 && (
        <>
          <ScrollView style={styles.scrollView}>
            {userMemberships?.data?.map((mem) => (
              <View key={mem.id} style={styles.card}>
                <ThemedText style={styles.label}>Identifier:</ThemedText>
                <ThemedText style={styles.value}>{mem.publicUserData?.identifier || 'N/A'}</ThemedText>

                <ThemedText style={styles.label}>Organization:</ThemedText>
                <ThemedText style={styles.value}>{mem.organization.name}</ThemedText>

                <ThemedText style={styles.label}>Joined:</ThemedText>
                <ThemedText style={styles.value}>{mem.createdAt.toLocaleDateString()}</ThemedText>

                <ThemedText style={styles.label}>Role:</ThemedText>
                <ThemedText style={styles.value}>{mem.role}</ThemedText>

                <View style={styles.buttonContainer}>
                  {orgId === mem.organization.id ? (
                    <ThemedText style={styles.activeText}>Currently active</ThemedText>
                  ) : (
                    <Pressable
                      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                      onPress={() =>
                        void setActive?.({
                          organization: mem.organization.id,
                          navigate: ({ decorateUrl }) => {
                            const url = decorateUrl('/organization')
                            if (url.startsWith('http')) {
                              window.location.href = url
                            } else {
                              router.replace(url as Href)
                            }
                          },
                        })
                      }
                    >
                      <ThemedText style={styles.buttonText}>Set as active</ThemedText>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            <Pressable
              style={({ pressed }) => [
                styles.paginationButton,
                (!userMemberships?.hasPreviousPage || userMemberships?.isFetching) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              disabled={!userMemberships?.hasPreviousPage || userMemberships?.isFetching}
              onPress={() => userMemberships?.fetchPrevious?.()}
            >
              <ThemedText style={styles.buttonText}>Previous</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.paginationButton,
                (!userMemberships?.hasNextPage || userMemberships?.isFetching) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              disabled={!userMemberships?.hasNextPage || userMemberships?.isFetching}
              onPress={() => userMemberships?.fetchNext?.()}
            >
              <ThemedText style={styles.buttonText}>Next</ThemedText>
            </Pressable>
          </View>
        </>
      )}
      {userMemberships?.data?.length === 0 && (
        <View style={styles.emptyContainer}>
          <ThemedText>No organizations found</ThemedText>
          <CreateOrganization />
        </View>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
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
  activeText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  paginationButton: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
})

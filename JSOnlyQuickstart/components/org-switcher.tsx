import CreateOrganization from '@/components/create-org' // See https://clerk.com/docs/guides/development/custom-flows/organizations/create-organizations for this component

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth, useOrganizationList } from '@clerk/expo'
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native'

// List user's organization memberships
export const OrganizationSwitcher = () => {
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      // Set pagination parameters
      infinite: true,
    },
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

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Joined organizations
        </ThemedText>

        {userMemberships?.data && userMemberships.data.length > 0 ? (
          <FlatList
            data={userMemberships.data}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item: mem }) => (
              <View style={styles.card}>
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
                      onPress={() => void setActive?.({ organization: mem.organization.id })}
                    >
                      <ThemedText style={styles.buttonText}>Set as active</ThemedText>
                    </Pressable>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                    onPress={() => {
                      mem.destroy()
                      userMemberships?.revalidate()
                    }}
                  >
                    <ThemedText style={styles.buttonText}>Leave organization</ThemedText>
                  </Pressable>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText>No organizations found</ThemedText>
            <CreateOrganization />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    marginBottom: 20,
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  activeText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
})

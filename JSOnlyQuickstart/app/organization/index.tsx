import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'

export default function OrganizationScreen() {
  return (
    <ThemedView style={styles.container}>
      <Link href="/organization/joined-orgs">
        <ThemedText>Joined Organizations</ThemedText>
      </Link>
      <Link href="/organization/create">
        <ThemedText>Create Organization</ThemedText>
      </Link>
      <Link href="/organization/update">
        <ThemedText>Update Organization</ThemedText>
      </Link>
      <Link href="/organization/manage-org-invitations">
        <ThemedText>Manage Organization Invitations</ThemedText>
      </Link>
      <Link href="/organization/manage-user-invitations">
        <ThemedText>Manage User Invitations</ThemedText>
      </Link>
      <Link href="/organization/manage-roles">
        <ThemedText>Manage Roles</ThemedText>
      </Link>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
})

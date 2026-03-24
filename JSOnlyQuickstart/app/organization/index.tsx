import { OrganizationSwitcher } from '@/components/org-switcher'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'

export default function OrganizationScreen() {
  return (
    <ThemedView style={styles.container}>
      <OrganizationSwitcher />
      <Link href="/organization/manage-org-invitations">Manage Organization Invitations</Link>
      <Link href="/organization/manage-user-invitations">Manage User Invitations</Link>
      <Link href="/organization/manage-roles">Manage Roles</Link>
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

import { OrganizationSwitcher } from '@/components/org-switcher'
import { ThemedView } from '@/components/themed-view'
import { StyleSheet } from 'react-native'

export default function JoinedOrgsScreen() {
  return (
    <ThemedView style={styles.container}>
      <OrganizationSwitcher />
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

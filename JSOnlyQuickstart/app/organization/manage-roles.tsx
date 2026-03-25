import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useOrganization, useUser } from '@clerk/expo'
import type { OrganizationCustomRoleKey } from '@clerk/types'
import * as React from 'react'
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'

export const OrgMembersParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
}

// List of organization memberships. Administrators can
// change member Roles or remove members from the Organization.
export default function ManageRoles() {
  const { user } = useUser()
  const { isLoaded, memberships } = useOrganization(OrgMembersParams)

  if (!isLoaded) {
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
        Memberships List
      </ThemedText>
      {memberships?.data && memberships.data.length > 0 ? (
        <>
          <ScrollView style={styles.scrollView}>
            {memberships?.data?.map((mem) => (
              <View key={mem.id} style={styles.card}>
                <ThemedText style={styles.label}>User:</ThemedText>
                <ThemedText style={styles.value}>
                  {mem.publicUserData?.identifier} {mem.publicUserData?.userId === user?.id && '(You)'}
                </ThemedText>

                <ThemedText style={styles.label}>Joined:</ThemedText>
                <ThemedText style={styles.value}>{mem.createdAt.toLocaleDateString()}</ThemedText>

                <ThemedText style={styles.label}>Role:</ThemedText>
                <SelectRole
                  defaultRole={mem.role}
                  onRoleSelect={async (role) => {
                    await mem.update({
                      role: role,
                    })
                    await memberships?.revalidate()
                  }}
                />

                <Pressable
                  style={({ pressed }) => [styles.button, styles.removeButton, pressed && styles.buttonPressed]}
                  onPress={async () => {
                    await mem.destroy()
                    await memberships?.revalidate()
                  }}
                >
                  <ThemedText style={styles.buttonText}>Remove</ThemedText>
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            <Pressable
              style={({ pressed }) => [
                styles.paginationButton,
                (!memberships?.hasPreviousPage || memberships?.isFetching) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              disabled={!memberships?.hasPreviousPage || memberships?.isFetching}
              onPress={() => memberships?.fetchPrevious?.()}
            >
              <ThemedText style={styles.buttonText}>Previous</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.paginationButton,
                (!memberships?.hasNextPage || memberships?.isFetching) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              disabled={!memberships?.hasNextPage || memberships?.isFetching}
              onPress={() => memberships?.fetchNext?.()}
            >
              <ThemedText style={styles.buttonText}>Next</ThemedText>
            </Pressable>
          </View>
        </>
      ) : (
        <ThemedText>No memberships found</ThemedText>
      )}
    </ThemedView>
  )
}

type SelectRoleProps = {
  onRoleSelect?: (role: OrganizationCustomRoleKey) => void
  defaultRole?: string
}

/** Resolved value of `organization.getRoles()` (Promise result). */
type OrganizationRolesPage = {
  data: { key: OrganizationCustomRoleKey }[]
  has_role_set_migration?: boolean
}

const SelectRole = (props: SelectRoleProps) => {
  const { onRoleSelect, defaultRole } = props
  const { organization } = useOrganization()
  const [rolesResponse, setRolesResponse] = React.useState<OrganizationRolesPage | null>(null)
  const [showModal, setShowModal] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<OrganizationCustomRoleKey | undefined>(
    defaultRole as OrganizationCustomRoleKey | undefined
  )
  const isPopulated = React.useRef(false)

  React.useEffect(() => {
    if (isPopulated.current) return
    organization
      ?.getRoles({
        pageSize: 20,
        initialPage: 1,
      })
      .then((res) => {
        isPopulated.current = true
        setRolesResponse(res)
      })
  }, [organization?.id])

  React.useEffect(() => {
    setSelectedRole(defaultRole as OrganizationCustomRoleKey | undefined)
  }, [defaultRole])

  if (!rolesResponse?.data?.length) return null

  // When `has_role_set_migration` is `true`, updating organization membership roles is not allowed.
  const isDisabled = !!rolesResponse.has_role_set_migration

  const roleKeys = rolesResponse.data.map((role) => role.key)

  const handleRoleSelect = (role: OrganizationCustomRoleKey) => {
    setSelectedRole(role)
    setShowModal(false)
    onRoleSelect?.(role)
  }

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.selectButton,
          isDisabled && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => !isDisabled && setShowModal(true)}
        disabled={isDisabled}
      >
        <ThemedText style={styles.selectButtonText}>{selectedRole || 'Select role'}</ThemedText>
      </Pressable>
      <Modal visible={showModal} transparent animationType="slide">
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              Select Role
            </ThemedText>
            <ScrollView>
              {roleKeys?.map((roleKey) => (
                <Pressable
                  key={roleKey}
                  style={({ pressed }) => [
                    styles.roleOption,
                    selectedRole === roleKey && styles.roleOptionSelected,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => handleRoleSelect(roleKey)}
                >
                  <ThemedText
                    style={[styles.roleOptionText, selectedRole === roleKey && styles.roleOptionTextSelected]}
                  >
                    {roleKey}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={() => setShowModal(false)}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </Modal>
    </View>
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
  selectButton: {
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.45)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.18)',
  },
  selectButtonText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  removeButton: {
    backgroundColor: '#dc3545',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    gap: 16,
  },
  modalTitle: {
    marginBottom: 16,
  },
  roleOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  roleOptionSelected: {
    backgroundColor: '#0a7ea4',
  },
  roleOptionText: {
    fontSize: 16,
  },
  roleOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
})

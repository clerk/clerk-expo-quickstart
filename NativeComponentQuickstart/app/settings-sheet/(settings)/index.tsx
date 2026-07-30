import { useAuth } from '@clerk/expo'
import { Stack, useRouter } from 'expo-router'
import { Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'

import clerkTheme from '../../../clerk-theme.json'

const liquidGlass = Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 26

export default function SettingsSheetHome() {
  const { isSignedIn } = useAuth({ treatPendingAsSignedOut: false })
  const router = useRouter()
  const colorScheme = useColorScheme()
  const dark = colorScheme === 'dark'

  const rowColor = dark ? '#FFFFFF' : '#1B1B1B'
  const cardColor = dark ? '#1C1C1E' : '#FFFFFF'
  const sheetColor = dark ? clerkTheme.darkColors.muted : clerkTheme.colors.muted

  const rows = [
    { label: isSignedIn ? 'Account' : 'Sign in', onPress: () => router.push('/settings-sheet/auth') },
    { label: 'Appearance', onPress: () => {} },
    { label: 'Legal', onPress: () => {} },
  ]

  return (
    <>
      <Stack.Screen
        options={{
          contentStyle: { backgroundColor: sheetColor },
          title: 'Settings',
          ...(Platform.OS === 'android'
            ? {
                header: () => (
                  <View style={[styles.androidHeader, { backgroundColor: cardColor }]}>
                    <View style={styles.androidHeaderSide} />
                    <Text style={[styles.androidHeaderTitle, { color: rowColor }]}>Settings</Text>
                    <View style={styles.androidHeaderSide}>
                      <Pressable
                        accessibilityLabel="Close Settings"
                        accessibilityRole="button"
                        hitSlop={8}
                        onPress={() => router.back()}
                        style={({ pressed }) => [
                          styles.closeButton,
                          {
                            backgroundColor: dark ? '#2C2C2E' : '#F2F2F7',
                            opacity: pressed ? 0.5 : 1,
                          },
                        ]}
                      >
                        <View style={styles.closeIcon}>
                          <View
                            style={[
                              styles.closeIconStroke,
                              { backgroundColor: rowColor, transform: [{ rotate: '45deg' }] },
                            ]}
                          />
                          <View
                            style={[
                              styles.closeIconStroke,
                              { backgroundColor: rowColor, transform: [{ rotate: '-45deg' }] },
                            ]}
                          />
                        </View>
                      </Pressable>
                    </View>
                  </View>
                ),
              }
            : undefined),
        }}
      />
      {Platform.OS === 'ios' ? (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button
            accessibilityLabel="Close Settings"
            icon="xmark"
            onPress={() => router.back()}
          />
        </Stack.Toolbar>
      ) : null}
      {/* Keep the automatic native inset for scroll-edge behavior, then remove
          only the duplicate inset introduced by the hidden outer stack. */}
      <ScrollView
        contentInset={liquidGlass ? { top: -12 } : undefined}
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: sheetColor }}
      >
        <View style={{ padding: 16 }}>
          <View style={{ borderRadius: 12, backgroundColor: cardColor, overflow: 'hidden' }}>
            {rows.map((row, index) => (
              <Pressable
                key={row.label}
                onPress={row.onPress}
                style={({ pressed }) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: dark ? '#2C2C2E' : '#EEEEEF',
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Text style={{ fontSize: 17, color: rowColor }}>{row.label}</Text>
                <Text style={{ fontSize: 17, color: '#9999A1' }}>›</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  androidHeader: {
    height: 64,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  androidHeaderSide: {
    width: 48,
    alignItems: 'center',
  },
  androidHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconStroke: {
    position: 'absolute',
    width: 2,
    height: 24,
    borderRadius: 1,
  },
})

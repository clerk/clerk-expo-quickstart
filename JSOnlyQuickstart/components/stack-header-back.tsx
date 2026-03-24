import type { Href } from 'expo-router'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text } from 'react-native'

type Props = {
  fallbackHref: Href
  label?: string
}

export function StackHeaderBack({ fallbackHref, label = 'Back' }: Props) {
  const router = useRouter()

  return (
    <Pressable
      onPress={() => {
        if (router.canGoBack()) {
          router.back()
        } else {
          router.replace(fallbackHref)
        }
      }}
      hitSlop={12}
      style={styles.hit}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  hit: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  label: {
    fontSize: 17,
    color: '#0a7ea4',
    fontWeight: '500',
  },
})

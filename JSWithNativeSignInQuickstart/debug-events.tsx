import { createContext, useContext } from 'react'

export const DebugEventsContext = createContext<(message: string) => void>(() => {})

export function useDebugEvent() {
  return useContext(DebugEventsContext)
}

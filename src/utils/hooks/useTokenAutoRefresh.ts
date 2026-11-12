import { AppState } from 'react-native'
import { useEffect, useRef } from 'react'
import { refreshUserToken } from '../authUtils'
import { store } from '../../redux/store'

const REFRESH_INTERVAL_HOURS = 12

export function useTokenAutoRefresh() {
  const appState = useRef(AppState.currentState)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const refreshTokenIfNeeded = async () => {
      try {
        // Routes through authUtils's shared lock (inFlightRefresh) instead
        // of refreshing inline - this used to call its own independent
        // refreshAsync() on mount/every 12h/on app-foreground, racing
        // against axiosConfig.ts's interceptor-driven refresh with no
        // coordination between them whenever both fired for the same
        // expired token.
        await refreshUserToken(store.dispatch)
      } catch (err) {
        console.error('Error auto-refreshing token:', err)
      }
    }

    // Initial refresh check when component mounts
    refreshTokenIfNeeded()

    // Check every 12 hours
    intervalRef.current = setInterval(
      refreshTokenIfNeeded,
      REFRESH_INTERVAL_HOURS * 60 * 60 * 1000
    )

    // App foreground event
    const subscription = AppState.addEventListener('change', nextState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        refreshTokenIfNeeded() // check again when app becomes active
      }
      appState.current = nextState
    })

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      subscription.remove()
    }
  }, [])
}

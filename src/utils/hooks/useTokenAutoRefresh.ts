import * as SecureStore from 'expo-secure-store'
import { AppState } from 'react-native'
import { useEffect, useRef } from 'react'
import moment from 'moment'
import { refreshAsync } from 'expo-auth-session'
import { storeAccessTokens } from '../authUtils'
import { store } from '../../redux/store'

const tokenEndpoint =
  'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_signin'

const REFRESH_INTERVAL_HOURS = 12

export function useTokenAutoRefresh() {
  const appState = useRef(AppState.currentState)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const refreshTokenIfNeeded = async () => {
      try {
        const { isConnected, isInternetReachable } =
          store.getState().connectivity

        if (!isConnected || !isInternetReachable) {
          console.log('No network connection, skipping token refresh')
          return
        }

        const expiresAt = await SecureStore.getItemAsync(
          'userAccessTokenExpiresAt'
        )
        const refreshToken = await SecureStore.getItemAsync('userRefreshToken')
        const clientId = process.env.EXPO_PUBLIC_CLIENT_ID

        if (!expiresAt || !refreshToken) return

        console.log('REFRESH TOKEN')
        const response = await refreshAsync(
          { clientId, refreshToken },
          { tokenEndpoint }
        )

        if (response.accessToken !== null && response.refreshToken !== null) {
          // Save new tokens
          const { accessToken, refreshToken, idToken, issuedAt, expiresIn } =
            response

          await storeAccessTokens({
            accessToken,
            refreshToken: refreshToken,
            idToken,
            expiresIn,
            issuedAt,
          })
        }
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

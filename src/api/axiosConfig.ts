import axios, {
  AxiosResponse,
  AxiosRequestTransformer,
  AxiosRequestConfig,
} from 'axios'
import { camelizeKeys } from 'humps'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'
import { refreshAsync } from 'expo-auth-session'
import moment from 'moment'
import { store } from '../redux/store'
import { setForcedLogoutModalOpen } from '../redux/reducers/userAuthSlice'

import {
  // @ts-ignore
  EXPO_PUBLIC_CLIENT_ID,
} from '@env'
import { storeAccessTokens } from '../utils/authUtils'

const dateTransformer: AxiosRequestTransformer = (data: any) => {
  if (data instanceof Date) {
    // do your specific formatting here
    return data.toISOString()
  }
  if (Array.isArray(data)) {
    return data.map(val => dateTransformer(val))
  }
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [key, dateTransformer(val)])
    )
  }
  return data
}

// Function to convert UTC date strings to local Date objects
const convertUTCToLocal: any = (data: any) => {
  if (
    typeof data === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(data)
  ) {
    // Convert to local time
    return moment.utc(data).local().format()
  } else if (Array.isArray(data)) {
    // Recursively process each item in an array
    return data.map(convertUTCToLocal)
  } else if (typeof data === 'object' && data !== null) {
    // Recursively process each property of an object
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        convertUTCToLocal(value),
      ])
    )
  }
  return data
}

const controller = new AbortController()

const baseURL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BASE_URL
const api = axios.create({
  baseURL,
  transformRequest: [dateTransformer].concat(
    axios.defaults.transformRequest as AxiosRequestTransformer[]
  ),
  transformResponse: [
    data => {
      try {
        let parsed = JSON.parse(data)
        return convertUTCToLocal(parsed)
      } catch (e) {
        return data // Return as-is if it's not valid JSON
      }
    },
  ],
  timeout: 10000,
  signal: controller.signal,
})

// Axios middleware to retrieve and add authorization token
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const { isConnected, isInternetReachable } = store.getState().connectivity

      //Attempt to refresh token only if there is a network connection
      if (isConnected) {
        const accessToken = await SecureStore.getItemAsync('userAccessToken')
        const idToken = await SecureStore.getItemAsync('userIdToken')
        const tokenExpiresAt = await SecureStore.getItemAsync(
          'userAccessTokenExpiresAt'
        )
        const tokenIsExpired = moment().isAfter(tokenExpiresAt)
        if (!tokenIsExpired && accessToken && idToken) {
          const newConfig = config as any
          newConfig.headers['Authorization'] = `Bearer ${accessToken}`
          newConfig.headers['idToken'] = idToken
          return newConfig
        }

        try {
          //refreshAsync to exchange for new token
          const existingRefreshToken =
            (await SecureStore.getItemAsync('userRefreshToken')) || undefined

          if (!existingRefreshToken) {
            store.dispatch(setForcedLogoutModalOpen(true))
            // No refresh token available — allow request to continue without modifying headers
            return config
          }

          const tokenEndpoint =
            'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/b2c_1_signin/oauth2/v2.0/token'

          try {
            const refreshResponse = await refreshAsync(
              {
                clientId: EXPO_PUBLIC_CLIENT_ID,
                refreshToken: existingRefreshToken,
              },
              { tokenEndpoint }
            )

            if (refreshResponse.accessToken) {
              const {
                accessToken,
                refreshToken,
                idToken,
                issuedAt,
                expiresIn,
              } = refreshResponse

              await storeAccessTokens({
                accessToken,
                refreshToken: refreshToken,
                idToken,
                expiresIn,
                issuedAt,
              })

              const newConfig = config as AxiosRequestConfig<any>

              //@ts-ignore - this is a hack to add the headers to the config
              newConfig.headers['Authorization'] = `Bearer ${accessToken}`
              //@ts-ignore - see above
              newConfig.headers['idToken'] = idToken as string

              return newConfig
            }
            } catch (error) {
              console.error('Error refreshing token:', error)
            }

            if (accessToken && idToken) {
              const newConfig = config as any
              newConfig.headers['Authorization'] = `Bearer ${accessToken}`
              newConfig.headers['idToken'] = idToken
              return newConfig
            }

            // If we reach here, allow the request to proceed without auth headers
            return config
          } catch (error) {
            return config
          }
      }

      // If not connected (or we didn't return earlier), allow the request to proceed unchanged
      return config
    } catch (error) {
      console.error('Error in Axios request interceptor:', error)
      // Ensure we always return a config or a rejection. Allow request to proceed.
      return config
    }
  },
  error => {
    return Promise.reject(error)
  }
)

// Axios middleware to convert all api responses to camelCase
api.interceptors.response.use(
  (response: AxiosResponse) => {
    try {
      const contentType = (response.headers && response.headers['content-type']) || ''
      if (response.data && typeof contentType === 'string' && contentType.includes('application/json')) {
        response.data = camelizeKeys(response.data)
      }
    } catch (err) {
      // If headers are malformed, don't crash — just return response as-is
      console.error('Error processing response headers:', err)
    }
    return response
  },
  function (error) {
    const { response } = error
    //console.log('error axios from config: ', response)
    if (response?.status === 401) {
      console.log('unauthorized. token needs to be refreshed')
      // unauthorized
      // sign out?
    } else if (response?.status === 403) {
      // forbidden
      // handle
    } else if (response?.status === 404) {
      // forbidden
      // handle
    }
    return Promise.reject(error)
  }
)

export default api

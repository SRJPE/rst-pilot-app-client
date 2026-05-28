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

let refreshPromise: Promise<void> | null = null

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
      const { isConnected } = store.getState().connectivity

      if (isConnected) {
        const accessToken = await SecureStore.getItemAsync('userAccessToken')
        const idToken = await SecureStore.getItemAsync('userIdToken')
        const tokenExpiresAt = await SecureStore.getItemAsync('userAccessTokenExpiresAt')
        const tokenIsExpired = moment().isAfter(tokenExpiresAt)

        if (!tokenIsExpired && accessToken && idToken) {
          const newConfig = config as any
          newConfig.headers['Authorization'] = `Bearer ${accessToken}`
          newConfig.headers['idToken'] = idToken
          return newConfig
        }

        const existingRefreshToken =
          (await SecureStore.getItemAsync('userRefreshToken')) || undefined

        if (!existingRefreshToken) {
          store.dispatch(setForcedLogoutModalOpen(true))
          return config
        }

        const tokenEndpoint =
          'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/b2c_1_signin/oauth2/v2.0/token'

        if (!refreshPromise) {
          refreshPromise = refreshAsync(
            { clientId: EXPO_PUBLIC_CLIENT_ID, refreshToken: existingRefreshToken },
            { tokenEndpoint }
          )
            .then(async refreshResponse => {
              if (refreshResponse.accessToken) {
                const { accessToken, refreshToken, idToken, issuedAt, expiresIn } = refreshResponse
                await storeAccessTokens({ accessToken, refreshToken, idToken, expiresIn, issuedAt })
              }
            })
            .catch(error => {
              console.error('Error refreshing token:', error)
            })
            .finally(() => {
              refreshPromise = null
            })
        }

        try {
          await refreshPromise

          const freshAccessToken = await SecureStore.getItemAsync('userAccessToken')
          const freshIdToken = await SecureStore.getItemAsync('userIdToken')

          if (freshAccessToken && freshIdToken) {
            const newConfig = config as any
            newConfig.headers['Authorization'] = `Bearer ${freshAccessToken}`
            newConfig.headers['idToken'] = freshIdToken
            return newConfig
          }
        } catch (error) {
          console.error('Error awaiting token refresh:', error)
        }
      }

      return config
    } catch (error) {
      console.error('Error in Axios request interceptor:', error)
      return config
    }
  },
  error => Promise.reject(error)
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

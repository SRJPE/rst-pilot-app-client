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
  REACT_APP_CLIENT_ID,
} from '@env'
import { storeAccessTokens } from '../utils/authUtils'

const dateTransformer: AxiosRequestTransformer = (data: any) => {
  if (data instanceof Date) {
    // do your specific formatting here
    return data.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
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
const baseURL = Constants.expoConfig?.extra?.REACT_APP_BASE_URL
const api = axios.create({
  baseURL,
  transformRequest: [dateTransformer].concat(
    axios.defaults.transformRequest as AxiosRequestTransformer[]
  ),
})

// Axios middleware to retrieve and add authorization token
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const accessToken = await SecureStore.getItemAsync('userAccessToken')

    const idToken = await SecureStore.getItemAsync('userIdToken')
    const tokenExpiresAt = await SecureStore.getItemAsync(
      'userAccessTokenExpiresAt'
    )
    const tokenIsExpired = moment().isAfter(tokenExpiresAt)
    try {
      console.log(
        '🚀 ~ file: axiosConfig.ts:55 ~ tokenIsExpired:',
        tokenIsExpired
      )

      if (tokenIsExpired) {
        //refreshAsync to exchave for new token
        const existingRefreshToken =
          (await SecureStore.getItemAsync('userRefreshToken')) || undefined

        if (!existingRefreshToken) {
          store.dispatch(setForcedLogoutModalOpen(true))
        }

        const tokenEndpoint =
          'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_signin'

        const refreshResponse = await refreshAsync(
          {
            clientId: REACT_APP_CLIENT_ID,
            refreshToken: existingRefreshToken,
          },
          { tokenEndpoint }
        )

        if (refreshResponse.accessToken) {
          const { accessToken, refreshToken, idToken, issuedAt, expiresIn } =
            refreshResponse

          await storeAccessTokens({
            accessToken,
            refreshToken,
            idToken,
            expiresIn,
            issuedAt,
          })
          console.log(
            '🚀 ~ file: axiosConfig.ts:90 ~ Tokens refreshed from the Axios Middleware'
          )

          const newConfig = config as any
          newConfig.headers['Authorization'] = `Bearer ${accessToken}`
          newConfig.headers['idToken'] = idToken
          return newConfig
        }
      }

      if (accessToken && idToken) {
        const newConfig = config as any
        newConfig.headers['Authorization'] = `Bearer ${accessToken}`
        newConfig.headers['idToken'] = idToken
        return newConfig
      }
      return config
    } catch (error) {
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
    if (
      response.data &&
      response.headers['content-type'].includes('application/json')
    ) {
      response.data = camelizeKeys(response.data)
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

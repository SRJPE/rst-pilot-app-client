import axios, {
  AxiosResponse,
  AxiosRequestTransformer,
  AxiosRequestConfig,
} from 'axios'
import { camelizeKeys } from 'humps'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'

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
    try {
      const accessToken = await SecureStore.getItemAsync('userAccessToken')
      const idToken = await SecureStore.getItemAsync('userIdToken')

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
    console.log('error axios from config: ', response)
    if (response?.status === 401) {
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

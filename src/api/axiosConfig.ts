import axios, { AxiosResponse } from 'axios'
import { camelizeKeys } from 'humps'
import Constants from 'expo-constants'

const baseURL = Constants.expoConfig?.extra?.REACT_APP_BASE_URL
const api = axios.create({ baseURL })

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
    }
    return Promise.reject(error)
  }
)

export default api

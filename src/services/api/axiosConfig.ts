import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080'
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api

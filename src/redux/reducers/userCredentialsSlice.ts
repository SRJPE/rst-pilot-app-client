import { createSlice } from '@reduxjs/toolkit'
import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import api from '../../api/axiosConfig'
import { cloneDeep } from 'lodash'

interface InitialStateI {
  // storedCredentials: any
  displayName: string | null
  emailAddress: string | null
  azureUid: string | null
}
const initialState: InitialStateI = {
  // storedCredentials: null,
  displayName: null,
  emailAddress: null,
  azureUid: null,
}

export const userCredentialsSlice = createSlice({
  name: 'userCredentials',
  initialState: initialState,
  reducers: {
    clearUserCredentials: state => {
      ;(async () => {
        try {
          await api.post(`user/${state.azureUid}/logout`)
          await SecureStore.deleteItemAsync('userAccessToken')
          await SecureStore.deleteItemAsync('userRefreshToken')
          await SecureStore.deleteItemAsync('userIdToken')
        } catch (error) {
          console.log('🚀 ~ ; ~ error:', error)

          throw error
        }
        console.log('🚀 ~ ; ~ initialState:', initialState)
        return (state = cloneDeep(initialState))
      })()
    },
    saveUserCredentials: (state, action) => {
      console.log('PAYLOAD: ', action.payload)
      // state.storedCredentials = action.payload
      return (state = { ...action.payload })
    },
  },
})

export const { saveUserCredentials, clearUserCredentials } =
  userCredentialsSlice.actions

export default userCredentialsSlice.reducer

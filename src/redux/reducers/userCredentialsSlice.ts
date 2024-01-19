import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import api from '../../api/axiosConfig'
import { cloneDeep } from 'lodash'
import { RootState } from '../store'

interface InitialStateI {
  displayName: string | null
  emailAddress: string | null
  azureUid: string | null
}
const initialState: InitialStateI = {
  displayName: null,
  emailAddress: null,
  azureUid: null,
}

export const userCredentialsSlice = createSlice({
  name: 'userCredentials',
  initialState: initialState,
  reducers: {
    clearUserCredentials: state => {
      api
        .post(`user/${state.azureUid}/logout`)
        .then(response => {
          SecureStore.deleteItemAsync('userAccessToken')
            .then(response => SecureStore.deleteItemAsync('userRefreshToken'))
            .then(response => SecureStore.deleteItemAsync('userIdToken'))
            .finally(() => console.log('Tokens Deleted'))
        })
        .catch(err => {
          throw err
        })
      console.log('state should be empty', initialState)
      return (state = cloneDeep(initialState))
    },
    saveUserCredentials: (state, action) => {
      console.log('PAYLOAD: ', action.payload)
      // state.storedCredentials = action.payload
      return (state = { ...action.payload })
    },
    changePassword: (state, action) => {
      api
        .post(`user/${state.azureUid}/change-password`, action.payload)
        .then(response =>
          console.log(
            `Request Status: (${response.status}) ${response.statusText}`
          )
        )
    },
  },
})

export const { saveUserCredentials, clearUserCredentials, changePassword } =
  userCredentialsSlice.actions

export default userCredentialsSlice.reducer

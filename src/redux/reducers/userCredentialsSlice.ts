import { createSlice } from '@reduxjs/toolkit'
import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'

interface InitialStateI {
  storedCredentials: any
}

const initialState: InitialStateI = {
  storedCredentials: null,
}

export const userCredentialsSlice = createSlice({
  name: 'userCredentials',
  initialState: initialState,
  reducers: {
    clearUserCredentials: state => {
      state.storedCredentials = null
    },
    saveUserCredentials: (state, action) => {
      console.log('PAYLOAD: ', action.payload)
      state.storedCredentials = action.payload
    },
  },
})

export const { saveUserCredentials, clearUserCredentials } =
  userCredentialsSlice.actions

export default userCredentialsSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import * as SecureStore from 'expo-secure-store'
import { add, cloneDeep } from 'lodash'
import api from '../../api/axiosConfig'

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
    editProfile: (state, action) => {
      api
        .patch(`user/${state.azureUid}/edit`, { ...action.payload })
        .catch(err => {
          throw err
        })
      return (state = {
        azureUid: state.azureUid,
        displayName: `${action.payload.firstName} ${action.payload.lastName}`,
        ...action.payload,
      })
    },
    createNewUser: (_, action) => {
      api
        .post(`user/create`, action.payload)
        .then(response =>
          console.log(
            `Request Status: (${response.status}) ${response.statusText}`
          )
        )
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

export const {
  saveUserCredentials,
  clearUserCredentials,
  changePassword,
  editProfile,
  createNewUser,
} = userCredentialsSlice.actions

export default userCredentialsSlice.reducer

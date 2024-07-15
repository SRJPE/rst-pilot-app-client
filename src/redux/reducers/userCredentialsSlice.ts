import { createSlice } from '@reduxjs/toolkit'
import * as SecureStore from 'expo-secure-store'
import { add, cloneDeep } from 'lodash'
import api from '../../api/axiosConfig'

interface InitialStateI {
  displayName: string | null
  emailAddress: string | null
  azureUid: string | null
  firstName: string | null
  lastName: string | null
  agencyId: string | number | null
  role: 'lead' | 'non-lead' | null
  phone: string | null
}
const initialState: InitialStateI = {
  displayName: null,
  emailAddress: null,
  azureUid: null,
  firstName: null,
  lastName: null,
  agencyId: null,
  role: null,
  phone: null,
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
      api.patch(`user/${state.azureUid}`, { ...action.payload }).catch(err => {
        throw err
      })
      api.put(`/personnel/${state.azureUid}`, {
        ...action.payload,
      })
      return (state = {
        azureUid: state.azureUid,
        displayName: `${action.payload.first_name} ${action.payload.last_name}`,
        emailAddress: state.emailAddress,
        firstName: action.payload.first_name,
        lastName: action.payload.last_name,
        phone: action.payload.phone,
        agencyId: action.payload.agencyId,
        role: action.payload.role,
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

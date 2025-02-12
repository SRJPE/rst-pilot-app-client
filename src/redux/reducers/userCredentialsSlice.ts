import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as SecureStore from 'expo-secure-store'
import { add, cloneDeep } from 'lodash'
import api from '../../api/axiosConfig'
import { resetNavigationSlice } from './formSlices/navigationSlice'

export interface InitialStateI {
  displayName: string | null
  emailAddress: string | null
  azureUid: string | null
  firstName: string | null
  lastName: string | null
  agencyId: string | number | null
  agencyDefinition: string | null
  orcidId?: string | null
  role: 'lead' | 'non-lead' | null
  phone: string | null
  id: number | null
  userPrograms?: any | null | undefined
}
const initialState: InitialStateI = {
  displayName: null,
  emailAddress: null,
  azureUid: null,
  firstName: null,
  lastName: null,
  agencyId: null,
  agencyDefinition: null,
  role: null,
  phone: null,
  id: null,
  userPrograms: [],
}

// Async actions API calls
export const getUserPrograms = createAsyncThunk(
  'userCredentials/getUserPrograms',
  async (personnelId: number) => {
    try {
      const response: any = await api.get(`program/personnel/${personnelId}`)
      return response.data
    } catch (error: any) {
      console.log('err', error)
      throw error
    }
  }
)

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
            .then(response =>
              SecureStore.deleteItemAsync('userAccessTokenExpiresAt')
            )
            .finally(() => console.log('Tokens Deleted'))
        })
        .catch(err => {
          throw err
        })
      console.log('state should be empty', initialState)
      resetNavigationSlice()
      return (state = cloneDeep(initialState))
    },
    saveUserCredentials: (state, action) => {
      console.log('PAYLOAD: ', action.payload)
      // state.storedCredentials = action.payload
      return (state = { ...action.payload })
    },
    updateUserPrograms: (state, action) => {
      state.userPrograms = action.payload
      return state
    },
    editProfile: (state, action) => {
      api.patch(`user/${state.azureUid}`, { ...action.payload }).catch(err => {
        throw err
      })
      api.put(`/personnel/${state.azureUid}`, {
        ...action.payload,
      })
      return (state = {
        ...state,
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
  extraReducers: {
    // Add async and additional action types here, and handle loading state as needed
    [getUserPrograms.fulfilled.type]: (state, action) => {
      state.userPrograms = action.payload
    },
  },
})

export const {
  saveUserCredentials,
  clearUserCredentials,
  changePassword,
  editProfile,
  updateUserPrograms,
} = userCredentialsSlice.actions

export default userCredentialsSlice.reducer

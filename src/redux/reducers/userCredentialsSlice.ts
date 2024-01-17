import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import api from '../../api/axiosConfig'
import { cloneDeep } from 'lodash'
import { RootState } from '../store'

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

export const clearUserCreds = createAsyncThunk(
  'userCredentials/clearUserCreds',
  async (_, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState
    const { userCredentials } = rootState

    // thunkAPI.fulfillWithValue(inititalState)
    // thunkAPI.rejectWithValue()

    try {
      const res = await api.post(`user/${userCredentials.azureUid}/logout`)

      if (res.status === 200) {
        // thunkAPI.fulfillWithValue({ initialState })
        console.log('🚀 ~ ; ~ res:', res)
        await SecureStore.deleteItemAsync('userAccessToken')
        await SecureStore.deleteItemAsync('userRefreshToken')
        await SecureStore.deleteItemAsync('userIdToken')
      }
    } catch (error) {
      console.log('🚀 ~ ; ~ error:', error)
      thunkAPI.rejectWithValue(error)
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
            .finally(() => console.log('Tokens Deleted'))
        })
        .catch(err => {
          throw err
        })
      console.log('state should be empty', initialState)
      return (state = cloneDeep(initialState))
      // ;(async () => {
      //   try {
      //     const res = await api.post(`user/${state.azureUid}/logout`)
      //     state = cloneDeep(initialState)
      //     console.log('🚀 ~ ; ~ res:', res)
      //     await SecureStore.deleteItemAsync('userAccessToken')
      //     await SecureStore.deleteItemAsync('userRefreshToken')
      //     await SecureStore.deleteItemAsync('userIdToken')
      //   } catch (error) {
      //     console.log('🚀 ~ ; ~ error:', error)
      //     throw error
      //   }
      //   console.log('🚀 ~ ; ~ state that gets returned:', state)
      //   return state
      // })()
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
  extraReducers: {
    [clearUserCreds.fulfilled.type]: (state, action) => {
      // const {initialState} = action.payload
      state = initialState
      console.log('🚀 ~ state:', state)
      console.log('got initial state', initialState)
      console.log('🚀 ~ action:', action)
    },
    [clearUserCreds.rejected.type]: (state, action) => {
      const error = action.payload
      console.log('got error', error)
    },
  },
})

export const { saveUserCredentials, clearUserCredentials, changePassword } =
  userCredentialsSlice.actions

export default userCredentialsSlice.reducer

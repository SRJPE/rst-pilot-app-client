import { createSlice } from '@reduxjs/toolkit'

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
    clearUserCredentials: (state) => {
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

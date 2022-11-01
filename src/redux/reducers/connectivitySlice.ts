import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  isConnected: boolean
}


const initialState: InitialStateI = {
  isConnected: false
}

export const connectivitySlice = createSlice({
  name: 'catchRawPostBundler',
  initialState: initialState,
  reducers: {
    connectionChanged: (state, action) => {
      state.isConnected = action.payload
    },
  },
})

export const { connectionChanged } = connectivitySlice.actions

export default connectivitySlice.reducer

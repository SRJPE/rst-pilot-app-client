import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface InitialStateI {
  type: string
  isConnected: boolean
  isInternetReachable: boolean
}

// Connection Types: 
// - none
// - unknown
// - cellular
// - wifi
// - bluetooth
// - ethernet
// - wimax
// - vpn
// - other

const initialState: InitialStateI = {
  type: 'none',
  isConnected: false,
  isInternetReachable: false
}

export const connectivitySlice = createSlice({
  name: 'connectivitySlice',
  initialState: initialState,
  reducers: {
    connectionChanged: (state, action) => {
      const {type, isConnected, isInternetReachable} = action.payload
      state.type = type
      state.isConnected = isConnected
      state.isInternetReachable = isInternetReachable
    },
  },
})

export const { connectionChanged } = connectivitySlice.actions

export default connectivitySlice.reducer

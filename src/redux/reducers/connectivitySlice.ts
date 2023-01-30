import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postTrapVisitFormSubmissions } from './postSlices/trapVisitFormPostBundler'

interface InitialStateI {
  type: string
  isConnected: boolean
  isInternetReachable: boolean
  history: ConnectivityInfoI[]
}

const historyLengthLimit = 25

interface ConnectivityInfoI {
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
  isInternetReachable: false,
  history: [],
}

// Async actions API calls
export const connectionChanged = createAsyncThunk(
  'connectivitySlice/connectionChanged',
  async (connectionState: ConnectivityInfoI, thunkAPI) => {
    const payload = connectionState
    try {
      thunkAPI.dispatch(postTrapVisitFormSubmissions())
      return payload
    } catch (e) {
      return payload
    }
  }
)

export const connectivitySlice = createSlice({
  name: 'connectivitySlice',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [connectionChanged.fulfilled.type]: (state, action) => {
      const { type, isConnected, isInternetReachable } = action.payload
      const receipt = { type, isConnected, isInternetReachable }
      const historyCopy = state.history
      if (historyCopy.length < historyLengthLimit) {
        historyCopy.push(receipt)
      } else {
        historyCopy.shift()
        historyCopy.push(receipt)
      }
      state.type = type
      state.isConnected = isConnected
      state.isInternetReachable = isInternetReachable
      state.history = historyCopy
    },
    [connectionChanged.rejected.type]: (state, action) => {
      const { type, isConnected, isInternetReachable } = action.payload
      const receipt = { type, isConnected, isInternetReachable }
      const historyCopy = state.history
      if (historyCopy.length < historyLengthLimit) {
        historyCopy.push(receipt)
      } else {
        historyCopy.shift()
        historyCopy.push(receipt)
      }
      state.type = type
      state.isConnected = isConnected
      state.isInternetReachable = isInternetReachable
      state.history = historyCopy
    },
  },
})

export default connectivitySlice.reducer

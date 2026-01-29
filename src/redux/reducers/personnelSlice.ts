import api from '../../api/axiosConfig'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const uninitializedStatus = 'uninitialized'
const pendingStatus = 'pending'
const fulfilledStatus = 'fulfilled'
const rejectedStatus = 'rejected'

export interface PersonnelInitialStateI {
  personnelOptions: IndividualPersonnelValuesI[]
  status: string
}

const initialState: PersonnelInitialStateI = {
  personnelOptions: [],
  status: uninitializedStatus,
}

export interface IndividualPersonnelValuesI {
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  email: string | null
  isLead: boolean
  agency: string | null
  orcidId: string | null
  uid: string
}

interface APIResponseI {
  data: any
}

// // Async actions API calls
export const getPersonnelDefaults = createAsyncThunk(
  'personnel/get',
  async () => {
    try {
      const response: APIResponseI = await api.get(`personnel/`)
      return response.data
    } catch (error: any) {
      console.log('err', error.response.data.message)
      throw error
    }
  }
)

export const postPersonnel = createAsyncThunk(
  'personnel/post',
  async (values: any) => {
    try {
      const response: APIResponseI = await api.post(`personnel/`, values)
      return response.data
    } catch (error: any) {
      console.log('err', error.response.data.message)
      throw error
    }
  }
)

export const postPersonnelToTeam = createAsyncThunk(
  'personnel/postToTeam',
  async (values: any) => {
    try {
      const response: APIResponseI = await api.post(`personnel/team`, values)
      return response.data
    } catch (error: any) {
      console.log('err', error.response.data.message)
      throw error
    }
  }
)

export const deletePersonnelFromTeam = createAsyncThunk(
  'personnel/deleteFromTeam',
  async (values: any) => {
    try {
      const response: APIResponseI = await api.delete(`personnel/team`, {
        data: values,
      })
      return response.data
    } catch (error: any) {
      console.log('err', error.response.data.message)
      throw error
    }
  }
)

export const personnelSlice = createSlice({
  name: 'personnel',
  initialState: initialState,
  reducers: {
    savePersonnel: (state, action) => {
      // state.storedCredentials = action.payload
      return (state = { ...state, personnelOptions: [...action.payload] })
    },
  },
  extraReducers: {
    [getPersonnelDefaults.pending.type]: (state, action) => {
      state.status = pendingStatus
    },

    [getPersonnelDefaults.fulfilled.type]: (state, action) => {
      state.status = fulfilledStatus
      state.personnelOptions = action.payload
    },

    [postPersonnel.rejected.type]: (state, action) => {
      state.status = rejectedStatus
    },
    [postPersonnel.pending.type]: (state, action) => {
      state.status = pendingStatus
    },

    [postPersonnel.fulfilled.type]: (state, action) => {
      state.status = fulfilledStatus
      // state.personnelOptions = action.payload
    },

    [postPersonnel.rejected.type]: (state, action) => {
      state.status = rejectedStatus
    },
  },
})

export const { savePersonnel } = personnelSlice.actions

export default personnelSlice.reducer

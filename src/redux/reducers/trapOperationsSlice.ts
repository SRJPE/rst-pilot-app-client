import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  values: TrapOperationsValuesI
}

export interface TrapOperationsValuesI {
  coneDepth: string
  coneSetting: string
  totalRevolutions: string
  checked: any
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
}

const initialState: InitialStateI = {
  values: {
    coneDepth: '',
    coneSetting: '',
    totalRevolutions: '',
    checked: false,
    rpm1: 0,
    rpm2: 0,
    rpm3: 0,
  },
}

export const trapOperationsSlice = createSlice({
  name: 'trapOperations',
  initialState: initialState,
  reducers: {
    saveTrapOperations: (state, action) => {
      state.values = action.payload
    },
  },
})

export const { saveTrapOperations } = trapOperationsSlice.actions

export default trapOperationsSlice.reducer

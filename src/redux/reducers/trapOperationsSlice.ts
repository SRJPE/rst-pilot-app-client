import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  values: TrapOperationsValuesI
}

export interface TrapOperationsValuesI {
  coneDepth: string
  coneSetting: string
  checked: any
  totalRevolutions: number | null
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
}

const initialState: InitialStateI = {
  values: {
    coneDepth: '',
    coneSetting: '',
    checked: false,
    totalRevolutions: null,
    rpm1: null,
    rpm2: null,
    rpm3: null,
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

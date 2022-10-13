import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: TrapOperationsValuesI
}

export interface TrapOperationsValuesI {
  coneDepth: number | null
  coneSetting: string
  checked: string | boolean
  totalRevolutions: number | null
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    coneDepth: null,
    coneSetting: '',
    checked: '',
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
    markTrapOperationsCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const { saveTrapOperations, markTrapOperationsCompleted } =
  trapOperationsSlice.actions

export default trapOperationsSlice.reducer

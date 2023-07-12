import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

export interface TrappingProtocolsInitialStateI {
  trappingProtocolsStore: TrappingProtocolsStoreI
}

const initialState: TrappingProtocolsInitialStateI = {
  trappingProtocolsStore: {},
}

export interface TrappingProtocolsStoreI {
  [id: number]: IndividualTrappingProtocolValuesI
}
export interface IndividualTrappingProtocolValuesI {
  species: string
  run: string
  lifeStage: string
  numberMeasured: number | null
}
export const IndividualTrappingProtocolState: IndividualTrappingProtocolValuesI =
  {
    species: '',
    run: '',
    lifeStage: '',
    numberMeasured: null,
  }

export const trappingProtocolsSlice = createSlice({
  name: 'trappingProtocols',
  initialState: initialState,
  reducers: {
    resetTrappingProtocolsSlice: () => initialState,
    saveIndividualTrappingProtocol: (state, action) => {
      let trappingProtocolsStoreCopy = cloneDeep(state.trappingProtocolsStore)
      let id = null
      if (Object.keys(trappingProtocolsStoreCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(trappingProtocolsStoreCopy))
        id = largestId + 1
      } else {
        id = 0
      }
      trappingProtocolsStoreCopy[id] = { ...action.payload }
      state.trappingProtocolsStore = trappingProtocolsStoreCopy
    },
  },
})

export const { resetTrappingProtocolsSlice, saveIndividualTrappingProtocol } =
  trappingProtocolsSlice.actions

export default trappingProtocolsSlice.reducer

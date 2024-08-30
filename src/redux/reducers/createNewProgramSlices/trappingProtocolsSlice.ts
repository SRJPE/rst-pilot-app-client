import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { uid } from 'uid'

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
  uid: string
}
export const IndividualTrappingProtocolState: IndividualTrappingProtocolValuesI =
  {
    species: '',
    run: '',
    lifeStage: '',
    numberMeasured: null,
    uid: '',
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
      trappingProtocolsStoreCopy[id] = { ...action.payload, uid: uid() }
      state.trappingProtocolsStore = trappingProtocolsStoreCopy
    },
    updateIndividualTrappingProtocol: (state, action) => {
      let trappingProtocolsStoreCopy = cloneDeep(state.trappingProtocolsStore)
      let id: any = null

      for (let key in trappingProtocolsStoreCopy) {
        if (trappingProtocolsStoreCopy[key].uid === action.payload.uid) {
          id = key
          trappingProtocolsStoreCopy[id] = {
            ...action.payload,
            uid: action.payload.uid,
          }
          state.trappingProtocolsStore = trappingProtocolsStoreCopy
        }
      }
    },
    deleteIndividualTrappingProtocol: (state, action) => {
      let trappingProtocolsStoreCopy = cloneDeep(state.trappingProtocolsStore)
      let id: any = null

      for (let key in trappingProtocolsStoreCopy) {
        if (trappingProtocolsStoreCopy[key].uid === action.payload.uid) {
          id = key
          delete trappingProtocolsStoreCopy[id]
          state.trappingProtocolsStore = trappingProtocolsStoreCopy
        }
      }
    },

    updateAllTrappingProtocolsFromExisting: (state, action) => {
      state.trappingProtocolsStore = action.payload
    },
  },
})

export const {
  resetTrappingProtocolsSlice,
  saveIndividualTrappingProtocol,
  updateIndividualTrappingProtocol,
  deleteIndividualTrappingProtocol,
  updateAllTrappingProtocolsFromExisting,
} = trappingProtocolsSlice.actions

export default trappingProtocolsSlice.reducer

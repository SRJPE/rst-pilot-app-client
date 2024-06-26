import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { uid } from 'uid'

export interface PermitInformationInitialStateI {
  '4dPermitPDF': ''
  additionalPDFs: string[]
  values: {
    dateIssued: Date
    dateExpired: Date
    waterTemperatureThreshold: number | null
    flowThreshold: number | null
    trapCheckFrequency: number | null
  }
  takeAndMortalityValues: TakeAndMortalityValuesI
}

const initialState: PermitInformationInitialStateI = {
  '4dPermitPDF': '',
  additionalPDFs: [],
  values: {
    dateIssued: new Date(),
    dateExpired: new Date(),
    waterTemperatureThreshold: null,
    flowThreshold: null,
    trapCheckFrequency: null,
  },
  takeAndMortalityValues: {},
}

export interface TakeAndMortalityValuesI {
  [id: number]: IndividualTakeAndMortalityStateI
}
export interface IndividualTakeAndMortalityStateI {
  species: string
  listingUnitOrStock: string
  lifeStage: string
  expectedTake: number | null
  indirectMortality: number | null
  uid: string
}
export const IndividualTakeAndMortalityState: IndividualTakeAndMortalityStateI =
  {
    species: '',
    listingUnitOrStock: '',
    lifeStage: '',
    expectedTake: null,
    indirectMortality: null,
    uid: '',
  }

export const permitInformationSlice = createSlice({
  name: 'permitInformation',
  initialState: initialState,
  reducers: {
    resetPermitInformationSlice: () => initialState,
    savePermitInformationValues: (state, action) => {
      state.values = action.payload
    },
    saveIndividualTakeAndMortality: (state, action) => {
      let takeAndMortalityValuesStoreCopy = cloneDeep(
        state.takeAndMortalityValues
      )
      let id = null
      if (Object.keys(takeAndMortalityValuesStoreCopy).length) {
        const largestId = Math.max(
          // @ts-ignore
          ...Object.keys(takeAndMortalityValuesStoreCopy)
        )
        id = largestId + 1
      } else {
        id = 0
      }
      takeAndMortalityValuesStoreCopy[id] = { ...action.payload, uid: uid() }
      state.takeAndMortalityValues = takeAndMortalityValuesStoreCopy
    },
    updateIndividualTakeAndMortality: (state, action) => {
      let takeAndMortalityValuesStoreCopy = cloneDeep(
        state.takeAndMortalityValues
      )
      let id: any = null

      for (let key in takeAndMortalityValuesStoreCopy) {
        if (takeAndMortalityValuesStoreCopy[key].uid === action.payload.uid) {
          id = key
          takeAndMortalityValuesStoreCopy[id] = {
            ...action.payload,
            uid: action.payload.uid,
          }
          state.takeAndMortalityValues = takeAndMortalityValuesStoreCopy
        }
      }
    },
  },
})

export const {
  resetPermitInformationSlice,
  savePermitInformationValues,
  saveIndividualTakeAndMortality,
  updateIndividualTakeAndMortality,
} = permitInformationSlice.actions

export default permitInformationSlice.reducer

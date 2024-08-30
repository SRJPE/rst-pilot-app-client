import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { uid } from 'uid'

export interface TrappingSitesInitialStateI {
  trappingSitesStore: TrappingSitesStoreI
}

const initialState: TrappingSitesInitialStateI = {
  trappingSitesStore: {},
}

export interface TrappingSitesStoreI {
  [id: number]: IndividualTrappingSiteValuesI
}
export interface IndividualTrappingSiteValuesI {
  trapName: string | null
  trapLatitude: number | null
  trapLongitude: number | null
  coneSize: number | null
  USGSStationNumber: number | null
  releaseSiteName: string | null
  releaseSiteLatitude: number | null
  releaseSiteLongitude: number | null
  uid: string
}
export const individualTrappingSiteState: IndividualTrappingSiteValuesI = {
  trapName: '',
  trapLatitude: null,
  trapLongitude: null,
  coneSize: null,
  USGSStationNumber: null,
  releaseSiteName: '',
  releaseSiteLatitude: null,
  releaseSiteLongitude: null,
  uid: '',
}

export const trappingSitesSlice = createSlice({
  name: 'trappingSites',
  initialState: initialState,
  reducers: {
    resetTrappingSitesSlice: () => initialState,
    saveIndividualTrapSite: (state, action) => {
      let trappingSitesStoreCopy = cloneDeep(state.trappingSitesStore)
      let id = null

      if (Object.keys(trappingSitesStoreCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(trappingSitesStoreCopy))
        id = largestId + 1
      } else {
        id = 0
      }
      trappingSitesStoreCopy[id] = { ...action.payload, uid: uid() }
      state.trappingSitesStore = trappingSitesStoreCopy
    },
    updateIndividualTrapSite: (state, action) => {
      let trappingSitesStoreCopy = cloneDeep(state.trappingSitesStore)
      let id: any = null

      for (let key in trappingSitesStoreCopy) {
        if (trappingSitesStoreCopy[key].uid === action.payload.uid) {
          id = key
          trappingSitesStoreCopy[id] = {
            ...action.payload,
            uid: action.payload.uid,
          }
          state.trappingSitesStore = trappingSitesStoreCopy
        }
      }
    },
    deleteIndividualTrapSite: (state, action) => {
      let trappingSitesStoreCopy = cloneDeep(state.trappingSitesStore)
      let id: any = null

      for (let key in trappingSitesStoreCopy) {
        if (trappingSitesStoreCopy[key].uid === action.payload.uid) {
          id = key
          delete trappingSitesStoreCopy[id]
          state.trappingSitesStore = trappingSitesStoreCopy
        }
      }
    },
    updateAllTrappingSitesFromExisting: (state, action) => {
      state.trappingSitesStore = action.payload
    },
  },
})

export const {
  resetTrappingSitesSlice,
  saveIndividualTrapSite,
  updateIndividualTrapSite,
  deleteIndividualTrapSite,
  updateAllTrappingSitesFromExisting,
} = trappingSitesSlice.actions

export default trappingSitesSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

interface InitialStateI {
  completed: boolean
  trappingSitesStore: TrappingSitesStoreI
}

const initialState: InitialStateI = {
  completed: false,
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
      trappingSitesStoreCopy[id] = { ...action.payload }
      state.trappingSitesStore = trappingSitesStoreCopy
    },
  },
})

export const { saveIndividualTrapSite } = trappingSitesSlice.actions

export default trappingSitesSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

type TrapGroup = { trapSiteName: string; groupItems: any[] }
type GroupTrapKey = `trapSiteGroup-${number}`
// | 'trapSiteGroup-1'| 'trapSiteGroup-2' | 'trapSiteGroup-3' | 'trapSiteGroup-4' | 'trapSiteGroup-5' | 'trapSiteGroup-6'
export interface GroupTrapSiteValuesI {
  numberOfTrapSites?: number
  [key: GroupTrapKey]: TrapGroup
}

export interface MultipleTrapsInitialStateI {
  completed: boolean
  groupTrapSiteValues: GroupTrapSiteValuesI
}

const initialState: MultipleTrapsInitialStateI = {
  completed: false,
  groupTrapSiteValues: {
    'trapSiteGroup-1': { groupItems: [], trapSiteName: '' },
  },
}

export const multipleTrapsSlice = createSlice({
  name: 'multipleTraps',
  initialState: initialState,
  reducers: {
    resetTrappingSitesSlice: () => initialState,
    saveMultipleTraps: (state, action) => {
      let multipleTrapsStorePayload = cloneDeep(action.payload)
      delete multipleTrapsStorePayload.numberOfTrapSites

      // console.log('🚀 ~ multipleTrapsStorePayload:', multipleTrapsStorePayload)
      state.groupTrapSiteValues = multipleTrapsStorePayload
    },
  },
})

export const { saveMultipleTraps } = multipleTrapsSlice.actions

export default multipleTrapsSlice.reducer

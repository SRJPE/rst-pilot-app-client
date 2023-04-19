import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { reformatBatchCountData } from '../../../utils/utils'

export interface BatchStoreI {
  [id: number]: singleBatchRawI
}
export interface singleBatchRawI {
  forkLength: number
  lifeStage: string
}
export interface batchCharacteristicsI {
  tabId: string | null
  species: string
  adiposeClipped: boolean
  dead: boolean
  existingMark: string
  forkLengths?: BatchStoreI
}
export const initialState: batchCharacteristicsI = {
  tabId: null,
  species: '',
  adiposeClipped: false,
  dead: false,
  existingMark: '', //refactor to an array
  forkLengths: {},
}

export const batchCountSlice = createSlice({
  name: 'batchCount',
  initialState: initialState,
  reducers: {
    resetBatchCountSlice: () => initialState,
    saveBatchCharacteristics: (state, action) => {
      console.log('🚀 ~ action.payload:', action.payload)
      const { tabId, species, adiposeClipped, dead, existingMark } =
        action.payload
      const forkLengthsCopy = cloneDeep(state.forkLengths) as any
      state.tabId = tabId
      state.species = species
      state.adiposeClipped = adiposeClipped
      state.dead = dead
      state.existingMark = existingMark
      state.forkLengths = forkLengthsCopy
      // const payload = {
      //   species,
      //   adiposeClipped,
      //   dead,
      //   existingMark,
      //   forkLengths: forkLengthsCopy,
      // }
      // state = payload
    },
    addForkLengthToBatchStore: (state, action) => {
      const forkLengthsCopy = cloneDeep(state.forkLengths) || {
        ...state.forkLengths,
      }
      const fishEntry = {
        forkLength: action.payload.forkLength,
        lifeStage: action.payload.lifeStage,
      } as any
      let id = null
      if (Object.keys(forkLengthsCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(forkLengthsCopy))
        id = largestId + 1
      } else {
        id = 0
      }
      forkLengthsCopy[id] = fishEntry
      state.forkLengths = forkLengthsCopy
    },

    removeLastForkLengthEntered: (state) => {
      const forkLengthsCopy = cloneDeep(state.forkLengths) as any
      if (Object.keys(forkLengthsCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(forkLengthsCopy))
        delete forkLengthsCopy[largestId]
      }
      state.forkLengths = forkLengthsCopy
    },

    updateSingleForkLengthCount: (state, action) => {
      const forkLengthsState: any = cloneDeep(state.forkLengths)
      const { forkLength } = action.payload

      /*
        AT A GIVEN FORK LENGTH...
        for each property in the forkLengthsState object besides the first two (FL & Count)
        store the life stage and count as a prop in a object
         delete all props with the same fork length
        create entries in the store to fill in the new values.
      */
      const lifeStagesToUpdate = {} as any
      for (let key in action.payload) {
        if (key === 'forkLength' || key === 'count') continue
        lifeStagesToUpdate[key] = Number(action.payload[key])
      }
      for (let key in forkLengthsState) {
        if (forkLengthsState[key].forkLength === Number(forkLength)) {
          delete forkLengthsState[key]
        }
      }
      for (let key in lifeStagesToUpdate) {
        let count = lifeStagesToUpdate[key]
        //iterate again
        while (count > 0) {
          const fishEntry = {
            forkLength: Number(forkLength),
            lifeStage: key,
          } as any
          let id = null
          if (Object.keys(forkLengthsState).length) {
            // @ts-ignore
            const largestId = Math.max(...Object.keys(forkLengthsState))
            id = largestId + 1
          } else {
            id = 0
          }
          forkLengthsState[id] = fishEntry
          count--
        }
      }
      state.forkLengths = forkLengthsState
    },
  },
})

export const {
  resetBatchCountSlice,
  saveBatchCharacteristics,
  removeLastForkLengthEntered,
  updateSingleForkLengthCount,
  addForkLengthToBatchStore,
} = batchCountSlice.actions

export default batchCountSlice.reducer

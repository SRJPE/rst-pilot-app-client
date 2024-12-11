import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep, remove } from 'lodash'
import { uid } from 'uid'

export interface CrewMembersInitialStateI {
  crewMembersStore: CrewMembersStoreI
}

const initialState: CrewMembersInitialStateI = {
  crewMembersStore: {},
}

export interface CrewMembersStoreI {
  [id: number]: IndividualCrewMemberValuesI
}
export interface IndividualCrewMemberValuesI {
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  email: string | null
  isLead: boolean
  agency: string | null
  orcidId: string | null
  uid: string
}
export const IndividualCrewMemberState: IndividualCrewMemberValuesI = {
  firstName: '',
  lastName: '',
  phoneNumber: null,
  email: '',
  isLead: false,
  agency: '',
  orcidId: '',
  uid: '',
}

export const crewMembersSlice = createSlice({
  name: 'crewMembers',
  initialState: initialState,
  reducers: {
    resetCrewMembersSlice: () => initialState,
    saveIndividualCrewMember: (state, action) => {
      let crewMembersStoreCopy = cloneDeep(state.crewMembersStore)
      let id = null
      if (Object.keys(crewMembersStoreCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(crewMembersStoreCopy))
        id = largestId + 1
      } else {
        id = 0
      }
      crewMembersStoreCopy[id] = { ...action.payload, uid: uid() }
      state.crewMembersStore = crewMembersStoreCopy
    },
    updateIndividualCrewMember: (state, action) => {
      let trappingSitesStoreCopy = cloneDeep(state.crewMembersStore)
      let id: any = null

      for (let key in trappingSitesStoreCopy) {
        if (trappingSitesStoreCopy[key].uid === action.payload.uid) {
          id = key
          trappingSitesStoreCopy[id] = {
            ...action.payload,
            uid: action.payload.uid,
          }
          state.crewMembersStore = trappingSitesStoreCopy
        }
      }
    },
    removeIndividualCrewMember: (state, action) => {
      console.log('🚀 ~ file: crewMembersSlice.ts:71 ~ action:', action)

      const crewMembersStoreCopy = cloneDeep(state.crewMembersStore)
      const crewMembersArray = Object.values(crewMembersStoreCopy)

      const newCrewMembersArray = crewMembersArray.filter(
        (crewMember: any) => crewMember.email !== action.payload
      )

      const newCrewMembersStore = Object.assign({}, newCrewMembersArray)

      state.crewMembersStore = newCrewMembersStore
    },
  },
})

export const {
  resetCrewMembersSlice,
  saveIndividualCrewMember,
  updateIndividualCrewMember,
  removeIndividualCrewMember,
} = crewMembersSlice.actions

export default crewMembersSlice.reducer

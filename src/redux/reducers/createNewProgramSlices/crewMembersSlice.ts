import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
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
  phoneNumber: number | null
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
    updateEntireCrewMembersStore: (state, action) => {
      console.log(
        '🚀 ~ file: crewMembersSlice.ts:72 ~ action.payload:',
        action.payload
      )
      const test = action.payload
      test.map((crewMember: any) => {
        let test2 = delete test.id
        //  crewMember = {crewMember.id : crewMember}
      })
      // state.crewMembersStore = {crewMember?.id : test}
    },
    deleteIndividualCrewMember: (state, action) => {
      let trappingSitesStoreCopy = cloneDeep(state.crewMembersStore)
      let id: any = null

      for (let key in trappingSitesStoreCopy) {
        if (trappingSitesStoreCopy[key].uid === action.payload.uid) {
          id = key
          delete trappingSitesStoreCopy[id]
          state.crewMembersStore = trappingSitesStoreCopy
        }
      }
    },
  },
})

export const {
  resetCrewMembersSlice,
  saveIndividualCrewMember,
  updateIndividualCrewMember,
  updateEntireCrewMembersStore,
  deleteIndividualCrewMember,
} = crewMembersSlice.actions

export default crewMembersSlice.reducer

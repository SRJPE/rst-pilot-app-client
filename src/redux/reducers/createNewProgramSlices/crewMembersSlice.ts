import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

interface InitialStateI {
  completed: boolean
  crewMembersStore: CrewMembersStoreI
}

const initialState: InitialStateI = {
  completed: false,
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
  orchidID: string | null
}
export const IndividualCrewMemberState: IndividualCrewMemberValuesI = {
  firstName: '',
  lastName: '',
  phoneNumber: null,
  email: '',
  isLead: false,
  agency: '',
  orchidID: '',
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
      crewMembersStoreCopy[id] = { ...action.payload }
      state.crewMembersStore = crewMembersStoreCopy
    },
  },
})

export const { saveIndividualCrewMember } = crewMembersSlice.actions

export default crewMembersSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  submitted: boolean
  trapVisitSubmissions: TrapVisitSubmissionI[]
}

interface TrapVisitSubmissionI {
programId?: number
visitTypeId?: number
trapLocationId?: number
trapVisitTimeStart?: Date
trapVisitTimeEnd?: Date
fishProcessed?: number
whyFishNotProcessed?: number
sampleGearId?: number
coneDepth?: number
trapInThalweg?: boolean
trapFunctioning?: number
whyTrapNotFunctioning?: number
trapStatusAtEnd?: number
totalRevolutions?: number
rpmAtStart?: number
rpmAtEnd?: number
inHalfConeConfiguration?: boolean
debrisVolumeLiters?: number
qcCompleted?: boolean
qcCompletedAt?: Date
comments?: string
}  

const initialState: InitialStateI = {
  submitted: false,
  trapVisitSubmissions: [],
}

export const trapVisitPostBundler = createSlice({
  name: 'trapVisitPostBundler',
  initialState: initialState,
  reducers: {
    saveTrapVisitSubmission: (state, action) => {
      // if (state.submitted)
      state.trapVisitSubmissions.push({ ...action.payload})
    },
  },
})

export const { saveTrapVisitSubmission } = trapVisitPostBundler.actions

export default trapVisitPostBundler.reducer

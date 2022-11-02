import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  submitted: boolean
  catchRawSubmissions: CatchRawSubmissionI[]
}

interface CatchRawSubmissionI {
  programId: number
  trapVisitId: number
  taxonId?: number
  captureRunClass?: number
  captureRunClassMethod?: number
  markType?: number
  adiposeClipped?: boolean
  lifeStage?: number
  forkLength?: number
  weight?: number
  numFishCaught?: number
  plusCount?: boolean
  plusCountMethodology?: number
  isRandom?: boolean
  comments?: string
  createdBy?: number
  createdAt?: Date
  updatedAt?: Date
  qcCompleted?: Date
  qcCompletedBy?: number
  qcTime?: Date
  qcComments?: string
}

const initialState: InitialStateI = {
  submitted: false,
  catchRawSubmissions: [],
}

export const catchRawPostBundler = createSlice({
  name: 'catchRawPostBundler',
  initialState: initialState,
  reducers: {
    saveCatchRawSubmission: (state, action) => {
      // if (state.submitted)
      state.catchRawSubmissions.push({ ...action.payload })
    },
  },
})

export const { saveCatchRawSubmission } = catchRawPostBundler.actions

export default catchRawPostBundler.reducer

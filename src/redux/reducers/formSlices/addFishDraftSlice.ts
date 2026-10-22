import { createSlice } from '@reduxjs/toolkit'
import { FormValueI } from '../../../utils/interfaces'

// AddFish.tsx (new-fish entry, not edit mode) previously held an entire
// in-progress fish record across ~15 separate useState fields with no
// autosave - only written to redux on explicit "Save" button press. A
// crash, backgrounding, or navigating away mid-entry lost the whole record
// silently. This slice is a debounced, persisted draft of that in-progress
// record, keyed by tab, restored on next mount and cleared once the fish is
// actually saved.
export interface AddFishDraftI {
  fishUID: string
  species: FormValueI
  count: FormValueI
  forkLength: FormValueI
  run: FormValueI
  fishConditions: FormValueI
  weight: FormValueI
  lifeStage: FormValueI
  adiposeClipped: FormValueI
  existingMarks: FormValueI
  appliedMarks: FormValueI
  geneticSamples: FormValueI
  dead: FormValueI
  milting: FormValueI
  eggs: FormValueI
  plusCountMethod: FormValueI
  comments: FormValueI
}

export interface AddFishDraftStateI {
  [tabId: string]: AddFishDraftI | null
}

const initialState: AddFishDraftStateI = {}

export const addFishDraftSlice = createSlice({
  name: 'addFishDraft',
  initialState,
  reducers: {
    saveAddFishDraft: (
      state,
      action: { payload: { tabId: string; draft: AddFishDraftI } }
    ) => {
      state[action.payload.tabId] = action.payload.draft
    },
    clearAddFishDraft: (state, action: { payload: { tabId: string } }) => {
      delete state[action.payload.tabId]
    },
  },
})

export const { saveAddFishDraft, clearAddFishDraft } = addFishDraftSlice.actions

export default addFishDraftSlice.reducer

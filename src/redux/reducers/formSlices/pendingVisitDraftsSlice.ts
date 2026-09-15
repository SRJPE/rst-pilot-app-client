import { createSlice } from '@reduxjs/toolkit'

export interface PendingVisitDraftI {
  tabId: string
  tabName: string
  trapSite: string
  groupId: string
  timestamp: string
  visitSetupTab: any
  trapOperationsTab: any
  fishProcessingTab: any
  trapPostProcessingTab: any
  fishInputTab: any
}

export interface PendingVisitDraftsStateI {
  [tabId: string]: PendingVisitDraftI
}

const initialState: PendingVisitDraftsStateI = {}

export const pendingVisitDraftsSlice = createSlice({
  name: 'pendingVisitDrafts',
  initialState: initialState,
  reducers: {
    resetPendingVisitDraftsSlice: () => initialState,
    saveDraftForTab: (state, action) => {
      const draft: PendingVisitDraftI = action.payload
      state[draft.tabId] = draft
    },
    removeDraftForTab: (state, action) => {
      const tabId: string = action.payload
      delete state[tabId]
    },
  },
})

export const {
  resetPendingVisitDraftsSlice,
  saveDraftForTab,
  removeDraftForTab,
} = pendingVisitDraftsSlice.actions

export default pendingVisitDraftsSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { uid } from 'uid'

export interface TabStateI {
  activeTabId: string | null
  previouslyActiveTabId: string | null
  tabs: TabsI
  incompleteSectionTouched: boolean
}

// uid : tabName
interface TabsI {
  [id: string]: TabInfoI
}

interface TabInfoI {
  name: string
  trapSite: string
  timestamp: Date
  groupId: string
  errorCount: number
  errorDetails: ErrorDetailsI
}

interface ErrorDetailsI {
  [pageName: string]: string
}

const initialState: TabStateI = {
  activeTabId: null,
  previouslyActiveTabId: null,
  tabs: {},
  incompleteSectionTouched: false,
}

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState: initialState,
  reducers: {
    resetTabsSlice: () => initialState,
    createTab: (state, action) => {
      const { tabId, tabName, trapSite } = action.payload
      if (!Object.keys(state.tabs).length) {
        state.activeTabId = tabId
      }
      const timestamp = new Date()
      let groupId = uid()
      Object.keys(state.tabs).forEach((id) => {
        if (state.tabs[id].trapSite === trapSite) {
          groupId = state.tabs[id].groupId
        }
      })
      const errorCount = 0
      const errorDetails = {}
      state.tabs[tabId] = {
        name: tabName,
        trapSite,
        timestamp,
        groupId,
        errorCount,
        errorDetails,
      }
    },
    deleteTab: (state, action) => {
      const tabId = action.payload
      delete state.tabs[tabId]
      if (Object.keys(state.tabs)) {
        state.activeTabId = Object.keys(state.tabs)[0]
      } else {
        state.activeTabId = null
      }
    },
    setActiveTab: (state, action) => {
      state.previouslyActiveTabId = state.activeTabId
      state.activeTabId = action.payload
    },
    setTabName: (state, action) => {
      const { tabId, name } = action.payload
      state.tabs[tabId].name = name
    },
    updateErrorCount: (state, action) => {
      const { tabId, errorCount } = action.payload
      state.tabs[tabId].errorCount = errorCount
    },
    updateErrorDetails: (state, action) => {
      const { tabId, errorDetails } = action.payload
      state.tabs[tabId].errorDetails = errorDetails
    },
    setIncompleteSectionTouched: (state, action) => {
      state.incompleteSectionTouched = action.payload
    }
  },
})

export const {
  resetTabsSlice,
  createTab,
  deleteTab,
  setActiveTab,
  setTabName,
  updateErrorCount,
  updateErrorDetails,
  setIncompleteSectionTouched,
} = tabsSlice.actions

export default tabsSlice.reducer

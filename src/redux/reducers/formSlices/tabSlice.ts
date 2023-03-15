import { createSlice } from '@reduxjs/toolkit'

export interface TabStateI {
  activeTabId: string | null
  tabs: TabsI
}

// uid : tabName
interface TabsI {
  [id: string]: TabInfoI
}

interface TabInfoI {
  name: string
  activeStep: number
}

const initialState: TabStateI = {
  activeTabId: null,
  tabs: {},
}

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState: initialState,
  reducers: {
    resetTabsSlice: () => initialState,
    createTab: (state, action) => {
      const { tabId, tabName, activeStep } = action.payload
      if (Object.keys(state.tabs).length) {
        state.tabs[tabId] = { name: tabName, activeStep }
      } else {
        state.activeTabId = tabId
        state.tabs[tabId] = { name: tabName, activeStep }
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
      state.activeTabId = action.payload
    },
    setTabName: (state, action) => {
      if (state.activeTabId) state.tabs[state.activeTabId].name = action.payload
    },
    setTabStep: (state, action) => {
      const { tabId, activeStep } = action.payload
      if (state.tabs[tabId]) {
        state.tabs[tabId].activeStep = activeStep
      }
    },
  },
})

export const {
  resetTabsSlice,
  createTab,
  deleteTab,
  setActiveTab,
  setTabName,
  setTabStep,
} = tabsSlice.actions

export default tabsSlice.reducer

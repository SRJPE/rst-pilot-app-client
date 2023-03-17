import { createSlice } from '@reduxjs/toolkit'
import { uid } from 'uid'

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
  trapSite: string
  timestamp: Date
  groupId: string
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
      state.tabs[tabId] = { name: tabName, trapSite, timestamp, groupId }
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
      const { tabId, name } = action.payload
      state.tabs[tabId].name = name
    },
  },
})

export const {
  resetTabsSlice,
  createTab,
  deleteTab,
  setActiveTab,
  setTabName,
} = tabsSlice.actions

export default tabsSlice.reducer

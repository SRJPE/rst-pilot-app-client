import { createSlice } from '@reduxjs/toolkit'
import { uid } from 'uid'

export interface TabStateI {
  activeTabId: string | null
  tabs: TabsI
}

// uid : tabName
interface TabsI {
  [id: string]: string
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
      const { tabId, tabName } = action.payload
      if (Object.keys(state.tabs).length) {
        state.tabs[tabId] = tabName
      } else {
        state.activeTabId = tabId
        state.tabs[tabId] = tabName
      }
    },
    deleteTab: (state, action) => {
      const tabId = action.payload
      delete state.tabs[tabId]
      if (Object.keys(state.tabs)) {
        state.activeTabId = state.tabs[Object.keys(state.tabs)[0]]
      } else {
        state.activeTabId = null
      }
    },
    setActiveTab: (state, action) => {
      state.activeTabId = action.payload
    },
    setTabName: (state, action) => {
      if (state.activeTabId) state.tabs[state.activeTabId] = action.payload
    },
  },
})

export const { resetTabsSlice, createTab, deleteTab, setActiveTab, setTabName } =
  tabsSlice.actions

export default tabsSlice.reducer

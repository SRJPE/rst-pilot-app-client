import { createSlice } from '@reduxjs/toolkit'
import { uid } from 'uid'

export interface TabStateI {
  activeTabID: string | null
  tabs: TabsI
}

// uid : tabName
interface TabsI {
  [id: string]: string
}

const initialState: TabStateI = {
  activeTabID: null,
  tabs: {},
}

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState: initialState,
  reducers: {
    resetTabsSlice: () => initialState,
    createTab: (state, action) => {
      const { tabID, tabName } = action.payload
      if (Object.keys(state.tabs).length) {
        state.tabs[tabID] = tabName
      } else {
        state.activeTabID = tabID
        state.tabs[tabID] = tabName
      }
    },
    deleteTab: (state, action) => {
      const tabID = action.payload
      delete state.tabs[tabID]
      if (Object.keys(state.tabs)) {
        state.activeTabID = state.tabs[Object.keys(state.tabs)[0]]
      } else {
        state.activeTabID = null
      }
    },
    setActiveTab: (state, action) => {
      state.activeTabID = action.payload
    },
    setTabName: (state, action) => {
      if (state.activeTabID) state.tabs[state.activeTabID] = action.payload
    },
  },
})

export const { resetTabsSlice, createTab, deleteTab, setActiveTab, setTabName } =
  tabsSlice.actions

export default tabsSlice.reducer

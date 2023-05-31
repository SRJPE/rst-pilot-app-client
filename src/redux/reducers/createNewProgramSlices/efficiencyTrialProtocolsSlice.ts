import { createSlice } from '@reduxjs/toolkit'

export interface EfficiencyTrialProtocolsInitialStateI {
  efficiencyMonitoringProtocolsPDF: string
  hatcheryAgreementPDF: string
  values: HatcheryInformationI
}

export interface HatcheryInformationI {
  hatchery: string
  frequencyOfReceivingFish: string
  expectedNumberOfFishReceivedAtEachPickup: number | null
}
export const initialState: EfficiencyTrialProtocolsInitialStateI = {
  efficiencyMonitoringProtocolsPDF: '',
  hatcheryAgreementPDF: '',
  values: {
    hatchery: '',
    frequencyOfReceivingFish: '',
    expectedNumberOfFishReceivedAtEachPickup: null,
  },
}

export const efficiencyTrialProtocolsSlice = createSlice({
  name: 'efficiencyTrialProtocols',
  initialState: initialState,
  reducers: {
    resetEfficiencyTrialProtocolsSlice: () => initialState,
    saveEfficiencyMonitoringProtocolsPDF: (state, action) => {
      state.efficiencyMonitoringProtocolsPDF = action.payload
    },
    saveHatcheryAgreementPDF: (state, action) => {
      state.hatcheryAgreementPDF = action.payload
    },
    saveHatcheryInformationValues: (state, action) => {
      state.values = action.payload
    },
  },
})

export const {
  resetEfficiencyTrialProtocolsSlice,
  saveHatcheryInformationValues,
} = efficiencyTrialProtocolsSlice.actions

export default efficiencyTrialProtocolsSlice.reducer

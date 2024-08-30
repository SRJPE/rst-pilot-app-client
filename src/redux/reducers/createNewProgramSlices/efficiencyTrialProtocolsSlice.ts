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
  agreementStartDate: Date
  agreementEndDate: Date
  renewalDate: Date
}
export const initialState: EfficiencyTrialProtocolsInitialStateI = {
  efficiencyMonitoringProtocolsPDF: '',
  hatcheryAgreementPDF: '',
  values: {
    hatchery: '',
    frequencyOfReceivingFish: '',
    expectedNumberOfFishReceivedAtEachPickup: null,
    agreementStartDate: new Date(),
    agreementEndDate: new Date(),
    renewalDate: new Date(),
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
    updateAllEfficiencyTrialProtocolsFromExisting: (state, action) => {
      state.efficiencyMonitoringProtocolsPDF =
        action.payload.efficiencyMonitoringProtocolsPDF
      state.hatcheryAgreementPDF = action.payload.hatcheryAgreementPDF
      state.values = action.payload.values
    },
  },
})

export const {
  resetEfficiencyTrialProtocolsSlice,
  saveHatcheryInformationValues,
  updateAllEfficiencyTrialProtocolsFromExisting,
} = efficiencyTrialProtocolsSlice.actions

export default efficiencyTrialProtocolsSlice.reducer

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import dropdownsSlice from './dropdownsSlice'
import navigationSlice from './formSlices/navigationSlice'
import visitSetupSlice from './formSlices/visitSetupSlice'
import trapOperationsSlice from './formSlices/trapOperationsSlice'
import fishProcessingSlice from './formSlices/fishProcessingSlice'
import fishInputSlice from './formSlices/fishInputSlice'
import trapPostProcessingSlice from './formSlices/trapPostProcessingSlice'
import markRecaptureNavigationSlice from './markRecaptureSlices/markRecaptureNavigationSlice'
import addMarksOrTagsSlice from './formSlices/addMarksOrTagsSlice'
import addGeneticSamplesSlice from './formSlices/addGeneticSamplesSlice'
import visitSetupDefaultsSlice from './visitSetupDefaults'
import trapVisitFormPostBundler from './postSlices/trapVisitFormPostBundler'
import markRecapturePostBundler from './postSlices/markRecapturePostBundler'
import connectivitySlice from './connectivitySlice'
import slideAlertSlice from './slideAlertSlice'
import paperEntrySlice from './formSlices/paperEntrySlice'
import releaseTrialSlice from './markRecaptureSlices/releaseTrialSlice'
import releaseTrialDataEntrySlice from './markRecaptureSlices/releaseTrialDataEntrySlice'
import addAnotherMarkSlice from './addAnotherMarkSlice'
import tabSlice from './formSlices/tabSlice'
import batchCountSlice from './formSlices/batchCountSlice'
import fishHoldingSlice from './markRecaptureSlices/fishHoldingSlice'
import userCredentialsSlice from './userCredentialsSlice'
import trappingSitesSlice from './createNewProgramSlices/trappingSitesSlice'
import crewMembersSlice from './createNewProgramSlices/crewMembersSlice'
import createNewProgramHomeSlice from './createNewProgramSlices/createNewProgramHomeSlice'
import trappingProtocolsSlice from './createNewProgramSlices/trappingProtocolsSlice'
import efficiencyTrialProtocolsSlice from './createNewProgramSlices/efficiencyTrialProtocolsSlice'
import permitInformationSlice from './createNewProgramSlices/permitInformationSlice'
import multipleTrapsSlice from './createNewProgramSlices/multipleTrapsSlice'
import monitoringProgramPostBundler from './postSlices/monitoringProgramPostBundler'

const dropdownsPersistConfig = {
  key: 'dropdowns',
  version: 1,
  storage: AsyncStorage,
}

const visitSetupDefaultsPersistConfig = {
  key: 'visitSetupDefaults',
  version: 1,
  storage: AsyncStorage,
}

const trapVisitPostPersistConfig = {
  key: 'trapVisitPostPersistConfig',
  version: 1,
  storage: AsyncStorage,
}
// SHOULD POSSIBLY USE SECURE STORE INSTEAD OF ASYNC STORAGE
//import SecureStore from 'expo-secure-store'

export interface Options {
  replaceCharacter?: string
  replacer: (key: string, replaceCharacter: string) => string
  authenticationPrompt?: string
  keychainAccessible?: any
  keychainService?: string
  requireAuthentication?: boolean
}

function createSecureStorage(options = {} as Options) {
  // const replaceCharacter = options.replaceCharacter || '_'
  // const replacer = options.replacer || defaultReplacer

  console.log('SecureStore', SecureStore)

  return {
    getItem: (key: string) => SecureStore.getItemAsync(key, options),
    setItem: (key: string, value: any) =>
      SecureStore.setItemAsync(key, value, options),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key, options),
  }
  // return {
  //   getItem: (key: string) =>
  //     SecureStore.getItemAsync(replacer(key, replaceCharacter)),
  //   setItem: (key: string, value: any) =>
  //     SecureStore.setItemAsync(replacer(key, replaceCharacter), value),
  //   removeItem: (key: string) =>
  //     SecureStore.deleteItemAsync(replacer(key, replaceCharacter)),
  // }
}
// function defaultReplacer(key: string, replaceCharacter: string) {
//   return key.replace(/[^a-z0-9.\-_]/gi, replaceCharacter)
// }

// const userCredentialsPersistConfig = {
//   key: 'userCredentialsPersistConfig',
//   version: 1,
//   storage: createSecureStorage(),
// }
const userCredentialsPersistConfig = {
  key: 'userCredentialsPersistConfig',
  version: 1,
  storage: AsyncStorage,
}

const markRecaptureFormPostPersistConfig = {
  key: 'markRecaptureFormPostPersistConfig',
  version: 1,
  storage: AsyncStorage,
}
const monitoringProgramPostPersistConfig = {
  key: 'monitoringProgramPostPersistConfig',
  version: 1,
  storage: AsyncStorage,
}

export default combineReducers({
  dropdowns: persistReducer(dropdownsPersistConfig, dropdownsSlice),
  visitSetupDefaults: persistReducer(
    visitSetupDefaultsPersistConfig,
    visitSetupDefaultsSlice
  ),
  slideAlert: slideAlertSlice,
  navigation: navigationSlice,
  visitSetup: visitSetupSlice,
  trapOperations: trapOperationsSlice,
  fishProcessing: fishProcessingSlice,
  fishInput: fishInputSlice,
  addMarksOrTags: addMarksOrTagsSlice,
  addGeneticSamples: addGeneticSamplesSlice,
  trapPostProcessing: trapPostProcessingSlice,
  markRecaptureNavigation: markRecaptureNavigationSlice,
  trapVisitFormPostBundler: persistReducer(
    trapVisitPostPersistConfig,
    trapVisitFormPostBundler
  ),
  markRecaptureFormPostBundler: persistReducer(
    markRecaptureFormPostPersistConfig,
    markRecapturePostBundler
  ),
  monitoringProgramPostBundler: persistReducer(
    monitoringProgramPostPersistConfig,
    monitoringProgramPostBundler
  ),
  connectivity: connectivitySlice,
  paperEntry: paperEntrySlice,
  fishHolding: fishHoldingSlice,
  releaseTrial: releaseTrialSlice,
  releaseTrialDataEntry: releaseTrialDataEntrySlice,
  addAnotherMark: addAnotherMarkSlice,
  userCredentials: persistReducer(
    userCredentialsPersistConfig,
    userCredentialsSlice
  ),
  trappingSites: trappingSitesSlice,
  crewMembers: crewMembersSlice,
  tabSlice: tabSlice,
  batchCount: batchCountSlice,
  createNewProgramHome: createNewProgramHomeSlice,
  trappingProtocols: trappingProtocolsSlice,
  efficiencyTrialProtocols: efficiencyTrialProtocolsSlice,
  permitInformation: permitInformationSlice,
  multipleTraps: multipleTrapsSlice,
})

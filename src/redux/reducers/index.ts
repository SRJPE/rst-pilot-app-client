import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dropdownsSlice from './dropdownsSlice'
import navigationSlice from './formSlices/navigationSlice'
import visitSetupSlice from './formSlices/visitSetupSlice'
import trapStatusSlice from './formSlices/trapStatusSlice'
import fishProcessingSlice from './formSlices/fishProcessingSlice'
import fishInputSlice from './formSlices/fishInputSlice'
import releaseTrialSlice from './markRecaptureSlices/releaseTrialSlice'
import trapPostProcessingSlice from './formSlices/trapPostProcessingSlice'
import markRecaptureNavigationSlice from './markRecaptureSlices/markRecaptureNavigationSlice'
import addMarksOrTagsSlice from './formSlices/addMarksOrTagsSlice'
import addGeneticSamplesSlice from './formSlices/addGeneticSamplesSlice'
import visitSetupDefaultsSlice from './visitSetupDefaults'
import trapVisitFormPostBundler from './postSlices/trapVisitFormPostBundler'
import connectivitySlice from './connectivitySlice'
import slideAlertSlice from './slideAlertSlice'

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

export default combineReducers({
  dropdowns: persistReducer(dropdownsPersistConfig, dropdownsSlice),
  visitSetupDefaults: persistReducer(
    visitSetupDefaultsPersistConfig,
    visitSetupDefaultsSlice
  ),
  slideAlert: slideAlertSlice,
  navigation: navigationSlice,
  visitSetup: visitSetupSlice,
  trapStatus: trapStatusSlice,
  fishProcessing: fishProcessingSlice,
  fishInput: fishInputSlice,
  addMarksOrTags: addMarksOrTagsSlice,
  addGeneticSamples: addGeneticSamplesSlice,
  trapPostProcessing: trapPostProcessingSlice,
  markRecaptureNavigation: markRecaptureNavigationSlice,
  releaseTrial: releaseTrialSlice,
  trapVisitFormPostBundler,
  connectivity: connectivitySlice,
})

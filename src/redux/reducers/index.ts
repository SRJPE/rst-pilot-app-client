import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dropdownsSlice from './dropdownsSlice'
import navigationSlice from './formSlices/navigationSlice'
import visitSetupSlice from './formSlices/visitSetupSlice'
import trapStatusSlice from './formSlices/trapStatusSlice'
import trapPreProcessingSlice from './formSlices/trapPreProcessingSlice'
import fishProcessingSlice from './formSlices/fishProcessingSlice'
import fishInputSlice from './formSlices/fishInputSlice'
import addIndividualFishSlice from './formSlices/addIndividualFishSlice'
import trapPostProcessingSlice from './trapPostProcessingSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
}

export default combineReducers({
  dropdowns: persistReducer(persistConfig, dropdownsSlice),
  navigation: navigationSlice,
  visitSetup: visitSetupSlice,
  trapStatus: trapStatusSlice,
  trapPreProcessing: trapPreProcessingSlice,
  fishProcessing: fishProcessingSlice,
  fishInput: fishInputSlice,
  addIndividualFish: addIndividualFishSlice,
  trapPostProcessing: trapPostProcessingSlice,
})

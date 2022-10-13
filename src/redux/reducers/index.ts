import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dropdownsSlice from './dropdownsSlice'
import navigationSlice from './navigationSlice'
import visitSetupSlice from './visitSetupSlice'
import trapStatusSlice from './trapStatusSlice'
import trapPreProcessingSlice from './trapPreProcessingSlice'
import fishProcessingSlice from './fishProcessingSlice'
import fishInputSlice from './fishInputSlice'
import addIndividualFishSlice from './addIndividualFishSlice'
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

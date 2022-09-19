import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dropdownsSlice from './dropdownsSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
}

export default combineReducers({
  dropdowns: persistReducer(persistConfig, dropdownsSlice),
})

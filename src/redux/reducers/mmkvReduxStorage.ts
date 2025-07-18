// mmkvReduxStorage.js
import { mmkv } from './mmkvStorage'

export const reduxStorage = {
  setItem: (key: string, value: string | number | boolean | ArrayBuffer) => {
    mmkv.set(key, value)
    return Promise.resolve()
  },
  getItem: (key: string) => {
    const value = mmkv.getString(key)
    return Promise.resolve(value ?? null)
  },
  removeItem: (key: string) => {
    mmkv.delete(key)
    return Promise.resolve()
  },
}

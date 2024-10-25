import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserAuthState {
  forcedLogoutModalOpen: boolean
}

const initialState: UserAuthState = {
  forcedLogoutModalOpen: false,
}

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setForcedLogoutModalOpen: (state, action: PayloadAction<boolean>) => {
      state.forcedLogoutModalOpen = action.payload
    },
  },
})

export const { setForcedLogoutModalOpen } = userAuthSlice.actions

export default userAuthSlice.reducer

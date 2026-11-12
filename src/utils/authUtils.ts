import * as SecureStore from 'expo-secure-store'
import moment from 'moment'
import { refreshAsync } from 'expo-auth-session'
import {
  // @ts-ignore
  EXPO_PUBLIC_CLIENT_ID,
} from '@env'
import { AppDispatch, store } from '../redux/store'

type TokenResponse =
  | 'Tokens refreshed'
  | 'Tokens still valid'
  | 'Tokens could not be refreshed'
  | 'No refresh token found'
  | 'No network connection'

let inFlightRefresh: Promise<TokenResponse> | null = null

// Single entry point for refreshing the session token. Safe to call from
// multiple places concurrently (axios interceptor, startup/connectivity
// listeners, etc.) - only one refreshAsync()/storeAccessTokens() sequence is
// ever in flight at a time; concurrent callers await the same promise
// instead of each independently racing Azure AD B2C with the same refresh
// token.
export const refreshUserToken = async (
  dispatch: AppDispatch
): Promise<TokenResponse> => {
  if (inFlightRefresh) {
    return inFlightRefresh
  }

  inFlightRefresh = performTokenRefresh()

  try {
    return await inFlightRefresh
  } finally {
    inFlightRefresh = null
  }
}

const performTokenRefresh = async (): Promise<TokenResponse> => {
  const isConnected = store.getState().connectivity.isConnected
  if (!isConnected) {
    return 'No network connection'
  }

  const tokenExpiresAt = await SecureStore.getItemAsync(
    'userAccessTokenExpiresAt'
  )
  console.log(
    '🚀 ~ file: authUtils.ts:31 ~ current token expires/expired at: ',
    moment(tokenExpiresAt).format('MMMM Do YYYY, h:mm:ss a')
  )

  const accessTokenIsExpired = moment().isAfter(tokenExpiresAt)
  if (!accessTokenIsExpired) {
    return 'Tokens still valid'
  }

  const existingRefreshToken = await SecureStore.getItemAsync(
    'userRefreshToken'
  )
  if (!existingRefreshToken) {
    return 'No refresh token found'
  }

  const tokenEndpoint =
    'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/b2c_1_signin/oauth2/v2.0/token'

  try {
    const refreshResponse = await refreshAsync(
      {
        clientId: EXPO_PUBLIC_CLIENT_ID,
        refreshToken: existingRefreshToken,
      },
      { tokenEndpoint }
    )

    if (!refreshResponse.accessToken) {
      return 'Tokens could not be refreshed'
    }

    const { accessToken, refreshToken, idToken, issuedAt, expiresIn } =
      refreshResponse

    console.log('🚀 ~ file: authUtils.ts:58 ~ Token exchange successful')

    await storeAccessTokens({
      accessToken,
      refreshToken: refreshToken,
      idToken,
      expiresIn,
      issuedAt,
    })
    return 'Tokens refreshed'
  } catch (responseError) {
    console.error('Error during token refresh:', responseError)
    return 'Tokens could not be refreshed'
  }
}

export const storeAccessTokens = async ({
  accessToken,
  refreshToken = '',
  idToken = '',
  expiresIn = 3600,
  issuedAt,
}: {
  accessToken: string
  refreshToken?: string
  idToken?: string
  expiresIn?: number
  issuedAt: number
}) => {
  const formattedTokenExpiresAt = moment(
    (expiresIn as number) * 1000 + issuedAt * 1000
  ).format()

  // Setting the token expiration to 30 seconds for testing purposes
  // const formattedTokenExpiresAt = moment(
  //   (30 as number) * 1000 + issuedAt * 1000
  // ).format()

  console.log(
    '🚀 ~ file: authUtils.ts:107 ~ New token expiration time',
    moment(formattedTokenExpiresAt).format('MMMM Do YYYY, h:mm:ss a')
  )
  await SecureStore.setItemAsync('userAccessToken', accessToken)

  await SecureStore.setItemAsync('userRefreshToken', refreshToken)
  await SecureStore.setItemAsync('userIdToken', idToken)

  await SecureStore.setItemAsync(
    'userAccessTokenExpiresAt',
    formattedTokenExpiresAt
  )
}

export const getTokenData = async () => {
  const accessToken = await SecureStore.getItemAsync('userAccessToken')
  const idToken = await SecureStore.getItemAsync('userIdToken')
  const tokenExpiresAt = await SecureStore.getItemAsync(
    'userAccessTokenExpiresAt'
  )
  const refreshToken = await SecureStore.getItemAsync('userRefreshToken')
  return { accessToken, idToken, tokenExpiresAt, refreshToken }
}

export const isTokenExpired = (tokenExpiresAt: string | null) => {
  return moment().isAfter(tokenExpiresAt)
}

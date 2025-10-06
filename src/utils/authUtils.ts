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

export const refreshUserToken = async (
  dispatch: AppDispatch
): Promise<TokenResponse | null> => {
  const isConnected = store.getState().connectivity.isConnected

  const tokenExpiresAt = await SecureStore.getItemAsync(
    'userAccessTokenExpiresAt'
  )
  console.log(
    '🚀 ~ file: authUtils.ts:31 ~ current token expires/expired at: ',
    moment(tokenExpiresAt).format('MMMM Do YYYY, h:mm:ss a')
  )
  if (isConnected) {
    try {
      const accessTokenIsExpired = moment().isAfter(tokenExpiresAt)
      if (!accessTokenIsExpired) {
        return 'Tokens still valid' as TokenResponse
      }

      //refreshAsync to exchave for new token
      const existingRefreshToken = await SecureStore.getItemAsync(
        'userRefreshToken'
      )

      const tokenEndpoint =
        'https://rsttabletapp.b2clogin.com/rsttabletapp.onmicrosoft.com/b2c_1_signin/oauth2/v2.0/token'

      const refreshResponse = await refreshAsync(
        {
          clientId: EXPO_PUBLIC_CLIENT_ID,
          refreshToken: existingRefreshToken || undefined,
        },
        { tokenEndpoint }
      )

      if (refreshResponse.accessToken !== null) {
        const { accessToken, refreshToken, idToken, issuedAt, expiresIn } =
          refreshResponse

        console.log('🚀 ~ file: authUtils.ts:58 ~ Token exchange successful')

        await storeAccessTokens({
          accessToken,
          refreshToken: refreshToken || existingRefreshToken || '',
          idToken,
          expiresIn,
          issuedAt,
        })
        return 'Tokens refreshed'
      } else {
        throw new Error('No access token in refresh response')
      }
    } catch (responseError) {
      if (responseError instanceof Error) {
        throw new Error('Error during token refresh')
      }
    }
  } else {
    return 'No network connection' as TokenResponse
  }
  return null
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

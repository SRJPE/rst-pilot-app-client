import api from './axiosConfig'

export const getStreamOptions = async () => {
  try {
    const StreamOptionsResult = await api.get(`/streams`)
    return StreamOptionsResult.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

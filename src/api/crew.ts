import api from './axiosConfig'

export const getCrew = async () => {
  try {
    const crewResult = await api.get(`/crew`)
    return crewResult.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

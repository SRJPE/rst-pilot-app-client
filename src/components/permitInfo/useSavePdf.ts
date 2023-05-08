import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'

const useSavePdf = () => {
  const createAndSavePDF = async (uri: string) => {
    const fileName = uri.split('/').at(-1)
    try {
      const { uri: localUri } = await FileSystem.downloadAsync(
        uri,
        FileSystem.documentDirectory + `${fileName}`
      )

      await shareAsync(localUri)
    } catch (error) {
      console.error(error)
    }
  }
  return createAndSavePDF
}

export default useSavePdf

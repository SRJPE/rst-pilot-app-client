import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import CustomModal from './CustomModal'
import { Text, Button } from 'native-base'
import { WebView } from 'react-native-webview'
import * as FileSystem from 'expo-file-system'

type Props = {
  handleClosePdfPreview: () => void
  activeFilePreview: { name: string; uri: string }
}

const PdfPreviewScreen = ({
  handleClosePdfPreview,
  activeFilePreview: { uri, name },
}: Props) => {
  const [dataUri, setDataUri] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      if (isMounted) {
        setDataUri(`data:application/pdf;base64,${base64}`)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [uri])

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <CustomModal
        isOpen={uri ? true : false}
        closeModal={handleClosePdfPreview}
        height='100%'
      >
        <>
          <Text textAlign='center' fontSize='3xl' py={5}>
            {name}
          </Text>
          {dataUri && (
            <WebView
              style={{ flex: 1, alignSelf: 'stretch' }}
              originWhitelist={['*']}
              source={{ uri: dataUri }}
            />
          )}
          <Button
            my={5}
            mx='auto'
            minWidth={300}
            bgColor='primary'
            onPress={handleClosePdfPreview}
          >
            <Text fontSize='xl' color='white'>
              Close
            </Text>
          </Button>
        </>
      </CustomModal>
    </SafeAreaView>
  )
}

export default PdfPreviewScreen

import React from 'react'
import { SafeAreaView } from 'react-native'
import CustomModal from './CustomModal'
import { Text, Button } from 'native-base'
import Pdf from 'react-native-pdf'

type Props = {
  handleClosePdfPreview: () => void
  activeFilePreview: { name: string; uri: string }
}

const PdfPreviewScreen = ({
  handleClosePdfPreview,
  activeFilePreview: { uri, name },
}: Props) => {
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
          <Pdf
            style={{ flex: 1, alignSelf: 'stretch' }}
            source={{ uri, cache: true }}
          />
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

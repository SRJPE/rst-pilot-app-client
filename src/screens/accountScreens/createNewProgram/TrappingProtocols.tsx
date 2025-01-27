import React, { useState } from 'react'
import {
  Box,
  Center,
  Heading,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import AppLogo from '../../../components/Shared/AppLogo'
import { Ionicons } from '@expo/vector-icons'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'

import useCacheDirectory from '../../../utils/hooks/useCacheDirectory'
import FilePreviewCard from '../../../components/Shared/FilePreviewCard'
import PdfPreviewScreen from '../../../components/Shared/PdfPreviewScreen'
const TrappingProtocols = ({ navigation }: { navigation: any }) => {
  const {
    handleFileRemoval,
    handleFileSelection,
    handleOpenPdfPreview,
    handleClosePdfPreview,
    files,
    activeFilePreview,
    openDocumentPicker,
  } = useCacheDirectory('rotaryScrewTrapProtocols')

  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Center bg='primary' py='5%'>
          <AppLogo imageSize={200} />
        </Center>
        <VStack py='5%' px='10%' space={5}>
          <Heading alignSelf='center'>Rotary Screw Trap Protocols</Heading>
          <Text fontSize='lg' color='grey'>
            Upload PDF of Rotary Screw Trap Monitoring Protocols
          </Text>
          <Pressable alignSelf='center' onPress={() => openDocumentPicker()}>
            <Center
              h='100'
              w='650'
              borderWidth='2'
              borderColor='grey'
              borderStyle='dotted'
            >
              <Icon as={Ionicons} name='cloud-upload' size='5xl' color='grey' />
              <Text fontSize='lg'>
                Click to{' '}
                <Text
                  style={{
                    textDecorationLine: 'underline',
                  }}
                  color={'primary'}
                >
                  select file
                </Text>
              </Text>
            </Center>
          </Pressable>

          {files.map((file, index) => (
            <FilePreviewCard
              key={index + file.name}
              handleFileRemoval={handleFileRemoval}
              handleOpenPdfPreview={handleOpenPdfPreview}
              file={file}
            />
          ))}
        </VStack>
      </Box>
      <CreateNewProgramNavButtons navigation={navigation} />
      {/* --------- Modals --------- */}
      {activeFilePreview?.uri && (
        <PdfPreviewScreen
          handleClosePdfPreview={handleClosePdfPreview}
          activeFilePreview={activeFilePreview}
        />
      )}
    </>
  )
}

export default TrappingProtocols

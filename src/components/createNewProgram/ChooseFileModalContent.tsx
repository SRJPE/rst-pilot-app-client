import { Divider, HStack } from 'native-base'
import React from 'react'
import { Icon, Pressable, Text } from 'native-base'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { FileDetails } from '../../utils/hooks/useCacheDirectory'

const ChooseFileModalContent = ({
  closeModal,
  handleFileSelection,
}: {
  closeModal: () => void
  handleFileSelection: ({
    files,
    documentType,
  }: {
    files: any[]
    documentType: string
  }) => void
}) => {
  return (
    <>
      <HStack mx='4%' my='3' alignItems='center' justifyContent='space-between'>
        <Text fontSize='xl'>Choose File</Text>
        <Pressable onPress={closeModal}>
          <Icon as={Ionicons} name={'close'} size='5xl' color='black' />
        </Pressable>
      </HStack>
      <Divider />
      <Pressable>
        <HStack space={8} alignItems='center' mx='5%' my='5%'>
          <Icon
            as={Ionicons}
            name='checkmark-circle-outline'
            size='20'
            ml='2'
            color={'primary'}
          />
          <Text fontSize='xl'>Scan Document</Text>
        </HStack>
      </Pressable>
      <Divider />
      <Pressable
        onPress={() =>
          DocumentPicker.getDocumentAsync({
            // copyToCacheDirectory: true,
            multiple: true,
          })
            .then(res => {
              if (!res.canceled) {
                const files = res.assets

                handleFileSelection({
                  files,
                  documentType: 'efficiencyTrialProtocols',
                })
              }
            })
            .finally(closeModal)
        }
      >
        <HStack space={8} alignItems='center' mx='5%' my='5%'>
          <Icon
            as={MaterialIcons}
            name='picture-as-pdf'
            size='20'
            ml='2'
            color={'primary'}
          />
          <Text fontSize='xl'>Upload File</Text>
        </HStack>
      </Pressable>
    </>
  )
}

export default ChooseFileModalContent

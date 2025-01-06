import { Ionicons } from '@expo/vector-icons'
import { HStack, Text, Pressable, VStack, Icon } from 'native-base'
import React from 'react'
import { FileDetails } from '../../utils/hooks/useCacheDirectory'
import { convertBytesToKB } from '../../utils/helpers/helperFunctions'

type Props = {
  file: FileDetails
  handleOpenPdfPreview: (selectedFile: FileDetails) => void
  handleFileRemoval: (selectedFile: FileDetails) => void
}

const FilePreviewCard = ({
  file,
  handleFileRemoval,
  handleOpenPdfPreview,
}: Props) => {
  return (
    <HStack
      backgroundColor='gray.100'
      style={{
        gap: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: 'grey',
      }}
    >
      <VStack>
        <Text fontSize={'lg'}>{file.name}</Text>
        <Text fontSize={'md'} fontWeight={500} color={'gray.700'}>
          {convertBytesToKB(file.size)}
        </Text>
      </VStack>
      <HStack space={8} ml='auto'>
        <Pressable
          onPress={() => handleOpenPdfPreview(file)}
          style={{
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon as={Ionicons} size='xl' name='eye' color='primary' />
          <Text>View</Text>
        </Pressable>
        <Pressable
          onPress={() => handleFileRemoval(file)}
          style={{
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon as={Ionicons} size='xl' name='trash' color='danger.700' />
          <Text>Delete</Text>
        </Pressable>
      </HStack>
    </HStack>
  )
}

export default FilePreviewCard

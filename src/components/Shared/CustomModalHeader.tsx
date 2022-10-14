import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import { Box, Button, Heading, HStack, Icon, View, Text, Divider } from 'native-base'
import React from 'react'

const CustomModalHeader = ({
  headerText,
  showHeaderButon,
  headerButton,
  closeModal,
  onCloseAction,
}: {
  headerText: string
  showHeaderButon: boolean
  headerButton?: any
  closeModal?: any
  onCloseAction?: any
}) => {
  if (showHeaderButon) {
    return (
      <>
        <HStack justifyContent='space-between' alignItems='center' marginTop={2}>
          <HStack alignItems='center'>
            <Button
              size='lg'
              onPress={() => {
                if (onCloseAction) onCloseAction()
                if (closeModal) closeModal()
              }}
            >
              <Icon as={Ionicons} name={'close'} size='5xl' color='black' />
            </Button>
            <Heading marginLeft='10'>{headerText}</Heading>
          </HStack>
          {headerButton ? headerButton : <></>}
        </HStack>
        <Divider my={2} thickness='3' />
      </>
    )
  } else {
    return (
      <>
        <HStack
          justifyContent='space-between'
          alignItems='center'
          marginTop={2}
        >
          <Button
            size='lg'
            onPress={() => {
              if (onCloseAction) onCloseAction()
              if (closeModal) closeModal()
            }}
          >
            <Icon as={Ionicons} name={'close'} size='5xl' color='black' />
          </Button>
          <Heading flex={1} textAlign='center' mr='24'>
            {headerText}
          </Heading>
        </HStack>
        <Divider my={2} thickness='3' />
      </>
    )
  }
}

const addFishModalButtonStyles = StyleSheet.create({
  individiualOrBatchButton: {
    backgroundColor: '#D1E8F0',
    borderRadius: 50,
    width: 200,
    height: 50,
    position: 'relative',
  },
  buttonBoxLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    paddingHorizontal: 25,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
  },
  buttonBoxRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    paddingHorizontal: 25,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#007C7C',
  },
})

interface AddFishModalButtonI {
  activeTab: 'Individual' | 'Batch'
  setActiveTab: any
}

export const AddFishModalHeaderButton: React.FC<AddFishModalButtonI> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <View style={addFishModalButtonStyles.individiualOrBatchButton}>
      <Box
        onTouchStart={() => setActiveTab('Individual')}
        style={
          activeTab === 'Individual'
            ? [
                addFishModalButtonStyles.buttonBoxLeft,
                addFishModalButtonStyles.activeTab,
              ]
            : addFishModalButtonStyles.buttonBoxLeft
        }
      >
        <Text color={activeTab === 'Individual' ? 'white' : '#007C7C'}>
          Individual
        </Text>
      </Box>
      <Box
        onTouchStart={() => setActiveTab('Batch')}
        style={
          activeTab === 'Batch'
            ? [
                addFishModalButtonStyles.buttonBoxRight,
                addFishModalButtonStyles.activeTab,
              ]
            : addFishModalButtonStyles.buttonBoxRight
        }
      >
        <Text color={activeTab === 'Batch' ? 'white' : '#007C7C'}>Batch</Text>
      </Box>
    </View>
  )
}

export default CustomModalHeader

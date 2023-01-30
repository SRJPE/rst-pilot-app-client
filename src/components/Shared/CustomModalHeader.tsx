import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  View,
  Text,
  Divider,
} from 'native-base'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const CustomModalHeader = ({
  headerText,
  showHeaderButton,
  headerButton,
  closeModal,
  navigateBack,
}: {
  headerText: string
  showHeaderButton: boolean
  headerButton?: any
  closeModal?: any
  navigateBack?: any
}) => {
  const navigation = useNavigation() as any
  if (showHeaderButton) {
    return (
      <>
        <HStack
          justifyContent='space-between'
          alignItems='center'
          marginTop={2}
          mr='5'
        >
          <HStack alignItems='center'>
            {
              <Button
                size='lg'
                onPress={() => {
                  if (navigateBack) {
                    // navigation.goBack()
                    navigation.navigate('Trap Visit Form', {
                      screen: 'Fish Input',
                    })
                  }
                  if (closeModal) {
                    closeModal()
                  }
                }}
              >
                <Icon as={Ionicons} name={'close'} size='5xl' color='black' />
              </Button>
            }
            <Heading marginLeft='10'>{headerText}</Heading>
          </HStack>
          {/* QUICK FIX */}
          {headerText === 'Add Fish' ? (
            <Box ml='340'>{headerButton ? headerButton : <></>}</Box>
          ) : (
            <Box ml='200'>{headerButton ? headerButton : <></>}</Box>
          )}
        </HStack>
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
  individualOrBatchButton: {
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

export const AddFishModalHeaderButton = ({
  activeTab,
  buttonNav,
}: {
  activeTab: any
  buttonNav: any
}) => {
  return (
    <View style={addFishModalButtonStyles.individualOrBatchButton}>
      <Box
        onTouchStart={() => buttonNav()}
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
        onTouchStart={() => buttonNav()}
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

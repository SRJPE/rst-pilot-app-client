import { Ionicons } from '@expo/vector-icons'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'
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
  headerFontSize,
  showHeaderButton,
  headerButton,
  closeModal,
  navigateBack,
  headerStyle,
}: {
  headerText: string
  headerFontSize?: number
  showHeaderButton: boolean
  headerButton?: any
  closeModal?: any
  navigateBack?: any
  headerStyle?: StyleProp<TextStyle>
}) => {
  const navigation = useNavigation() as any
  if (showHeaderButton) {
    return (
      <>
        <HStack
          justifyContent='space-between'
          alignItems='center'
          marginTop={2}
          space={5}
          w='100%'
        >
          <HStack alignItems='center'>
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
              <Icon as={Ionicons} name={'close'} size='3xl' color='black' />
            </Button>
            <Heading style={headerStyle} fontSize={headerFontSize}>
              {headerText}
            </Heading>
          </HStack>
          <Box mr='5'>{headerButton}</Box>
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
              if (closeModal) closeModal()
            }}
          >
            <Icon as={Ionicons} name={'close'} size='5xl' color='black' />
          </Button>
          <Heading
            flex={1}
            textAlign='center'
            mr='24'
            style={headerStyle}
            fontSize={headerFontSize}
          >
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

import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useFormikContext } from 'formik'
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  View,
} from 'native-base'
import { useState } from 'react'
import { Keyboard, StyleProp, StyleSheet, TextStyle } from 'react-native'
import CustomModal from './CustomModal'
import ConfirmationModalContent from './ConfirmationModalContent'
import { border } from 'native-base/lib/typescript/theme/styled-system'

const CustomModalHeader = ({
  headerText,
  headerFontSize,
  showHeaderButton,
  headerButton,
  closeModal,
  showConfirmationModal,
  navigateBack,
  headerStyle,
}: {
  headerText: string
  headerFontSize?: number
  showHeaderButton: boolean
  headerButton?: any
  closeModal?: any
  showConfirmationModal?: boolean
  navigateBack?: any
  headerStyle?: StyleProp<TextStyle>
}) => {
  const navigation = useNavigation() as any
  const formikContext = useFormikContext()
  let resetForm = null as any
  if (formikContext) {
    resetForm = formikContext.resetForm
  }
  const [confirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false)
  return (
    <>
      {showHeaderButton ? (
        <HStack
          justifyContent='space-between'
          alignItems='center'
          marginTop={2}
          space={5}
          w='100%'
        >
          <HStack alignItems='center' mx={'2%'}>
            <Button
              size='lg'
              onPress={() => {
                if (showConfirmationModal) {
                  setConfirmationModalOpen(true)
                  return
                }

                if (navigateBack) {
                  navigation.preload('Fish Input')
                  // navigation.goBack()
                  navigation.navigate('Trap Visit Form', {
                    screen: 'Fish Input',
                  })
                }
                if (closeModal) closeModal()

                if (resetForm) resetForm()
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
      ) : (
        <HStack
          justifyContent='space-between'
          alignItems='center'
          marginTop={2}
          mx={'2%'}
        >
          <Button
            size='lg'
            onPress={() => {
              Keyboard.dismiss()
              if (closeModal) closeModal()
              setTimeout(() => {
                if (resetForm) resetForm()
              }, 500)
            }}
          >
            <Icon as={Ionicons} name={'close'} size='3xl' color='black' />
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
      )}
      <Divider my={2} thickness='3' />
      {closeModal && (
        <CustomModal
          height={200}
          width={525}
          style={{ borderRadius: 5 }}
          isOpen={confirmationModalOpen}
          closeModal={() => setConfirmationModalOpen(false)}
        >
          <ConfirmationModalContent
            modalHeader='Return to fish input?'
            modalText='
            You are about to return to fish input screen. None of your current batch entries will be saved. Are you sure you want to continue?'
            handlePressCancel={() => setConfirmationModalOpen(false)}
            handlePressConfirm={() => {
              if (navigateBack) {
                navigation.preload('Fish Input')
                navigation.navigate('Trap Visit Form', {
                  screen: 'Fish Input',
                })
              }
              if (closeModal) closeModal()
              if (resetForm) resetForm()
            }}
            confirmButtonLabel='Leave'
            cancelButtonLabel='Close'
          />
        </CustomModal>
      )}
    </>
  )
}

const addFishModalButtonStyles = StyleSheet.create({
  individualOrBatchButton: {
    backgroundColor: '#D1E8F0',
    borderRadius: 50,
    width: 200,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBoxLeft: {
    flex: 1,
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBoxRight: {
    flex: 1,
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
        onTouchStart={() => buttonNav('Add Fish')}
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
          IND
        </Text>
      </Box>
      <Box
        onTouchStart={() => buttonNav('Batch Count')}
        style={
          activeTab === 'Batch'
            ? [
                addFishModalButtonStyles.buttonBoxRight,
                addFishModalButtonStyles.activeTab,
              ]
            : addFishModalButtonStyles.buttonBoxRight
        }
      >
        <Text color={activeTab === 'Batch' ? 'white' : '#007C7C'}>BATCH</Text>
      </Box>
      <Box
        onTouchStart={() => buttonNav('Multi Species')}
        style={
          activeTab === 'Multi'
            ? [
                addFishModalButtonStyles.buttonBoxRight,
                addFishModalButtonStyles.activeTab,
              ]
            : addFishModalButtonStyles.buttonBoxRight
        }
      >
        <Text color={activeTab === 'Multi' ? 'white' : '#007C7C'}>MULTI</Text>
      </Box>
    </View>
  )
}

export default CustomModalHeader

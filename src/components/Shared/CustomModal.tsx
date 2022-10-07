import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Modal,
  ScrollView,
  Text,
  View,
} from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'

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

interface ModalPropsI {
  isOpen: boolean
  onClose: any
  headerText: string
  children: JSX.Element
  showHeaderButon?: boolean
  headerButton?: any
}

interface AddFishModalButtonI {
  activeTab: 'Individual' | 'Batch'
}

export const AddFishModalButton: React.FC<AddFishModalButtonI> = ({
  activeTab,
}) => {
  return (
    <View style={addFishModalButtonStyles.individiualOrBatchButton}>
      <Box
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

export default function CustomModal(props: ModalPropsI) {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      size={'full'}
      justifyContent={'flex-end'}
    >
      <Modal.Content height={'full'}>
        <HStack
          alignItems='center'
          justifyContent='space-between'
          borderBottomWidth='1'
          p='3'
        >
          {props.showHeaderButon ? (
            <>
              <HStack alignItems='center'>
                <Button size='lg' onPress={() => props.onClose()}>
                  <Icon as={Ionicons} name={'close'} size='5xl' color='black' />
                </Button>
                <Heading marginLeft='10'>{props.headerText}</Heading>
              </HStack>
              {props.headerButton ? props.headerButton : <></>}
            </>
          ) : (
            <>
              <Button size='lg' onPress={() => props.onClose()}>
                <Icon as={Ionicons} name={'close'} size='5xl' color='black' />
              </Button>
              <Heading flex={1} textAlign='center' mr='24'>
                {props.headerText}
              </Heading>
            </>
          )}
        </HStack>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant='ghost'
              colorScheme='blueGray'
              onPress={() => {
                console.log('click')
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                console.log('click')
              }}
            >
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

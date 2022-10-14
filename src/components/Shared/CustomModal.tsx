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

interface ModalPropsI {
  isOpen: boolean
  closeModal: any
  children: JSX.Element
  height?: string
}



export default function CustomModal(props: ModalPropsI) {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.closeModal}
      size={'full'}
      h={props.height ? props.height : 'full'}
      style={{ marginBottom: 0, marginTop: 'auto' }}
      justifyContent={props.height ? 'center' : 'flex-end'}
    >
      <Modal.Content height={'full'}>
        <Modal.Body p='0'>{props.children}</Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

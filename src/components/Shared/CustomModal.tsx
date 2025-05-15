import React, { JSX, memo } from 'react'
// import { Modal } from 'native-base'
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal'
import {
  Modal as PaperModal,
  Portal,
  Text,
  Button,
  Provider,
} from 'react-native-paper'

interface ModalPropsI {
  isOpen: boolean
  closeModal: any
  children: JSX.Element
  height?: string
  style?: Record<string, string | number>
  size?: 'full' | 'lg' | 'md' | 'sm' | 'xs' | undefined
}

const CustomModal = (props: ModalPropsI) => {
  return (
    <>
      <Portal>
        <PaperModal
          visible={props.isOpen}
          onDismiss={props.closeModal}
          dismissable={true}
          contentContainerStyle={{ backgroundColor: 'white', height: '100%' }}
        >
          {props.children}
        </PaperModal>
      </Portal>
      {/* <Modal
        useRNModal={true}
        isOpen={props.isOpen}
        onClose={props.closeModal}
        avoidKeyboard
        closeOnOverlayClick={false}
        size={'full'}
        // h={props.height ? props.height : 'full'}
        style={
          props.style
            ? props.style
            : { marginBottom: 0, marginTop: 'auto', height: '100%' }
        }
      >
        <ModalContent>{props.children}</ModalContent>
      </Modal> */}
    </>
  )
}

export default memo(CustomModal)

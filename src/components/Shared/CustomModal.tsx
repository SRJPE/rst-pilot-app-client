import React, { memo } from 'react'
import { Modal } from 'native-base'

interface ModalPropsI {
  isOpen: boolean
  closeModal: any
  children: JSX.Element
  height?: string
  style?: Record<string, string | number>
  size?: 'full' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
}

const CustomModal = (props: ModalPropsI) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.closeModal}
      avoidKeyboard
      closeOnOverlayClick={false}
      size={props.size || 'full'}
      h={props.height ? props.height : 'full'}
      style={props.style ? props.style : { marginBottom: 0, marginTop: 'auto' }}
    >
      <Modal.Content height={'full'}>{props.children}</Modal.Content>
    </Modal>
  )
}

export default memo(CustomModal)

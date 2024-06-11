import React, { memo } from 'react'
import { Modal } from 'native-base'

interface ModalPropsI {
  isOpen: boolean
  closeModal: any
  children: JSX.Element
  height?: string
}

const CustomModal = (props: ModalPropsI) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.closeModal}
      avoidKeyboard
      closeOnOverlayClick={false}
      size={'full'}
      h={props.height ? props.height : 'full'}
      style={{ marginBottom: 0, marginTop: 'auto' }}
    >
      <Modal.Content height={'full'}>{props.children}</Modal.Content>
    </Modal>
  )
}

export default memo(CustomModal)

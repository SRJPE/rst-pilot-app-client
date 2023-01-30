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
      size={'full'}
      h={props.height ? props.height : 'full'}
      style={{ marginBottom: 0, marginTop: 'auto' }}
    >
      <Modal.Content height={'full'}>
        <Modal.Body p='0'>{props.children}</Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default memo(CustomModal)

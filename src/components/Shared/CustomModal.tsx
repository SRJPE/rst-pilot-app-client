import React from 'react'
import { Modal } from 'native-base'

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
      // justifyContent={props.height ? 'center' : 'flex-end'}
      // justifyContent='flex-end'
      // alignItems='flex-end'
    >
      <Modal.Content height={'full'}>
        <Modal.Body p='0'>{props.children}</Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

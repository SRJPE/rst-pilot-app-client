import React, { useState } from 'react'
import { Button, Modal, ScrollView, Text } from 'native-base'

interface ModalPropsI {
  isOpen: boolean
  onClose: any
  header: string
  children: JSX.Element,
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
        <Modal.CloseButton justifyContent={'flex-start'} />
        <Modal.Header>{props.header}</Modal.Header>
        <Modal.Body>
          {props.children}
        </Modal.Body>
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

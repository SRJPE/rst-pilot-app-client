import React, { JSX, memo } from 'react'

import {
  Modal as PaperModal,
  Portal,
  Text,
  Button,
  Provider,
} from 'react-native-paper'
import { Animated } from 'react-native'

interface ModalPropsI {
  isOpen: boolean
  closeModal: any
  children: JSX.Element
  height?:
    | number
    | `${number}%`
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | 'auto'
    | Animated.WithAnimatedObject<Animated.AnimatedNode>
    | null
    | undefined
  style?: Record<string, string | number>
  width?:
    | number
    | `${number}%`
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | 'auto'
    | Animated.WithAnimatedObject<Animated.AnimatedNode>
    | null
    | undefined
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
          contentContainerStyle={{
            backgroundColor: 'white',
            height: props.height ? props.height : '100%',
            width: props.width ? props.width : '100%',
            // justifyContent: 'center',
            // alignItems: 'center',
            alignSelf: 'center',
            // display: 'flex',
            ...props.style,
          }}
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

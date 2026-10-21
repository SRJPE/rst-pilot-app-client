import React, { JSX, memo } from 'react'

import { Animated, Modal as RNModal, Pressable, View } from 'react-native'

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
    <RNModal
      visible={props.isOpen}
      onRequestClose={props.closeModal}
      transparent
      animationType='fade'
      statusBarTranslucent
    >
      <View style={{ flex: 1 }}>
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={props.closeModal}
        />
        <View
          pointerEvents='box-none'
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              height: props.height ? props.height : '100%',
              width: props.width ? props.width : '100%',
              justifyContent: 'flex-start',
              ...props.style,
            }}
          >
            {props.children}
          </View>
        </View>
      </View>
    </RNModal>
  )
}

export default memo(CustomModal)

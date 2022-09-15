import { useEffect, useState } from 'react'
import { Image } from 'native-base'
export default function Logo() {
  return (
    <Image
      w='50%'
      h='50%'
      // borderRadius={1000}
      style={[{ transform: [{ rotate: '-50deg' }] }]}
      source={{
        uri: 'https://user-images.githubusercontent.com/22649273/186754977-50398ed3-47dc-4af8-a127-d2ddf155e7f1.jpeg',
      }}
      alt='Alternate Text asdf'
    />
  )
}

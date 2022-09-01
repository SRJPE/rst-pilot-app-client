import React from 'react'
import { Box, HStack, Image, VStack, Text, Pressable } from 'native-base'

export default function NavButtons() {
  return (
    <Box
      bg='themeGrey'
      py='4'
      px='3'
      borderRadius='5'
      rounded='md'
      maxWidth='100%'
    >
      <HStack justifyContent='space-between'>
        <Pressable
          rounded='xs'
          bg='secondary'
          alignSelf='flex-start'
          py='1'
          px='50'
          borderRadius='5'
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='primary'
          >
            Back
          </Text>
        </Pressable>
        <Pressable
          rounded='xs'
          bg='primary'
          alignSelf='flex-start'
          py='1'
          px='50'
          borderRadius='5'
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='white'
          >
            Next
          </Text>
        </Pressable>
      </HStack>
    </Box>
  )
}

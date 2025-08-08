import React from 'react'
import { Box, Pressable, Text, VStack } from 'native-base'

const ReportCard = ({
  title,
  description,
  onPress,
}: {
  title: string
  description: string
  onPress: () => void
}) => {
  return (
    <Pressable
      //key={key}
      onPress={onPress}
      flexBasis={'48%'}
      mb={25}
    >
      <VStack>
        <Box
          bg='themeGrey'
          borderColor='#ccc'
          borderBottomWidth='3'
          borderRightWidth='3'
          borderLeftWidth='3'
          borderTopWidth='3'
          borderRadius='5'
          p={5}
          minHeight={200}
        >
          <Text fontWeight={600} fontSize={18} mb={2}>
            {title}
          </Text>
          <Text>{description}</Text>
        </Box>
      </VStack>
    </Pressable>
  )
}
export default ReportCard

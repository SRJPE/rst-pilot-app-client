import React from 'react'
import { Center, Pressable, Text, VStack } from 'native-base'

const ReportCard = ({ navigation }: { navigation: any }) => {
  return (
    <Pressable
      //key={key}
      onPress={() => navigation.navigate('Share Report')}
    >
      <VStack h='200' w='200'>
        <Center
          bg='secondary'
          h='70%'
          borderColor='grey'
          borderWidth='3'
          borderRadius='3'
          borderBottomRadius='0'
        >
          <Text>Placeholder</Text>
        </Center>

        <Center
          bg='themeGrey'
          h='30%'
          borderColor='#ccc'
          borderBottomWidth='3'
          borderRightWidth='3'
          borderLeftWidth='3'
          borderRadius='3'
          borderTopRadius='0'
        >
          <Text>Biweekly Passage Summary</Text>
        </Center>
      </VStack>
    </Pressable>
  )
}
export default ReportCard

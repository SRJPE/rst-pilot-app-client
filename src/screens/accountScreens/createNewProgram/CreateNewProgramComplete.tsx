import React from 'react'
import { Box, Center, Heading, Text, VStack } from 'native-base'
import AppLogo from '../../../components/Shared/AppLogo'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'

const CreateNewProgramComplete = ({ navigation }: { navigation: any }) => {
  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Center bg='primary' py='5%'>
          <AppLogo imageSize={200} />
        </Center>
        <VStack py='5%' px='15%' space={10}>
          <Heading alignSelf='center'>Program Created!</Heading>
          <Text fontSize='2xl' color='grey'>
            {`Welcome to ${'{Program Name}'}! You are now all set to \nstart trapping.`}
          </Text>
        </VStack>
      </Box>
      <CreateNewProgramNavButtons navigation={navigation} />
    </>
  )
}

export default CreateNewProgramComplete

import React from 'react'
import { Box, Divider, Text, VStack } from 'native-base'
import CreateNewProgramNavButtons from '../../components/createNewProgram/CreateNewProgramNavButtons'
const PermittingInformationInput = ({ navigation }: { navigation: any }) => {
  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Box
          bg='primary'
          _text={{
            color: '#FFF',
            fontWeight: '700',
            fontSize: '2xl',
          }}
          px='6'
          py='3'
        >
          Permitting Information
        </Box>
        <Text fontSize='2xl' color='grey' ml='5%' mt='5%'>
          Enter Based on your 4d Permit
        </Text>
        <Divider mb='5%' />
        <VStack px='10%' space={5}></VStack>
      </Box>
      <CreateNewProgramNavButtons navigation={navigation} />
    </>
  )
}
export default PermittingInformationInput

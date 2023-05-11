import React, { useState } from 'react'
import { Box, Center, Checkbox, Heading, Text, View, VStack } from 'native-base'
import { AppLogo } from '../../SignIn'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'

const PermitInformation = ({ navigation }: { navigation: any }) => {
  const [checkboxGroupValue, setCheckboxGroupValue] = useState(
    [] as Array<string>
  )

  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Center bg='primary' py='5%'>
          <AppLogo imageSize={200} />
        </Center>
        <VStack py='5%' px='15%' space={10}>
          <Heading alignSelf='center'>Permit Information</Heading>
          <Text fontSize='2xl' color='grey'>
            Select the permits that you hold for your RST program:
          </Text>
          <Checkbox.Group //https://github.com/GeekyAnts/NativeBase/issues/5073
            colorScheme='green'
            px='5%'
            defaultValue={checkboxGroupValue}
            accessibilityLabel='Select the permits that you hold for your RST program'
            onChange={(values: any) => setCheckboxGroupValue(values)}
          >
            <Checkbox
              value='4d'
              my='1'
              _checked={{ bg: 'primary', borderColor: 'primary' }}
            >
              4d
            </Checkbox>
            <Checkbox
              value='SCP'
              my='1'
              _checked={{ bg: 'primary', borderColor: 'primary' }}
            >
              SCP
            </Checkbox>
            <Checkbox
              value='Other'
              my='1'
              _checked={{ bg: 'primary', borderColor: 'primary' }}
            >
              Other
            </Checkbox>
          </Checkbox.Group>
        </VStack>
      </Box>
      <CreateNewProgramNavButtons navigation={navigation} />
    </>
  )
}

export default PermitInformation

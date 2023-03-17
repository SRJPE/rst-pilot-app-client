import React, { useState } from 'react'
import {
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base'
import CreateNewProgramNavButtons from '../../components/createNewProgram/CreateNewProgramNavButtons'
import TrappingSitesDataTable from '../../components/createNewProgram/TrappingSitesDataTable'
import { AppLogo } from '../SignIn'
import { Ionicons } from '@expo/vector-icons'
import CustomModal from '../../components/Shared/CustomModal'
import AddTrapModalContent from '../../components/createNewProgram/AddTrapModalContent'
const TrappingSites = ({ navigation }: { navigation: any }) => {
  const [addTrapModalOpen, setAddTrapModalOpen] = useState(false as boolean)
  return (
    <>
      <View bg='#fff' flex={1}>
        <Box flex={1} bg='#fff'>
          <Center bg='primary' py='5%'>
            <AppLogo imageSize={200} />
          </Center>
          <Heading alignSelf='center'>Trapping Sites</Heading>
          <TrappingSitesDataTable />
          <VStack py='5%' px='10%' space={5}>
            <Pressable onPress={() => setAddTrapModalOpen(true)}>
              <HStack alignItems='center'>
                <Icon
                  as={Ionicons}
                  name={'add-circle'}
                  size='3xl'
                  color='primary'
                  marginRight='1'
                />
                <Text color='primary' fontSize='xl'>
                  Add another trap
                </Text>
              </HStack>
            </Pressable>
          </VStack>
        </Box>
        <Box
          bg='secondary'
          h='23%'
          mx='5%'
          borderRadius={20}
          alignSelf='flex-end'
        >
          <VStack m='3%'>
            <Text fontSize='2xl' mb='4'>
              You Added multiple traps to one stream. Do these traps belong to a
              single site?
            </Text>
            <Text fontSize='md' mb='4'>
              A site is a monitoring location with multiple traps that are
              either:
            </Text>
            <Text fontSize='md'>
              (a) being run simultaneously and can be summed together to
              represent daily catch; or
            </Text>
            <Text fontSize='md'>
              (b) there are multiple trap locations that are rotated through
              time but all trap locations represent the same site location.{' '}
            </Text>
          </VStack>
        </Box>
        <CreateNewProgramNavButtons navigation={navigation} />
      </View>
      {/* --------- Modals --------- */}
      <CustomModal
        isOpen={addTrapModalOpen}
        closeModal={() => setAddTrapModalOpen(false)}
        height='1/2'
      >
        <AddTrapModalContent closeModal={() => setAddTrapModalOpen(false)} />
      </CustomModal>
    </>
  )
}
export default TrappingSites

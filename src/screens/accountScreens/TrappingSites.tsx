import React, { useEffect, useState } from 'react'
import {
  Button,
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  Pressable,
  ScrollView,
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
import GroupTrapSiteModalContent from '../../components/createNewProgram/GroupTrapSiteModalContent'
import { RootState } from '../../redux/store'
import { connect } from 'react-redux'
import { TrappingSitesStoreI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
const TrappingSites = ({
  navigation,
  trappingSitesStore,
}: {
  navigation: any
  trappingSitesStore: TrappingSitesStoreI
}) => {
  const [addTrapModalOpen, setAddTrapModalOpen] = useState(false as boolean)
  const [groupTrapModalOpen, setGroupTrapModalOpen] = useState(false as boolean)

  useEffect(() => {
    if (Object.values(trappingSitesStore).length === 0) {
      setAddTrapModalOpen(true)
    }
  }, [])
  return (
    <>
      <View bg='#fff' flex={1}>
        <Box flex={1} bg='#fff'>
          <Center bg='primary' py='5%'>
            <AppLogo imageSize={200} />
          </Center>
          <Heading alignSelf='center'>Trapping Sites</Heading>
          <ScrollView h={300}>
            <TrappingSitesDataTable />
          </ScrollView>
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
          // h='23%'
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
            <Button
              alignSelf='flex-start'
              bg='primary'
              width='45%'
              height='20'
              rounded='xs'
              borderRadius='5'
              shadow='2'
              mt={5}
              onPress={() => setGroupTrapModalOpen(true)}
            >
              <Text fontSize='xl' fontWeight='bold' color='white'>
                Group
              </Text>
            </Button>
          </VStack>
        </Box>
        <CreateNewProgramNavButtons navigation={navigation} />
      </View>
      {/* --------- Modals --------- */}
      <CustomModal
        isOpen={addTrapModalOpen}
        closeModal={() => setAddTrapModalOpen(false)}
        height='70%'
      >
        <AddTrapModalContent closeModal={() => setAddTrapModalOpen(false)} />
      </CustomModal>
      <CustomModal
        isOpen={groupTrapModalOpen}
        closeModal={() => setGroupTrapModalOpen(false)}
        height='100%'
      >
        <GroupTrapSiteModalContent
          closeModal={() => setGroupTrapModalOpen(false)}
        />
      </CustomModal>
    </>
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    trappingSitesStore: state.trappingSites.trappingSitesStore,
  }
}

export default connect(mapStateToProps)(TrappingSites)

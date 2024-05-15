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
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import TrappingSitesDataTable from '../../../components/createNewProgram/TrappingSitesDataTable'
import { Ionicons } from '@expo/vector-icons'
import CustomModal from '../../../components/Shared/CustomModal'
import AddTrapModalContent from '../../../components/createNewProgram/AddTrapModalContent'
import { RootState } from '../../../redux/store'
import { connect } from 'react-redux'
import {
  TrappingSitesStoreI,
  individualTrappingSiteState,
} from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'

const TrappingSites = ({
  navigation,
  trappingSitesStore,
}: {
  navigation: any
  trappingSitesStore: TrappingSitesStoreI
}) => {
  const trapSitesArray = Object.values(trappingSitesStore)
  const [addTrapModalOpen, setAddTrapModalOpen] = useState(false as boolean)
  const [addTrapModalContent, setAddTrapModalContent] = useState(
    individualTrappingSiteState as any
  )
  useEffect(() => {
    if (Object.values(trappingSitesStore).length === 0) {
      setAddTrapModalOpen(true)
    }
  }, [])

  const handleShowTableModal = (selectedRowData: any) => {
    const modalDataContainer = {} as any
    Object.keys(selectedRowData).forEach((key: string) => {
      modalDataContainer[key] = selectedRowData[key].toString()
    })
    setAddTrapModalContent(modalDataContainer)
    setAddTrapModalOpen(true)
  }

  const closeModal = () => {
    setAddTrapModalOpen(false)
  }

  return (
    <>
      <View bg='#fff' flex={1} px={6}>
        <Box flex={1} bg='#fff'>
          <HStack
            my={5}
            space={5}
            alignItems='center'
            justifyContent='space-between'
          >
            <Heading alignSelf='left'>Trapping Sites</Heading>
            <Pressable
              onPress={() => {
                setAddTrapModalContent(individualTrappingSiteState)
                setAddTrapModalOpen(true)
              }}
            >
              <HStack alignItems='center' justifyContent='flex-end'>
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
          </HStack>
          <ScrollView h={300}>
            <TrappingSitesDataTable
              handleShowTableModal={handleShowTableModal}
            />
          </ScrollView>
        </Box>
        {trapSitesArray.length > 1 && (
          <Box
            bg='secondary'
            // h='23%'
            //mx='5%'
            mb={5}
            borderRadius={20}
            alignSelf='flex-end'
          >
            <VStack m='3%'>
              <Text fontSize='2xl' mb='4'>
                You added multiple traps to one stream. Do these traps belong to
                a single site?
              </Text>
              <Text fontSize='md' mb='4'>
                A site is a monitoring location with multiple traps that are
                either:
              </Text>
              <Text fontSize='md'>
                (a) Being run simultaneously and can be summed together to
                represent daily catch.{' '}
              </Text>
              <Text fontSize='md'>
                (b) There are multiple trap locations that are rotated through
                time but all trap locations represent the same site location.{' '}
              </Text>
              <CreateNewProgramNavButtons
                navigation={navigation}
                variant='multipleTrapsDialog'
              />
            </VStack>
          </Box>
        )}
      </View>
      {trapSitesArray.length <= 1 && (
        <CreateNewProgramNavButtons navigation={navigation} />
      )}
      {/* --------- Modals --------- */}
      {addTrapModalOpen && (
        <CustomModal
          isOpen={addTrapModalOpen}
          closeModal={closeModal}
          height='75%'
        >
          <AddTrapModalContent
            addTrapModalContent={addTrapModalContent}
            closeModal={closeModal}
          />
        </CustomModal>
      )}
    </>
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    trappingSitesStore: state.trappingSites.trappingSitesStore,
  }
}

export default connect(mapStateToProps)(TrappingSites)

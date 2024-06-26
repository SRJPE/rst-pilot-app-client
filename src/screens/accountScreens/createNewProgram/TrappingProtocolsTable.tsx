import React, { useState } from 'react'
import {
  Center,
  Divider,
  HStack,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  View,
} from 'native-base'
import AppLogo from '../../../components/Shared/AppLogo'
import TrappingProtocolsDataTable from '../../../components/createNewProgram/TrappingProtocolsDataTable'
import { Ionicons } from '@expo/vector-icons'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import CustomModal from '../../../components/Shared/CustomModal'
import AddTrappingProtocolModalContent from '../../../components/createNewProgram/AddTrappingProtocolModalContent'
import { IndividualTrappingProtocolState } from '../../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'

const TrappingProtocolsTable = ({ navigation }: { navigation: any }) => {
  const [addTrappingProtocolModalOpen, setAddTrappingProtocolModalOpen] =
    useState(false as boolean)
  const [
    addTrappingProtocolsModalContent,
    setAddTrappingProtocolsModalContent,
  ] = useState(IndividualTrappingProtocolState as any)

  const handleShowTableModal = (selectedRowData: any) => {
    const modalDataContainer = {} as any
    Object.keys(selectedRowData).forEach((key: string) => {
      modalDataContainer[key] = selectedRowData[key].toString()
    })
    setAddTrappingProtocolsModalContent(modalDataContainer)
    setAddTrappingProtocolModalOpen(true)
  }

  return (
    <>
      <View flex={1} bg='#fff'>
        <Center bg='primary' py='5%'>
          <AppLogo imageSize={200} />
        </Center>
        <VStack py='5%' px='10%' space={5}>
          <Heading alignSelf='center'>Trapping Protocols</Heading>
          <Text fontSize='lg' color='grey'>
            How many of the following species, life stage, and run do you
            measure on each trapping day:
          </Text>
        </VStack>
        <ScrollView h={300}>
          <TrappingProtocolsDataTable
            handleShowTableModal={handleShowTableModal}
          />
        </ScrollView>
        <Divider my='1%' />
        <VStack py='5%' px='10%' space={5}>
          <Pressable onPress={() => setAddTrappingProtocolModalOpen(true)}>
            <HStack alignItems='center'>
              <Icon
                as={Ionicons}
                name={'add-circle'}
                size='3xl'
                color='primary'
                marginRight='1'
              />
              <Text color='primary' fontSize='xl'>
                Add Trapping Protocol
              </Text>
            </HStack>
          </Pressable>
        </VStack>
      </View>
      <CreateNewProgramNavButtons navigation={navigation} />
      {/* --------- Modals --------- */}
      <CustomModal
        isOpen={addTrappingProtocolModalOpen}
        closeModal={() => setAddTrappingProtocolModalOpen(false)}
        height='1/3'
      >
        <AddTrappingProtocolModalContent
          addTrappingProtocolsModalContent={addTrappingProtocolsModalContent}
          closeModal={() => setAddTrappingProtocolModalOpen(false)}
        />
      </CustomModal>
    </>
  )
}

export default TrappingProtocolsTable

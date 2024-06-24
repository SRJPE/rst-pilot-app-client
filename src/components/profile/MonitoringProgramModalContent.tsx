import React from 'react'
import {
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Pressable,
  Radio,
  ScrollView,
  Image,
  Text,
  VStack,
} from 'native-base'
import CustomModalHeader from '../Shared/CustomModalHeader'
import { Input } from 'native-base'

//just an initial outline
const DUMMY_MONITORING_PROGRAM = {
  streamName: 'Bay View Stream',
  defaultTraps: {
    uri: 'https://www.maptive.com/wp-content/uploads/2020/11/sales-use-case-mapping-software-e1600453645467.jpg',
    alt: 'default trap image',
  },
  crewMembers: [
    { crewId: 1, firstName: 'Barry', lastName: 'Birkman' },
    { crewId: 2, firstName: 'Margaret', lastName: 'Wright' },
    { crewId: 3, firstName: 'Ted', lastName: 'Lasso' },
  ],
  hatcheryInformation: {
    hatcheryName: 'Chicken Hatchery',
    location: 'Sacramento, CA',
  },
  measuringRequirements: { numberMeasured: 365 },
}

const MonitoringProgramInfoModalContent = ({
  closeModal,
}: {
  closeModal: any
}) => {
  const {
    streamName,
    defaultTraps,
    crewMembers,
    hatcheryInformation,
    measuringRequirements,
  } = DUMMY_MONITORING_PROGRAM
  return (
    <>
      <CustomModalHeader
        headerText={'Monitoring Program Info'}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      <VStack space={5} mx='5%'>
        <Divider my={2} thickness='3' />
        <Text fontSize='xl' fontWeight={500}>
          Stream Name: <Text fontWeight={300}>{streamName}</Text>
        </Text>
        <VStack space={3}>
          <Text fontSize='xl' fontWeight={500}>
            Default Traps:
          </Text>
          <Image
            source={{ uri: defaultTraps.uri }}
            alt={defaultTraps.alt}
            width={500}
            height={250}
          />
        </VStack>
        <Divider my={2} thickness='3' />
        <HStack alignItems='flex-start' space={2}>
          <Text fontSize='xl' fontWeight={500}>
            Crew Members:
          </Text>
          <VStack>
            {crewMembers.map(member => (
              <Text
                fontSize='xl'
                fontWeight={300}
              >{`${member.firstName} ${member.lastName}`}</Text>
            ))}
          </VStack>
        </HStack>
        <Divider my={2} thickness='3' />
        <VStack space={3}>
          <Text fontSize='xl' fontWeight={500}>
            Hatchery Information:{' '}
          </Text>
          <HStack justifyContent='space-between'>
            <Text fontWeight={300} fontSize='xl'>
              Hatchery Name
            </Text>
            <Text fontWeight={300} fontSize='xl'>
              {hatcheryInformation.hatcheryName}
            </Text>
          </HStack>
        </VStack>

        <Divider my={2} thickness='3' />

        <VStack space={3}>
          <Text fontSize='xl' fontWeight={500}>
            Species Measuring Requirements:{' '}
          </Text>
          <HStack justifyContent='space-between'>
            <Text fontWeight={300} fontSize='xl'>
              Number of Chinook Measured
            </Text>
            <Text fontWeight={300} fontSize='xl'>
              {measuringRequirements.numberMeasured}
            </Text>
          </HStack>
        </VStack>

        <Button
          mt={5}
          alignSelf='center'
          borderRadius={10}
          bg='primary'
          h='60px'
          w='400px'
          shadow='5'
          _disabled={{
            opacity: '75',
          }}
          // isDisabled={email === '' || password === ''}
          onPress={() => {
            closeModal()
          }}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            Close
          </Text>
        </Button>
      </VStack>
    </>
  )
}

export default MonitoringProgramInfoModalContent

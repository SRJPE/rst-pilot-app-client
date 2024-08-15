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
import { groupArrayItems } from '../../utils/utils'
import type {
  MonitoringProgram,
  TrappingSite,
  CrewMember,
  HatcheryInformation,
} from '../../utils/interfaces'

const MonitoringProgramInfoModalContent = ({
  closeModal,
  monitoringProgramInfo,
}: {
  closeModal: () => void
  monitoringProgramInfo: MonitoringProgram | null
}) => {
  const groupedTrappingSites = groupArrayItems(
    monitoringProgramInfo?.trappingSites || [],
    10
  ) as TrappingSite[][]

  const groupedCrewMembers = groupArrayItems(
    monitoringProgramInfo?.crewMembers || [],
    6
  ) as CrewMember[][]

  return (
    <>
      <CustomModalHeader
        headerText={monitoringProgramInfo?.programName || ''}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      <VStack space={5} mx='5%'>
        <Text fontSize='lg' fontWeight={500}>
          Stream Name:{' '}
          <Text fontWeight={300}>{monitoringProgramInfo?.streamName}</Text>
        </Text>
        <VStack space={3}>
          <Text fontSize='lg' fontWeight={500}>
            Trap Sites:
          </Text>
          <HStack space={5}>
            {groupedTrappingSites?.map(trappingSites => (
              <VStack>
                {trappingSites.map(site => {
                  return (
                    <Text
                      key={site.trapName}
                      fontSize='lg'
                      fontWeight={300}
                    >{`${site.trapName} - ${site.siteName}`}</Text>
                  )
                })}
              </VStack>
            ))}
          </HStack>
        </VStack>
        <Divider my={2} thickness='3' />
        <VStack alignItems='flex-start' space={2}>
          <Text fontSize='lg' fontWeight={500}>
            Crew Members:
          </Text>
          <HStack space={5}>
            {groupedCrewMembers?.map((crewMembers, index) => (
              <VStack key={index}>
                {crewMembers.map(member => (
                  <Text key={member.id} fontSize='lg' fontWeight={300}>{`${
                    member.firstName
                  } ${member.lastName} ${
                    member.role === 'lead' ? '(Lead)' : ''
                  }`}</Text>
                ))}
              </VStack>
            ))}
          </HStack>
        </VStack>
        <Divider my={2} thickness='3' />
        <VStack space={3}>
          <Text fontSize='lg' fontWeight={500}>
            Hatchery Information:{' '}
          </Text>
          <HStack justifyContent='space-between'>
            <Text fontWeight={300} fontSize='lg'>
              Hatchery Name
            </Text>
            <Text fontWeight={300} fontSize='lg'>
              {monitoringProgramInfo?.hatcheryInformation?.hatcheryName}
            </Text>
          </HStack>
        </VStack>

        <Divider my={2} thickness='3' />

        <VStack space={3}>
          <Text fontSize='lg' fontWeight={500}>
            Species Measuring Requirements:{' '}
          </Text>
          <HStack justifyContent='space-between'>
            <Text fontWeight={300} fontSize='lg'>
              Number of Chinook Measured
            </Text>
            {/* //TODO: Add this back in when the data is available */}
            {/* <Text fontWeight={300} fontSize='lg'>
              {measuringRequirements.numberMeasured}
            </Text> */}
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
          <Text fontSize='lg' fontWeight='bold' color='white'>
            Close
          </Text>
        </Button>
      </VStack>
    </>
  )
}

export default MonitoringProgramInfoModalContent

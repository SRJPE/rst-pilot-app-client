import { ScrollView, View } from 'react-native'
import {
  CrewMember,
  HatcheryInformation,
  MonitoringProgram,
} from '../../../utils/interfaces'
import { groupArrayItems } from '../../../utils/utils'
import { Text, HStack, VStack, Divider } from 'native-base'
import { DataTable } from 'react-native-paper'
import { TabPanelWrapper } from './MonitoringInfoTabs'
import React from 'react'
import TablePagination from '../../Shared/TablePagination'
import useTablePagination from '../../../utils/useTablePagination'
export const BasicInfoTabPanel = ({
  monitoringProgramInfo,
}: {
  monitoringProgramInfo: MonitoringProgram | null
}) => {
  const groupedCrewMembers = groupArrayItems(
    monitoringProgramInfo?.crewMembers || [],
    4
  ) as CrewMember[][]

  const { streamName, programName } = monitoringProgramInfo || {}
  //Placeholder hatchery data
  const hatcheryData: HatcheryInformation[] = [
    {
      id: 1,
      hatcheryName: 'Hatchery A',
      streamName: 'Stream A',
      agreementId: 'AG123',
      programId: 101,
      agreementStartDate: new Date('2022-01-01'),
      agreementEndDate: new Date('2023-01-01'),
      renewalDate: new Date('2023-01-01'),
      frequencyOfFishCollection: 12,
      quantityOfFish: 1000,
      hatcheryFileLink: 'http://example.com/hatcheryA',
    },
    {
      id: 2,
      hatcheryName: 'Hatchery B',
      streamName: 'Stream B',
      agreementId: 'AG124',
      programId: 102,
      agreementStartDate: new Date('2022-02-01'),
      agreementEndDate: new Date('2023-02-01'),
      renewalDate: new Date('2023-02-01'),
      frequencyOfFishCollection: 10,
      quantityOfFish: 1500,
      hatcheryFileLink: 'http://example.com/hatcheryB',
    },
    {
      id: 3,
      hatcheryName: 'Hatchery C',
      streamName: 'Stream C',
      agreementId: 'AG125',
      programId: 103,
      agreementStartDate: new Date('2022-03-01'),
      agreementEndDate: new Date('2023-03-01'),
      renewalDate: new Date('2023-03-01'),
      frequencyOfFishCollection: 8,
      quantityOfFish: 2000,
      hatcheryFileLink: 'http://example.com/hatcheryC',
    },
    {
      id: 4,
      hatcheryName: 'Hatchery D',
      streamName: 'Stream D',
      agreementId: 'AG126',
      programId: 104,
      agreementStartDate: new Date('2022-04-01'),
      agreementEndDate: new Date('2023-04-01'),
      renewalDate: new Date('2023-04-01'),
      frequencyOfFishCollection: 6,
      quantityOfFish: 2500,
      hatcheryFileLink: 'http://example.com/hatcheryD',
    },
    {
      id: 5,
      hatcheryName: 'Hatchery E',
      streamName: 'Stream E',
      agreementId: 'AG127',
      programId: 105,
      agreementStartDate: new Date('2022-05-01'),
      agreementEndDate: new Date('2023-05-01'),
      renewalDate: new Date('2023-05-01'),
      frequencyOfFishCollection: 4,
      quantityOfFish: 3000,
      hatcheryFileLink: 'http://example.com/hatcheryE',
    },
    {
      id: 6,
      hatcheryName: 'Hatchery F',
      streamName: 'Stream F',
      agreementId: 'AG128',
      programId: 106,
      agreementStartDate: new Date('2022-06-01'),
      agreementEndDate: new Date('2023-06-01'),
      renewalDate: new Date('2023-06-01'),
      frequencyOfFishCollection: 2,
      quantityOfFish: 3500,
      hatcheryFileLink: 'http://example.com/hatcheryF',
    },
    {
      id: 7,
      hatcheryName: 'Hatchery G',
      streamName: 'Stream G',
      agreementId: 'AG129',
      programId: 107,
      agreementStartDate: new Date('2022-07-01'),
      agreementEndDate: new Date('2023-07-01'),
      renewalDate: new Date('2023-07-01'),
      frequencyOfFishCollection: 1,
      quantityOfFish: 4000,
      hatcheryFileLink: 'http://example.com/hatcheryG',
    },
    {
      id: 8,
      hatcheryName: 'Hatchery H',
      streamName: 'Stream H',
      agreementId: 'AG130',
      programId: 108,
      agreementStartDate: new Date('2022-08-01'),
      agreementEndDate: new Date('2023-08-01'),
      renewalDate: new Date('2023-08-01'),
      frequencyOfFishCollection: 3,
      quantityOfFish: 4500,
      hatcheryFileLink: 'http://example.com/hatcheryH',
    },
  ]

  const { page, itemsPerPage, from, to, onPageChange } = useTablePagination(
    hatcheryData,
    { itemsPerPage: 6 }
  )

  return (
    <TabPanelWrapper>
      <ScrollView>
        <Text fontSize='lg' fontWeight={500}>
          Stream Name: <Text fontWeight={300}>{streamName}</Text>
        </Text>
        <Text fontSize='lg' fontWeight={500}>
          Program Name: <Text fontWeight={300}>{programName}</Text>
        </Text>
        <VStack alignItems='flex-start' space={2} mt={5}>
          <Text fontSize='lg' fontWeight={500}>
            Crew Members:
          </Text>
          <HStack space={5}>
            {groupedCrewMembers?.map((crewMembers, index) => {
              const lastItem = groupedCrewMembers.at(-1) as CrewMember[]

              return (
                <React.Fragment>
                  <VStack key={index}>
                    {crewMembers.map(({ id, firstName, lastName, role }) => (
                      <Text
                        key={id}
                        fontSize='lg'
                        fontWeight={300}
                      >{`${firstName} ${lastName} ${
                        role === 'lead' ? '(Lead)' : ''
                      }`}</Text>
                    ))}
                  </VStack>
                  {index !== groupedCrewMembers.indexOf(lastItem) && (
                    <Divider orientation='vertical' />
                  )}
                </React.Fragment>
              )
            })}
          </HStack>
        </VStack>
        <Text fontSize='lg' fontWeight={500} mt={5}>
          Funding Agency:{' '}
          {/* <Text fontWeight={300}>{monitoringProgramInfo?.agencyDescription} (monitoringProgramInfo.agencyDefinition)</Text> */}
          <Text fontWeight={300}>California Data Exchange Center (CDEC)</Text>
        </Text>
        <DataTable>
          <Text fontSize='lg' fontWeight={500} mt={5}>
            Hatchery Information:
          </Text>
          <DataTable.Header>
            <DataTable.Title>
              <Text>Hatchery Name</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text>Stream Name</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text>Renewal Date</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text>Frequency</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text>Quantity</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text>File Link</Text>
            </DataTable.Title>
          </DataTable.Header>
          {hatcheryData
            .slice(from, to)
            .map(
              ({
                id,
                hatcheryName,
                streamName,
                renewalDate,
                frequencyOfFishCollection,
                quantityOfFish,
                hatcheryFileLink,
              }: HatcheryInformation) => (
                <DataTable.Row key={id}>
                  <DataTable.Cell>
                    <Text>{hatcheryName}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{streamName}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{renewalDate?.toLocaleDateString()}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{frequencyOfFishCollection}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{quantityOfFish}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{hatcheryFileLink}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              )
            )}

          <TablePagination
            items={hatcheryData}
            page={page}
            itemsPerPage={itemsPerPage}
            from={from}
            to={to}
            onPageChange={onPageChange}
          />
        </DataTable>
      </ScrollView>
    </TabPanelWrapper>
  )
}

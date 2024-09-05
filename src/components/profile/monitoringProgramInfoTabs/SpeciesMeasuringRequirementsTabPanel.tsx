import { DataTable } from 'react-native-paper'
import {
  FishMeasureProtocol,
  MonitoringProgram,
} from '../../../utils/interfaces'
import { TabPanelWrapper } from './MonitoringInfoTabs'
import useTablePagination from '../../../utils/useTablePagination'
import TablePagination from '../../Shared/TablePagination'
import { Text } from 'native-base'

const placeholderFishMeasureProtocol: FishMeasureProtocol[] = [
  {
    commonname: 'Salmon',
    id: 1,
    lifeStage: 2,
    lifeStageName: 'Adult',
    numberMeasured: 150,
    programId: 101,
    run: 1,
    runName: 'Spring Run',
    species: 'Oncorhynchus tshawytscha',
  },
  {
    commonname: 'Trout',
    id: 2,
    lifeStage: 1,
    lifeStageName: 'Juvenile',
    numberMeasured: 200,
    programId: 102,
    run: 2,
    runName: 'Fall Run',
    species: 'Oncorhynchus mykiss',
  },
  {
    commonname: 'Bass',
    id: 3,
    lifeStage: 0,
    lifeStageName: 'Fry',
    numberMeasured: 300,
    programId: 103,
    run: 3,
    runName: 'Summer Run',
    species: 'Micropterus salmoides',
  },
  {
    commonname: 'Catfish',
    id: 4,
    lifeStage: 2,
    lifeStageName: 'Adult',
    numberMeasured: 120,
    programId: 104,
    run: 4,
    runName: 'Winter Run',
    species: 'Ictalurus punctatus',
  },
  {
    commonname: 'Pike',
    id: 5,
    lifeStage: 1,
    lifeStageName: 'Juvenile',
    numberMeasured: 180,
    programId: 105,
    run: 1,
    runName: 'Spring Run',
    species: 'Esox lucius',
  },
  {
    commonname: 'Perch',
    id: 6,
    lifeStage: 0,
    lifeStageName: 'Fry',
    numberMeasured: 250,
    programId: 106,
    run: 2,
    runName: 'Fall Run',
    species: 'Perca flavescens',
  },
]

export const SpeciesMeasuringRequirementsTabPanel = ({
  monitoringProgramInfo,
}: {
  monitoringProgramInfo: MonitoringProgram | null
}) => {
  const { fishMeasureProtocol } = monitoringProgramInfo || {
    fishMeasureProtocol: [],
  }

  const showPlaceholderData = fishMeasureProtocol.length === 0

  const { page, itemsPerPage, from, to, onPageChange } = useTablePagination(
    showPlaceholderData ? placeholderFishMeasureProtocol : fishMeasureProtocol,
    { itemsPerPage: 10 }
  )
  return (
    <TabPanelWrapper>
      <Text fontSize='xl' mb={2}>
        Fish Measurement Protocol Data
      </Text>
      <Text textAlign='justify' mb={5}>
        The following table presents detailed information on fish measurement
        protocols, including species, life stages, and measurement counts. Each
        entry in the table corresponds to a specific fish species, identified by
        both its common and scientific names. The table also records the life
        stage and migration run of the fish, along with the program under which
        the measurements were conducted. The data includes the total number of
        fish measured, where available. This information is essential for
        understanding the distribution and characteristics of various fish
        species at different stages of their life cycle.
      </Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Species</DataTable.Title>
          <DataTable.Title>Run Name</DataTable.Title>
          <DataTable.Title>Life Stage</DataTable.Title>
          <DataTable.Title>Number Measured</DataTable.Title>
        </DataTable.Header>
        {(showPlaceholderData
          ? placeholderFishMeasureProtocol
          : fishMeasureProtocol
        )
          .slice(from, to)
          .map(
            ({ commonname, runName, lifeStageName, numberMeasured }, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{commonname}</DataTable.Cell>
                <DataTable.Cell>{runName}</DataTable.Cell>
                <DataTable.Cell>{lifeStageName}</DataTable.Cell>
                <DataTable.Cell>{numberMeasured || 0}</DataTable.Cell>
              </DataTable.Row>
            )
          )}
        <TablePagination
          items={
            showPlaceholderData
              ? placeholderFishMeasureProtocol
              : fishMeasureProtocol
          }
          page={page}
          itemsPerPage={itemsPerPage}
          from={from}
          to={to}
          onPageChange={onPageChange}
        />
      </DataTable>
    </TabPanelWrapper>
  )
}

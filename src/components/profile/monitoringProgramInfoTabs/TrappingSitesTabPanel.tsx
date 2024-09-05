import { Image, ScrollView, Text, VStack } from 'native-base'
import { DataTable } from 'react-native-paper'
import { MonitoringProgram } from '../../../utils/interfaces'
import useTablePagination from '../../../utils/useTablePagination'
import { TabPanelWrapper } from './MonitoringInfoTabs'

export const TrappingSitesTabPanel = ({
  monitoringProgramInfo,
}: {
  monitoringProgramInfo: MonitoringProgram | null
}) => {
  const { trappingSites } = monitoringProgramInfo || { trappingSites: [] }

  const { page, itemsPerPage, from, to, onPageChange } = useTablePagination(
    trappingSites,
    { itemsPerPage: 5 }
  )
  return (
    <TabPanelWrapper>
      <ScrollView>
        <Image
          source={{
            uri: 'https://www.maptive.com/wp-content/uploads/2020/11/sales-use-case-mapping-software-e1600453645467.jpg',
          }}
          alt={'default trap image'}
          height={300}
        />
        <VStack space={3} marginTop={5}>
          <Text fontSize='lg' fontWeight={500}>
            Trap Sites:
          </Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>
                <Text>Site Name</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text>Trap Name</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text>Gage Number</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text>X Coord</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text>Y Coord</Text>
              </DataTable.Title>
            </DataTable.Header>
            {trappingSites
              .slice(from, to)
              ?.map(
                ({ id, siteName, trapName, gageNumber, xCoord, yCoord }) => (
                  <DataTable.Row key={id}>
                    <DataTable.Cell>
                      <Text>{siteName}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text>{trapName}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text>{gageNumber}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text>{xCoord}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text>{yCoord}</Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                )
              )}
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(trappingSites?.length / itemsPerPage)}
              onPageChange={page => onPageChange(page)}
              label={`${from + 1}-${to} of ${trappingSites?.length}`}
              showFastPaginationControls
              numberOfItemsPerPage={itemsPerPage}
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </VStack>
      </ScrollView>
    </TabPanelWrapper>
  )
}

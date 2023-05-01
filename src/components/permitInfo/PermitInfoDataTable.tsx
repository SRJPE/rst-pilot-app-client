import React from 'react'
import { DataTable } from 'react-native-paper'
import { Text, Box } from 'native-base'
import { startCase } from 'lodash'
import { StyleSheet } from 'react-native'

interface Permit {
  id: number
  category: string
  title: string
  lifeStage: string
  remainingTake: number
  remainingMortality: number
}

//{ data }: { data: Permit[] }
export default function PermitInfoDataTable({
  header,
  permits,
}: {
  header: string
  permits: Permit[]
}) {
  return (
    <>
      <Box my={2}>
        <Text fontSize='xl'>{header}</Text>
      </Box>
      <DataTable>
        <DataTable.Header style={styles.header}>
          <DataTable.Title>Category</DataTable.Title>
          <DataTable.Title>Title</DataTable.Title>
          <DataTable.Title>Life Stage</DataTable.Title>
          <DataTable.Title numeric>Remaining Take</DataTable.Title>
          <DataTable.Title numeric>Remaining Mortality</DataTable.Title>
        </DataTable.Header>
        {permits.map(
          ({
            id,
            category,
            title,
            lifeStage,
            remainingTake,
            remainingMortality,
          }) => (
            <DataTable.Row key={id}>
              <DataTable.Cell>{startCase(category)}</DataTable.Cell>
              <DataTable.Cell>{startCase(title)}</DataTable.Cell>
              <DataTable.Cell>{startCase(lifeStage)}</DataTable.Cell>
              <DataTable.Cell numeric>{remainingTake}</DataTable.Cell>
              <DataTable.Cell
                numeric
                style={{
                  backgroundColor: remainingMortality < 5 ? 'pink' : 'initial',
                }}
              >
                {remainingMortality}
              </DataTable.Cell>
            </DataTable.Row>
          )
        )}
        <DataTable.Pagination
          page={1}
          numberOfPages={3}
          onPageChange={page => {
            console.log(page)
          }}
          label='1-2 of 6'
        />
      </DataTable>
    </>
  )
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#dedcdc' },
})

import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/store'

const BatchCountDataTable = ({
  forkLengthsStore,
  forkLengthsStoreTest,
  handleShowTableModal,
}: {
  forkLengthsStore: any
  forkLengthsStoreTest: any
  handleShowTableModal: any
}) => {
  const [page, setPage] = useState<number>(0)
  const numberOfItemsPerPage = 4
  const [processedData, setProcessedData] = useState(
    [] as { forkLength: number; count: number }[]
  )

  useEffect(() => {
    prepareDataForTable()
  }, [forkLengthsStoreTest])

  const prepareDataForTable = () => {
    const TEST = prepareStorageObject()
    const storageArray: { forkLength: number; count: number }[] = []
    Object.keys(TEST).forEach((key: any) => {
      storageArray.push({
        forkLength: Number(key),
        count: forkLengthsStore[key],
      })
    })
    setProcessedData(sortByForkLength(storageArray))
  }
  const prepareStorageObject = () => {
    const storageObject: any = {}
    forkLengthsStoreTest &&
      Object.values(forkLengthsStoreTest).forEach((value: any) => {
        // console.log('🚀 ~ prepareDataForGraphTEST Object.keys ~ key', value)
        // console.log(
        //   '🚀 ~ prepareDataForGraphTEST Object.keys ~ key FL',
        //   value.forkLength
        // )
        storageObject[value.forkLength] === undefined
          ? (storageObject[value.forkLength] = 1)
          : storageObject[value.forkLength]++

        // storageArray.push({
        //   forkLength: Number(key),
        //   count: forkLengthsStoreTest[key],
        // })
      })
    // setProcessedDataTEST(storageArray)
    return storageObject
  }

  const sortByForkLength = (data: { forkLength: number; count: number }[]) => {
    return data.sort((a, b) => a.forkLength - b.forkLength)
  }

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title numeric>Fork Length (mm)</DataTable.Title>
        <DataTable.Title numeric>Count</DataTable.Title>
      </DataTable.Header>
      {processedData.map((forkLengthObject: any, idx: number) => {
        return (
          <DataTable.Row
            key={idx}
            onPress={() => handleShowTableModal(forkLengthObject)}
          >
            <DataTable.Cell numeric>
              {forkLengthObject.forkLength}
            </DataTable.Cell>
            <DataTable.Cell numeric>{forkLengthObject.count}</DataTable.Cell>
          </DataTable.Row>
        )
      })}

      <DataTable.Pagination
        page={page}
        onPageChange={(page: number) => setPage(page)}
        numberOfPages={Math.ceil(
          forkLengthsStore.length / numberOfItemsPerPage
        )}
        label={`Page ${page + 1} of ${forkLengthsStore.length || 1}`}
        numberOfItemsPerPage={numberOfItemsPerPage}
        showFastPaginationControls
      />
    </DataTable>
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    forkLengthsStore: state.fishInput.batchCharacteristics.forkLengths,
    forkLengthsStoreTest: state.fishInput.batchCharacteristics.forkLengthsTest,
  }
}

export default connect(mapStateToProps)(BatchCountDataTable)

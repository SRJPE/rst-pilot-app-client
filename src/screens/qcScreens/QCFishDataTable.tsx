import React from 'react'
import { DataTable } from 'react-native-paper'
import { pick, cloneDeep } from 'lodash'
import { Row, IconButton, Icon, Text, VStack, View } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import CustomModal from '../../components/Shared/CustomModal'
import QCFishModalContent from './QCFishModalContent'
import { generatePaginationRecordsLabel } from '../../utils/helpers/helperFunctions'

const headers = [
  'Species',
  'Count',
  'Fork Len.',
  'Run',
  'Weight',
  'Life Stage',
  'Clipped',
  'Marks',
  'Dead',
  'Recapture',
  '',
]

const sortedDataByHeaders = [
  'species',
  'numFishCaught',
  'forkLength',
  'run',
  'weight',
  'lifeStage',
  'adiposeClipped',
  'existingMarks',
  'dead',
  'willBeUsedInRecapture',
]

const emptyTableData = {
  species: '---',
  numFishCaught: '---',
  forkLength: '---',
  run: '---',
  weight: '---',
  lifeStage: '---',
  adiposeClipped: '---',
  existingMarks: '---',
  dead: '---',
  willBeUsedInRecapture: '---',
}

const QCFishDataTable = ({
  tableData,
  taxonState,
  runState,
  lifeStageState,
  userCredentialsStore,
}: {
  tableData: any
  taxonState: any
  runState: any
  lifeStageState: any
  userCredentialsStore: any
  markTypeState: any
  markColorState: any
  markPositionState: any
  navigation: any
}) => {
  const numberOfItemsPerPage = 10
  const [page, setPage] = React.useState(0)
  const [pageRows, setPageRows] = React.useState({})
  const [qcModalOpen, setQcModalOpen] = React.useState(false)
  const [qcFishData, setQCFishData] = React.useState({})

  React.useEffect(() => {
    const pageRows = generateRowsForPage()
    setPageRows(pageRows)
  }, [tableData])

  React.useEffect(() => {
    const pageRows = generateRowsForPage()
    setPageRows(pageRows)
  }, [page])

  const generateRowsForPage = () => {
    const pageRowsIndexes = Object.keys(tableData).slice(
      page * numberOfItemsPerPage,
      page * numberOfItemsPerPage + numberOfItemsPerPage
    )
    const pageRowsSliced: any = {}
    pageRowsIndexes.forEach(idx => {
      pageRowsSliced[Number(idx)] = tableData[Number(idx)]
    })

    let sortedPageRows = sortPageRows(pageRowsSliced)
    let paddedPageRows = addEmptyRows(sortedPageRows)
    return paddedPageRows
  }

  const renderCell = (obj: any, key: any) => {
    if (`${obj[key]}` === 'null') {
      return '---'
    }
    if (`${obj[key]}` === 'not recorded') {
      return 'NR'
    }
    if (`${obj[key]}`) {
      if (typeof obj[key] === 'string' || typeof obj[key] === 'boolean') {
        return `${`${obj[key]}`.charAt(0).toUpperCase()}${`${obj[key]}`.slice(
          1
        )}`
      }
      return `${obj[key]}`
    } else {
      return '---'
    }
  }

  const sortPageRows = (obj: any) => {
    let sortedRows: any = {}

    const keys = Object.keys(obj)
    keys.forEach(key => {
      let dataObj: any = cloneDeep(obj[Number(key)])
      dataObj = dataObj.createdCatchRawResponse
      const taxonCode = dataObj.taxonCode
      let species = taxonState.filter((obj: any) => {
        return obj.code === taxonCode
      })
      let speciesCommonName = species[0]?.commonname
      dataObj.species = speciesCommonName

      dataObj.existingMarks = dataObj.createdExistingMarks?.length || null

      dataObj.lifeStage = lifeStageState.find(
        (stage: any) => stage.id === dataObj.lifeStage
      )?.definition

      dataObj.run = runState.find(
        (run: any) => run.id === dataObj.captureRunClass
      )?.definition

      delete dataObj.UID
      delete dataObj.fishConditions
      delete dataObj.comments

      dataObj = pick(dataObj, sortedDataByHeaders)
      let dataObjPadded = { ...emptyTableData, ...dataObj }

      const dataObjKeys = Object.keys(dataObjPadded)
      dataObjKeys.forEach(dataObjKey => {
        if (dataObjPadded[dataObjKey] === '') {
          dataObjPadded[dataObjKey] = '---'
        }
      })
      sortedRows[Number(key)] = dataObjPadded
    })
    return sortedRows
  }

  const addEmptyRows = (obj: any) => {
    let objCopy = cloneDeep(obj)
    let keys = Object.keys(objCopy)
    for (let i = keys.length; i < numberOfItemsPerPage; i++) {
      let id = `empty-#${i}`
      objCopy[id] = emptyTableData
    }

    return objCopy
  }

  const closeQcModal = () => {
    setQcModalOpen(false)
  }

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          {headers.map((header: string, idx: number) => (
            <DataTable.Title
              key={`${header}-${idx}`}
              style={{
                flex: header === 'Species' ? 2 : 1,
              }}
            >
              {header}
            </DataTable.Title>
          ))}
        </DataTable.Header>

        {Object.keys(pageRows).map((rowKey, idx: number) => {
          return (
            <Row key={`${rowKey}-${idx}`}>
              <DataTable.Row key={`${rowKey}-${idx}`} style={{ flex: 1 }}>
                {Object.keys(pageRows[rowKey as keyof typeof pageRows])
                  .sort(
                    (a, b) =>
                      sortedDataByHeaders.indexOf(a) -
                      sortedDataByHeaders.indexOf(b)
                  )
                  .map((objKey: string | number, itemIdx: number) => {
                    if (
                      objKey !== 'plusCountMethod' &&
                      objKey !== 'plusCount'
                    ) {
                      return (
                        <DataTable.Cell
                          key={`${objKey}-${itemIdx}`}
                          style={{ flex: objKey === 'species' ? 2 : 1 }}
                        >
                          {renderCell(
                            pageRows[rowKey as keyof typeof pageRows],
                            objKey
                          )}
                        </DataTable.Cell>
                      )
                    }
                  })}
              </DataTable.Row>
              <IconButton
                marginY={3}
                variant='solid'
                bg='primary'
                colorScheme='primary'
                size='sm'
                isDisabled={rowKey.includes('empty')}
                onPress={() => {
                  if (!rowKey.includes('empty')) {
                    if (tableData[Number(rowKey)]) {
                      setQcModalOpen(true)
                      setQCFishData(tableData[Number(rowKey)])
                    }
                  }
                }}
              >
                <Icon as={Entypo} size='5' name='edit' color='warmGray.50' />
              </IconButton>
            </Row>
          )
        })}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(tableData.length / numberOfItemsPerPage)}
          label={generatePaginationRecordsLabel(
            page + 1,
            numberOfItemsPerPage,
            tableData.length
          )}
          onPageChange={(page: number) => setPage(page)}
          numberOfItemsPerPage={numberOfItemsPerPage}
        />
        <VStack px='4' mb={3}>
          <Text>NR: Not Recorded</Text>
          <Text>---: Null</Text>
        </VStack>
      </DataTable>
      {qcModalOpen && (
        <CustomModal
          isOpen={qcModalOpen}
          closeModal={closeQcModal}
          height='full'
        >
          <QCFishModalContent
            closeModal={closeQcModal}
            qcFishData={qcFishData}
            userCredentialsStore={userCredentialsStore}
          />
        </CustomModal>
      )}
    </View>
  )
}

export default QCFishDataTable

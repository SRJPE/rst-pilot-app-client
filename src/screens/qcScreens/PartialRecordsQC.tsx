import { MaterialIcons } from '@expo/vector-icons'
import {
  Button,
  HStack,
  View,
  VStack,
  Text,
  Pressable,
  Icon,
  ScrollView,
} from 'native-base'
import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import { RootState } from '../../redux/store'

function PartialRecordsQC({
  navigation,
  route,
  qcCatchRawSubmissions,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any
}) {
  const [tableData, setTableData] = useState<any[]>([])

  useEffect(() => {
    const previousCatchRaw = route.params.previousCatchRaw
    const qcData = [...qcCatchRawSubmissions, ...previousCatchRaw]
    const formattedData: any = {}
    const tableDataPayload: any[] = []
    const omittedPartialRecordKeys = [
      'id',
      'programId',
      'trapVisitId',
      'captureRunClass',
      'captureRunClassMethod',
      'comments',
      'createdAt',
      'createdBy',
      'programId',
      'qcComments',
      'qcCompleted',
      'qcCompletedBy',
      'qcTime',
      'releaseId',
      'updatedAt',
      'qcCompleted',
      'qcCompletedBy',
      'qcTime',
      'markedForRelease',
    ]

    qcData.forEach((catchResponse) => {
      const catchRaw = catchResponse.createdCatchRawResponse
      const catchRawKeys = Object.keys(catchRaw)

      catchRawKeys.forEach((key) => {
        if (!omittedPartialRecordKeys.includes(key)) {
          if (Object.keys(formattedData).includes(key)) {
            if (catchRaw[key] != null) {
              formattedData[key] += 1
            }
          } else {
            formattedData[key] = 0
          }
        }
      })
    })

    Object.keys(formattedData).forEach((key) => {
      tableDataPayload.push({
        variableName: key,
        percentNotRecorded: (formattedData[key] / qcData.length) * 100,
      })
    })

    setTableData(tableDataPayload)
  }, [qcCatchRawSubmissions])

  const AddCommentButton = ({ name }: { name: string }) => {
    return (
      <Pressable
        alignSelf='flex-end'
        onPress={() => {
          console.log(`add comment for ${name} pressed`)
        }}
      >
        <Icon as={MaterialIcons} name={'add-circle'} size='8' color='primary' />
      </Pressable>
    )
  }

  return (
    <>
      <View
        flex={1}
        bg='#fff'
        px='5%'
        py='3%'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack alignItems={'center'} flex={1}>
          <CustomModalHeader
            headerText={'QC Partial Records'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            The chart below shows the % not recorded for each variable. To edit
            or add a comment click on a variable.
          </Text>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Variable</DataTable.Title>
              <DataTable.Title numeric>Percent Not Recorded</DataTable.Title>
              <DataTable.Title numeric>Comments</DataTable.Title>
            </DataTable.Header>

            <ScrollView>
              {tableData.map((rowData) => {
                return (
                  <DataTable.Row key={rowData.variableName}>
                    <DataTable.Cell>
                      {`${rowData.variableName}`
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, function (str) {
                          return str.toUpperCase()
                        })}
                    </DataTable.Cell>
                    <DataTable.Cell
                      numeric
                    >{`${rowData.percentNotRecorded}%`}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <AddCommentButton name={rowData.variableName} />
                    </DataTable.Cell>
                  </DataTable.Row>
                )
              })}
            </ScrollView>
          </DataTable>

          <View flex={1}></View>

          <HStack width={'full'} justifyContent={'space-between'}>
            <Button
              marginBottom={5}
              width='49%'
              height='20'
              shadow='5'
              bg='secondary'
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Text fontSize='xl' color='primary' fontWeight={'bold'}>
                Back
              </Text>
            </Button>
            <Button
              marginBottom={5}
              width='49%'
              height='20'
              shadow='5'
              bg='primary'
              onPress={() => {
                console.log('approve')
              }}
            >
              <Text fontSize='xl' color='white' fontWeight={'bold'}>
                Approve
              </Text>
            </Button>
          </HStack>
        </VStack>
      </View>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
  }
}

export default connect(mapStateToProps)(PartialRecordsQC)

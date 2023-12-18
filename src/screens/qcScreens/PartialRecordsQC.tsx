import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import {
  Button,
  HStack,
  View,
  VStack,
  Text,
  Pressable,
  Icon,
  ScrollView,
  Heading,
  Divider,
  Input,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect, useDispatch } from 'react-redux'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { RootState } from '../../redux/store'
import DateTimePicker from '@react-native-community/datetimepicker'

interface NestedModalFieldDataI {
  catchRawId: number
  fieldName: string
  fieldValue: any
  modalHeader: string
  modalText: any
  modalInput: any
}

function PartialRecordsQC({
  navigation,
  route,
  qcCatchRawSubmissions,
  releaseSites,
  programs,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any
  releaseSites: any[]
  programs: any[]
}) {
  const [qcData, setQCData] = useState<any[]>([])
  const [percentNotRecordedData, setPercentNotRecorded] = useState<any[]>([])
  const [rowsNotRecordedData, setRowsNotRecorded] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nestedModalField, setNestedModalField] =
    useState<NestedModalFieldDataI | null>(null)
  const [nestedModalValue, setNestedModalValue] = useState<any>('')

  useEffect(() => {
    const previousCatchRaw = route.params.previousCatchRaw
    const qcData = [...qcCatchRawSubmissions, ...previousCatchRaw]
    const formattedData: any = {}
    const percentNotRecordedPayload: any[] = []
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
      'isRandom',
      'plusCount',
      'plusCountMethodology',
    ]

    qcData.forEach((catchResponse) => {
      const catchRaw = catchResponse.createdCatchRawResponse
      const catchRawKeys = Object.keys(catchRaw)

      catchRawKeys.forEach((key) => {
        if (!omittedPartialRecordKeys.includes(key)) {
          if (
            Object.keys(formattedData).includes(key) &&
            catchRaw[key] != null
          ) {
            formattedData[key] += 1
          } else if (
            !Object.keys(formattedData).includes(key) &&
            catchRaw[key] != null
          ) {
            formattedData[key] = 1
          } else if (
            !Object.keys(formattedData).includes(key) &&
            catchRaw[key] == null
          ) {
            formattedData[key] = 0
          }
        }
      })
    })

    Object.keys(formattedData).forEach((key) => {
      percentNotRecordedPayload.push({
        variableName: key,
        percentNotRecorded: Math.round(
          (formattedData[key] / qcData.length) * 100
        ),
      })
    })

    setQCData(qcData)
    setPercentNotRecorded(percentNotRecordedPayload)
  }, [qcCatchRawSubmissions])

  const handleVariableClick = (variableName: string) => {
    let rowsNotRecorded = qcData.filter(({ createdCatchRawResponse }) => {
      return createdCatchRawResponse[variableName] === null
    })
    setRowsNotRecorded(rowsNotRecorded)
  }

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

  const handleOpenNestedModal = (field: NestedModalFieldDataI) => {
    setNestedModalField(field)
  }

  const handleSaveNestedModal = () => {
    console.log('nestedModalValue: ', nestedModalValue)
  }

  const handleCloseNestedModal = () => {
    setNestedModalField(null)
  }

  const handleNestedModalSubmit = (submission: any) => {
    console.log('nested modal submit, submission: ', submission)
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
              {percentNotRecordedData.map((rowData) => {
                return (
                  <DataTable.Row
                    key={rowData.variableName}
                    onPress={() => {
                      setIsModalOpen(true)
                      handleVariableClick(rowData.variableName)
                    }}
                  >
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
      {isModalOpen ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          height='1/2'
        >
          <VStack>
            <HStack alignItems={'center'}>
              <Button onPress={() => setIsModalOpen(false)}>
                <Icon as={Ionicons} name={'close'} size='5xl' color='black' />
              </Button>

              <Heading flex={1} textAlign='center'>
                Table Viewer
              </Heading>

              <Button backgroundColor={'#007C7C'}>
                <Text color={'white'} fontWeight='extrabold' fontSize={'lg'}>
                  Save
                </Text>
              </Button>
            </HStack>

            <Divider my={2} thickness='3' />

            <ScrollView horizontal={true} width={'100%'}>
              <DataTable style={{minWidth: '100%'}}>
                <DataTable.Header>
                  <DataTable.Title style={{ justifyContent: 'center' }}>
                    date
                  </DataTable.Title>
                  <DataTable.Title style={{ justifyContent: 'center' }}>
                    run
                  </DataTable.Title>
                  <DataTable.Title style={{ justifyContent: 'center' }}>
                    fork length
                  </DataTable.Title>
                  <DataTable.Title style={{ justifyContent: 'center' }}>
                    lifestage
                  </DataTable.Title>
                  <DataTable.Title style={{ justifyContent: 'center' }}>
                    dead
                  </DataTable.Title>
                  <DataTable.Title style={{ justifyContent: 'center' }}>
                    count
                  </DataTable.Title>
                  <DataTable.Title style={{ justifyContent: 'center' }}>
                    stream
                  </DataTable.Title>
                  <DataTable.Title style={{ justifyContent: 'center' }}>
                    site
                  </DataTable.Title>
                </DataTable.Header>

                <ScrollView>
                  {rowsNotRecordedData.map(
                    ({ createdCatchRawResponse, releaseResponse }, idx) => {
                      // Nested Modal Form Values
                      const catchRawId = createdCatchRawResponse.id
                      const programId = createdCatchRawResponse.programId
                      const createdAt = createdCatchRawResponse.createdAt
                        ? new Date(
                            createdCatchRawResponse.createdAt
                          ).toLocaleDateString()
                        : 'NA'
                      const captureRunClass =
                        createdCatchRawResponse.captureRunClass ?? 'NA'
                      const forkLength =
                        createdCatchRawResponse.forkLength ?? 'NA'
                      const lifestage =
                        createdCatchRawResponse.lifestage ?? 'NA'
                      const dead = `${createdCatchRawResponse.dead ?? 'NA'}`
                      const numFishCaught =
                        createdCatchRawResponse.numFishCaught ?? 'NA'
                      const program = programs.filter(
                        (program) => programId === program.id
                      )
                      const stream = program ? program[0].streamName : 'NA'
                      let releaseSiteArr = releaseSites.filter(
                        (releaseSite) => {
                          if (releaseResponse)
                            return (
                              releaseSite.id === releaseResponse.releaseSiteId
                            )
                        }
                      )
                      const releaseSite = releaseSiteArr.length
                        ? releaseSiteArr[0].releaseSiteName
                        : 'NA'

                      return (
                        <DataTable.Row
                          key={`${createdCatchRawResponse.id}-${idx}`}
                          style={[{ height: 55, justifyContent: 'center' }]}
                        >
                          <DataTable.Cell
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'createdAt',
                                fieldValue: createdAt,
                                modalHeader: 'Date Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have this date marked as{' '}
                                    <Text fontWeight={'bold'}>{createdAt}</Text>{' '}
                                  </Text>
                                ),
                                modalInput: (
                                  <VStack alignItems={'flex-start'}>
                                    <Text>Edit Date</Text>
                                    <DateTimePicker
                                      value={new Date(createdAt)}
                                      mode='date'
                                      onChange={(event, selectedDate) =>
                                        setNestedModalValue(selectedDate)
                                      }
                                      accentColor='#007C7C'
                                    />
                                  </VStack>
                                ),
                              })
                            }
                            style={{ justifyContent: 'center' }}
                            numeric
                          >
                            {createdAt}
                          </DataTable.Cell>
                          <DataTable.Cell
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'captureRunClass',
                                fieldValue: captureRunClass,
                                modalHeader: 'Run Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have the run marked as{' '}
                                    <Text fontWeight={'bold'}>
                                      {captureRunClass}
                                    </Text>{' '}
                                  </Text>
                                ),
                                modalInput: (
                                  <VStack alignItems={'flex-start'}>
                                    <Text>Edit run</Text>
                                    <Input
                                      height='50px'
                                      width='350px'
                                      fontSize='16'
                                      placeholder='Write a comment'
                                      keyboardType='default'
                                      onChangeText={(value) =>
                                        setNestedModalValue(value)
                                      }
                                      // onBlur={handleBlur('comments')}
                                      value={captureRunClass}
                                    />
                                  </VStack>
                                ),
                              })
                            }
                            style={{ justifyContent: 'center' }}
                            numeric
                          >
                            {captureRunClass}
                          </DataTable.Cell>
                          <DataTable.Cell
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'forkLength',
                                fieldValue: forkLength,
                                modalHeader: 'Fork Length Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have the fork length marked as{' '}
                                    <Text fontWeight={'bold'}>
                                      {forkLength}
                                    </Text>{' '}
                                  </Text>
                                ),
                                modalInput: (
                                  <VStack alignItems={'flex-start'}>
                                    <Text>Edit fork length</Text>
                                    <Input
                                      height='50px'
                                      width='350px'
                                      fontSize='16'
                                      placeholder='Write a comment'
                                      keyboardType='numeric'
                                      onChangeText={(value) =>
                                        setNestedModalValue(value)
                                      }
                                      // onBlur={handleBlur('comments')}
                                      value={forkLength}
                                    />
                                  </VStack>
                                ),
                              })
                            }
                            style={{ justifyContent: 'center' }}
                            numeric
                          >
                            {forkLength}
                          </DataTable.Cell>
                          <DataTable.Cell
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'lifestage',
                                fieldValue: lifestage,
                                modalHeader: 'Life Stage Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have the lifestage marked as{' '}
                                    <Text fontWeight={'bold'}>{lifestage}</Text>{' '}
                                  </Text>
                                ),
                                modalInput: (
                                  <VStack alignItems={'flex-start'}>
                                    <Text>Edit lifestage</Text>
                                    <Input
                                      height='50px'
                                      width='350px'
                                      fontSize='16'
                                      placeholder='Write a comment'
                                      keyboardType='default'
                                      // onChangeText={(value) =>
                                      //   setNestedModalValue(value)
                                      // }
                                      // onBlur={handleBlur('comments')}
                                      value={'OUT OF SERVICE'}
                                    />
                                  </VStack>
                                ),
                              })
                            }
                            style={{ justifyContent: 'center' }}
                            numeric
                          >
                            {lifestage}
                          </DataTable.Cell>
                          <DataTable.Cell
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'dead',
                                fieldValue: dead,
                                modalHeader: 'Dead Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have this record marked as{' '}
                                    <Text fontWeight={'bold'}>
                                      {typeof dead == 'boolean'
                                        ? dead
                                          ? 'dead'
                                          : 'not dead'
                                        : 'NA'}
                                    </Text>{' '}
                                  </Text>
                                ),
                                modalInput: (
                                  <VStack alignItems={'flex-start'}>
                                    <Text>Edit dead value</Text>
                                    <Input
                                      height='50px'
                                      width='350px'
                                      fontSize='16'
                                      placeholder='Write a comment'
                                      keyboardType='default'
                                      onChangeText={(value) =>
                                        setNestedModalValue(value)
                                      }
                                      // onBlur={handleBlur('comments')}
                                      value={dead}
                                    />
                                  </VStack>
                                ),
                              })
                            }
                            style={{ justifyContent: 'center' }}
                            numeric
                          >
                            {dead}
                          </DataTable.Cell>
                          <DataTable.Cell
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'numFishCaught',
                                fieldValue: numFishCaught,
                                modalHeader: 'Fish Count Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You collected{' '}
                                    <Text fontWeight={'bold'}>
                                      {numFishCaught}
                                    </Text>{' '}
                                    fish and{' '}
                                    <Text fontWeight={'bold'}>
                                      30000 plus count
                                    </Text>{' '}
                                    fish.
                                  </Text>
                                ),
                                modalInput: (
                                  <VStack alignItems={'flex-start'}>
                                    <Text>Edit fish count value</Text>
                                    <Input
                                      height='50px'
                                      width='350px'
                                      fontSize='16'
                                      placeholder='Write a comment'
                                      keyboardType='default'
                                      onChangeText={(value) =>
                                        setNestedModalValue(value)
                                      }
                                      // onBlur={handleBlur('comments')}
                                      value={numFishCaught}
                                    />
                                  </VStack>
                                ),
                              })
                            }
                            style={{ justifyContent: 'center' }}
                            numeric
                          >
                            {numFishCaught}
                          </DataTable.Cell>
                          <DataTable.Cell
                            onPress={() => console.log('cell clicked')}
                            style={{ justifyContent: 'center' }}
                            numeric
                          >
                            {stream}
                          </DataTable.Cell>
                          <DataTable.Cell
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'releaseSite',
                                fieldValue: releaseSite,
                                modalHeader: 'Release Site Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have marked this site as{' '}
                                    <Text fontWeight={'bold'}>
                                      {releaseSite}
                                    </Text>{' '}
                                  </Text>
                                ),
                                modalInput: (
                                  <VStack alignItems={'flex-start'}>
                                    <Text>Edit Release Site</Text>
                                    <Input
                                      height='50px'
                                      width='350px'
                                      fontSize='16'
                                      placeholder='Write a comment'
                                      keyboardType='default'
                                      onChangeText={(value) =>
                                        setNestedModalValue(value)
                                      }
                                      // onBlur={handleBlur('comments')}
                                      value={'OUT OF SERVICE'}
                                    />
                                  </VStack>
                                ),
                              })
                            }
                            style={{ justifyContent: 'center' }}
                            numeric
                          >
                            {releaseSite}
                          </DataTable.Cell>
                        </DataTable.Row>
                      )
                    }
                  )}
                </ScrollView>
              </DataTable>
            </ScrollView>
          </VStack>
        </CustomModal>
      ) : (
        <></>
      )}
      {nestedModalField ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseNestedModal()}
          height='1/2'
        >
          <>
            <CustomModalHeader
              headerText={nestedModalField.modalHeader}
              headerFontSize={23}
              showHeaderButton={true}
              closeModal={() => handleCloseNestedModal()}
              headerButton={
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
                  shadow='3'
                  onPress={() => {
                    console.log('handle nested modal submit')
                    handleSaveNestedModal()
                    handleCloseNestedModal()
                  }}
                >
                  <Text fontSize='xl' color='white'>
                    Save
                  </Text>
                </Button>
              }
            />
            <VStack
              paddingX={20}
              justifyContent='center'
              justifyItems={'center'}
            >
              {nestedModalField.modalText}
              <Text color='black' fontSize='2xl' fontWeight={'light'}>
                Click button below to flag data as low confidence or edit value
                if you know true value.
              </Text>
              <HStack
                justifyContent={'space-between'}
                style={{ marginRight: 100 }}
                w='full'
              >
                <Button
                  style={{ backgroundColor: '#D1E8F0' }}
                  paddingX={10}
                  width={'3xs'}
                >
                  <HStack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    w='20'
                  >
                    <Text color={'#007C7C'}>Flag</Text>
                    <Icon
                      as={MaterialIcons}
                      name={'flag'}
                      size='10'
                      color='#FF4242'
                    />
                  </HStack>
                </Button>
                <Input
                  height='50px'
                  width='350px'
                  fontSize='16'
                  placeholder='Write a comment'
                  keyboardType='default'
                  // onChangeText={handleChange('comments')}
                  // onBlur={handleBlur('comments')}
                  value={'Flag Comment (optional)'}
                />
              </HStack>

              <View mt='50px'>{nestedModalField.modalInput}</View>
            </VStack>
          </>
        </CustomModal>
      ) : (
        <></>
      )}
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
    releaseSites: state.visitSetupDefaults.releaseSites,
    programs: state.visitSetupDefaults.programs,
  }
}

export default connect(mapStateToProps)(PartialRecordsQC)

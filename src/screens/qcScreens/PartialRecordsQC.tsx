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
  Radio,
  Box,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect, useDispatch } from 'react-redux'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import { AppDispatch, RootState } from '../../redux/store'
import DateTimePicker from '@react-native-community/datetimepicker'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  capitalizeFirstLetterOfEachWord,
  reorderTaxon,
  truncateAndTrimString,
} from '../../utils/utils'
import {
  catchRawQCSubmission,
  postQCSubmissions,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'

interface NestedModalFieldDataI {
  catchRawId: number
  fieldName: string
  fieldValue: any
  modalHeader: string
  modalText: any
}

function PartialRecordsQC({
  navigation,
  route,
  qcCatchRawSubmissions,
  previousCatchRawSubmissions,
  releaseSites,
  programs,
  taxonDropdowns,
  runDropdowns,
  lifeStageDropdowns,
  userCredentialsStore,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any[]
  previousCatchRawSubmissions: any[]
  releaseSites: any[]
  programs: any[]
  taxonDropdowns: any[]
  runDropdowns: any[]
  lifeStageDropdowns: any[]
  userCredentialsStore: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [qcData, setQCData] = useState<any[]>([])
  const [percentNotRecordedData, setPercentNotRecorded] = useState<any[]>([])
  const [rowsNotRecordedData, setRowsNotRecorded] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nestedModalField, setNestedModalField] =
    useState<NestedModalFieldDataI | null>(null)
  const [nestedModalInputValue, setNestedModalInputValue] = useState<string>('')
  const [nestedModalCommentValue, setNestedModalCommentValue] =
    useState<string>('')

  const identifierToName = {
    taxonCode: 'Species',
    captureRunClass: 'Run',
    lifeStage: 'Life Stage',
    forkLength: 'Fork Length',
    markType: 'Mark Type',
    markColor: 'Mark Color',
    markPos: 'Mark Position',
    dead: 'Mortality',
    adiposeClipped: 'Adipose Clipped',
    weight: 'Weight',
    numFishCaught: 'Plus Count',
    releaseSite: 'Release Site',
    qcComments: 'Comments',
  }

  useEffect(() => {
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter(
      (catchRaw: any) => {
        return catchRaw.createdCatchRawResponse.programId === programId
      }
    )
    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]
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

    qcData.forEach(catchResponse => {
      const catchRaw = catchResponse.createdCatchRawResponse
      const catchRawKeys = Object.keys(catchRaw)

      catchRawKeys.forEach(key => {
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

    Object.keys(formattedData).forEach(key => {
      let dynamicKey = key
      if (key === 'taxonCode') dynamicKey = 'species'
      percentNotRecordedPayload.push({
        variableName: dynamicKey,
        percentNotRecorded: Math.round(
          ((qcData.length - formattedData[key]) / qcData.length) * 100
          // ((total - num exist) / total) * 100 = percent not recorded
        ),
      })
    })

    setQCData(qcData)
    setPercentNotRecorded(percentNotRecordedPayload)
  }, [qcCatchRawSubmissions, qcCatchRawSubmissions.length])

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
    const catchRawId = nestedModalField?.catchRawId
    const fieldName = nestedModalField?.fieldName

    let submissions = []

    if (catchRawId && nestedModalInputValue) {
      let submissionOne = {
        fieldName: identifierToName[fieldName as keyof typeof identifierToName],
        value: nestedModalInputValue,
      }
      submissions.push(submissionOne)

      if (nestedModalCommentValue) {
        let submissionTwo = {
          fieldName: 'Comments',
          value: nestedModalCommentValue,
        }
        submissions.push(submissionTwo)
      }

      dispatch(
        catchRawQCSubmission({
          catchRawId,
          userId: userCredentialsStore.id,
          submissions,
        })
      )
    }
  }

  const handleCloseNestedModal = () => {
    setNestedModalField(null)
    setNestedModalInputValue('')
    setNestedModalCommentValue('')
  }

  const CustomNestedModalInput = ({
    fieldClicked,
    data,
  }: {
    fieldClicked: string
    data: any
  }) => {
    const reorderedTaxon = reorderTaxon(taxonDropdowns)

    switch (fieldClicked) {
      case 'createdAt':
        return (
          <VStack>
            <Text>Edit Date</Text>
            <Box alignSelf='flex-start' mt={5}>
              <DateTimePicker
                value={new Date()}
                mode={'date'}
                display='default'
                onChange={(event, selectedDate) => {
                  console.log('date selected: ', selectedDate?.toISOString())
                  if (selectedDate)
                    setNestedModalInputValue(selectedDate?.toISOString())
                }}
              />
            </Box>
          </VStack>
        )
      case 'taxonCode':
        return (
          <VStack>
            <Text>Edit Species</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue}
              placeholder={'Species'}
              onValueChange={(value: string) => setNestedModalInputValue(value)}
              setFieldTouched={() => console.log('species field touched')}
              selectOptions={reorderedTaxon.map((taxon: any) => ({
                label: taxon?.commonname,
                value: taxon?.code,
              }))}
            />
          </VStack>
        )
      case 'captureRunClass':
        return (
          <VStack>
            <Text>Edit Run</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue}
              placeholder={'Run'}
              onValueChange={(value: string) => setNestedModalInputValue(value)}
              setFieldTouched={() => console.log('run field touched')}
              selectOptions={runDropdowns.map((run: any) => ({
                label: run?.definition,
                value: run?.id,
              }))}
            />
          </VStack>
        )
      case 'forkLength':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Fork Length</Text>
            <Input
              height='50px'
              width='350px'
              fontSize='16'
              placeholder='fork length...'
              keyboardType='numeric'
              onChangeText={value => {
                setNestedModalInputValue(value)
              }}
              // onBlur={handleBlur('comments')}
              value={nestedModalInputValue}
            />
          </VStack>
        )
      case 'weight':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Weight</Text>
            <Input
              height='50px'
              width='350px'
              fontSize='16'
              placeholder='Weight...'
              keyboardType='numeric'
              onChangeText={value => {
                setNestedModalInputValue(value)
              }}
              // onBlur={handleBlur('comments')}
              value={nestedModalInputValue}
            />
          </VStack>
        )
      case 'lifestage':
        return (
          <VStack>
            <Text>Edit Life Stage</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue}
              placeholder={'Life Stage'}
              onValueChange={(value: string) => setNestedModalInputValue(value)}
              setFieldTouched={() => console.log('lifestage field touched')}
              selectOptions={lifeStageDropdowns.map((lifeStage: any) => ({
                label: lifeStage?.definition,
                value: lifeStage?.id,
              }))}
            />
          </VStack>
        )
      case 'dead':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Mortality</Text>
            <Radio.Group
              name='isLead'
              accessibilityLabel='is lead'
              value={nestedModalInputValue}
              onChange={(value: any) => {
                if (value === 'true') {
                  setNestedModalInputValue(value)
                } else {
                  setNestedModalInputValue(value)
                }
              }}
            >
              <Radio
                colorScheme='primary'
                value='true'
                my={1}
                _icon={{ color: 'primary' }}
              >
                True
              </Radio>
              <Radio
                colorScheme='primary'
                value='false'
                my={1}
                _icon={{ color: 'primary' }}
              >
                False
              </Radio>
            </Radio.Group>
          </VStack>
        )
      case 'numFishCaught':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Fish Count</Text>
            <Input
              height='50px'
              width='350px'
              fontSize='16'
              placeholder='fish count...'
              keyboardType='numeric'
              onChangeText={value => {
                setNestedModalInputValue(value)
              }}
              // onBlur={handleBlur('comments')}
              value={nestedModalInputValue}
            />
          </VStack>
        )
      case 'stream':
        return (
          <VStack>
            <Text>Edit Stream</Text>
            <Input
              height='50px'
              width='350px'
              fontSize='16'
              placeholder='stream...'
              keyboardType='default'
              onChangeText={value => {
                setNestedModalInputValue(value)
              }}
              // onBlur={handleBlur('comments')}
              value={nestedModalInputValue}
            />
          </VStack>
        )
      case 'releaseSite':
        return (
          <VStack>
            <Text>Edit Release Site</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue}
              placeholder={'Release Site'}
              onValueChange={(value: string) => setNestedModalInputValue(value)}
              setFieldTouched={() => console.log('release site field touched')}
              selectOptions={releaseSites.map((site: any) => ({
                label: site?.releaseSiteName,
                value: site?.id,
              }))}
            />
          </VStack>
        )
      case 'adiposeClipped':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Adipose Clipped</Text>
            <Radio.Group
              name='adiposeClipped'
              accessibilityLabel='adiposeClipped'
              value={nestedModalInputValue}
              onChange={(value: any) => {
                setNestedModalInputValue(value)
              }}
            >
              <Radio
                colorScheme='primary'
                value={'true'}
                my={1}
                _icon={{ color: 'primary' }}
              >
                True
              </Radio>
              <Radio
                colorScheme='primary'
                value='false'
                my={1}
                _icon={{ color: 'primary' }}
              >
                False
              </Radio>
            </Radio.Group>
          </VStack>
        )
    }
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
              {/* <DataTable.Title numeric>Comments</DataTable.Title> */}
            </DataTable.Header>

            <ScrollView>
              {percentNotRecordedData.map(rowData => {
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
                    {/* <DataTable.Cell numeric>
                      <AddCommentButton name={rowData.variableName} />
                    </DataTable.Cell> */}
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
                dispatch(postQCSubmissions())
              }}
            >
              <Text fontSize='xl' color='white' fontWeight={'bold'}>
                Save
              </Text>
            </Button>
          </HStack>
        </VStack>
      </View>
      {isModalOpen ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          height='5/6'
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

            <ScrollView horizontal={true}>
              <DataTable style={{ minWidth: '100%' }}>
                <DataTable.Header>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    date
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    species
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    run
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    fork length
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    weight
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    lifestage
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    adipose clipped
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    dead
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    count
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    stream
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ justifyContent: 'center', minWidth: 90 }}
                  >
                    site
                  </DataTable.Title>
                </DataTable.Header>

                <ScrollView marginBottom={100}>
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
                      const taxon = taxonDropdowns.filter(
                        taxon =>
                          createdCatchRawResponse.taxonCode === taxon.code
                      )
                      const species = taxon.length ? taxon[0]?.commonname : 'NA'
                      const adiposeClipped =
                        createdCatchRawResponse.adiposeClipped != null
                          ? createdCatchRawResponse.adiposeClipped
                          : 'NA'
                      const captureRunClass = runDropdowns.filter(
                        run =>
                          createdCatchRawResponse.captureRunClass === run.id
                      )
                      const run = captureRunClass.length
                        ? captureRunClass[0].definition
                        : 'NA'
                      const forkLength =
                        createdCatchRawResponse.forkLength ?? 'NA'
                      const weight = createdCatchRawResponse.weight ?? 'NA'
                      const lifestage =
                        createdCatchRawResponse.lifestage ?? 'NA'
                      const dead = `${createdCatchRawResponse.dead ?? 'NA'}`
                      const numFishCaught =
                        createdCatchRawResponse.numFishCaught ?? 'NA'
                      const program = programs.filter(
                        program => programId === program.id
                      )
                      const stream = program.length
                        ? program[0].streamName
                        : 'NA'
                      let releaseSiteArr = releaseSites.filter(releaseSite => {
                        if (releaseResponse)
                          return (
                            releaseSite.id === releaseResponse.releaseSiteId
                          )
                      })
                      const releaseSite = releaseSiteArr.length
                        ? releaseSiteArr[0].releaseSiteName
                        : 'NA'

                      return (
                        <DataTable.Row
                          key={`${createdCatchRawResponse.id}-${idx}`}
                          style={[{ justifyContent: 'center', width: '100%' }]}
                        >
                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            onPress={() => {
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
                              })
                            }}
                            numeric
                          >
                            {truncateAndTrimString(
                              capitalizeFirstLetterOfEachWord(createdAt),
                              10
                            )}
                          </DataTable.Cell>

                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            onPress={() => {
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'taxonCode',
                                fieldValue: species,
                                modalHeader: 'Species Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have the species marked as{' '}
                                    <Text fontWeight={'bold'}>{species}</Text>{' '}
                                  </Text>
                                ),
                              })
                            }}
                          >
                            {truncateAndTrimString(
                              capitalizeFirstLetterOfEachWord(species),
                              10
                            )}
                          </DataTable.Cell>

                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'captureRunClass',
                                fieldValue: captureRunClass.length
                                  ? captureRunClass[0].id
                                  : 'NA',
                                modalHeader: 'Run Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have the run marked as{' '}
                                    <Text fontWeight={'bold'}>{run}</Text>{' '}
                                  </Text>
                                ),
                              })
                            }
                            numeric
                          >
                            {`${truncateAndTrimString(
                              capitalizeFirstLetterOfEachWord(run),
                              9
                            )}...`}
                          </DataTable.Cell>

                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
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
                              })
                            }
                            numeric
                          >
                            {truncateAndTrimString(
                              capitalizeFirstLetterOfEachWord(forkLength),
                              10
                            )}
                          </DataTable.Cell>

                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'weight',
                                fieldValue: weight,
                                modalHeader: 'Weight Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have the weight marked as{' '}
                                    <Text fontWeight={'bold'}>{weight}</Text>{' '}
                                  </Text>
                                ),
                              })
                            }
                            numeric
                          >
                            {truncateAndTrimString(
                              capitalizeFirstLetterOfEachWord(weight),
                              10
                            )}
                          </DataTable.Cell>

                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
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
                              })
                            }
                            numeric
                          >
                            {truncateAndTrimString(
                              capitalizeFirstLetterOfEachWord(lifestage),
                              10
                            )}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'adiposeClipped',
                                fieldValue: adiposeClipped,
                                modalHeader: 'Adipose Clipped Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have the adipose clipped marked as{' '}
                                    <Text fontWeight={'bold'}>
                                      {`${adiposeClipped}`}
                                    </Text>{' '}
                                  </Text>
                                ),
                              })
                            }
                            numeric
                          >
                            {capitalizeFirstLetterOfEachWord(
                              `${adiposeClipped}`
                            )}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
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
                                    <Text fontWeight={'bold'}>{`${dead}`}</Text>{' '}
                                  </Text>
                                ),
                              })
                            }
                            numeric
                          >
                            {capitalizeFirstLetterOfEachWord(dead)}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
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
                                    fish.
                                  </Text>
                                ),
                              })
                            }
                            numeric
                          >
                            {truncateAndTrimString(
                              capitalizeFirstLetterOfEachWord(numFishCaught),
                              10
                            )}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            onPress={() =>
                              handleOpenNestedModal({
                                catchRawId,
                                fieldName: 'stream',
                                fieldValue: stream,
                                modalHeader: 'Stream Editor',
                                modalText: (
                                  <Text
                                    color='black'
                                    fontSize='2xl'
                                    mb={5}
                                    fontWeight={'light'}
                                  >
                                    You have marked this stream as{' '}
                                    <Text fontWeight={'bold'}>{stream}</Text>{' '}
                                  </Text>
                                ),
                              })
                            }
                            numeric
                          >
                            {`${truncateAndTrimString(
                              capitalizeFirstLetterOfEachWord(stream),
                              10
                            )}...`}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              minWidth: 90,
                              width: '100%',
                              justifyContent: 'center',
                            }}
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
                              })
                            }
                            numeric
                          >
                            {truncateAndTrimString(
                              capitalizeFirstLetterOfEachWord(releaseSite),
                              10
                            )}
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
          height='3/4'
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
                    setIsModalOpen(false)
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
                if you know the correct value.
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
                  // onBlur={handleBlur('comments')}
                  onChangeText={value => {
                    setNestedModalCommentValue(value)
                  }}
                  value={nestedModalCommentValue}
                />
              </HStack>

              <View mt='50px'>
                {CustomNestedModalInput({
                  fieldClicked: nestedModalField.fieldName,
                  data: nestedModalField.fieldValue,
                })}
              </View>
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
  let taxon = state.dropdowns.values.taxon
  let run = state.dropdowns.values.run
  let lifeStage = state.dropdowns.values.lifeStage

  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
    previousCatchRawSubmissions:
      state.trapVisitFormPostBundler.previousCatchRawSubmissions,
    releaseSites: state.visitSetupDefaults.releaseSites,
    programs: state.visitSetupDefaults.programs,
    taxonDropdowns: taxon ?? [],
    runDropdowns: run ?? [],
    lifeStageDropdowns: lifeStage ?? [],
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(PartialRecordsQC)

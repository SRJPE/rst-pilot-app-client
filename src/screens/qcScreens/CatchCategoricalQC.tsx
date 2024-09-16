import { useEffect, useState } from 'react'
import {
  Button,
  HStack,
  View,
  VStack,
  Text,
  ScrollView,
  Heading,
  Icon,
  Input,
  Radio,
} from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { AppDispatch, RootState } from '../../redux/store'
import { connect, useDispatch } from 'react-redux'
import CustomModal from '../../components/Shared/CustomModal'
import {
  catchRawQCSubmission,
  postQCSubmissions,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { every } from 'lodash'
import { DataTable } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  capitalizeFirstLetterOfEachWord,
  normalizeDate,
  reorderTaxon,
  truncateAndTrimString,
  handleQCChartButtonClick,
  legendColorList,
} from '../../utils/utils'
import { get, startCase } from 'lodash'
import moment from 'moment'

interface GraphDataI {
  'Adipose Clipped': any[]
  Marks: any[]
  Mortalities: any[]
}

interface NestedModalDataI {
  // [fieldClicked: string]: string
  catchRawId: number
  fieldClicked: string
  value: string
}

interface NestedModalInputValueI {
  fieldClicked: string
  value: string | number | boolean
}

const allButtons = ['Adipose Clipped', 'Species', 'Marks', 'Mortalities']

function CatchCategoricalQC({
  navigation,
  route,
  qcCatchRawSubmissions,
  previousCatchRawSubmissions,
  taxonState,
  runState,
  lifeStageState,
  markTypeState,
  markColorState,
  markPositionState,
  visitSetupDefaults,
  userCredentialsStore,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any[]
  previousCatchRawSubmissions: any[]
  taxonState: any
  runState: any
  lifeStageState: any
  markTypeState: any
  markColorState: any
  markPositionState: any
  visitSetupDefaults: any
  userCredentialsStore: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [activeButtons, setActiveButtons] = useState<
    ('Adipose Clipped' | 'Marks' | 'Mortalities')[]
  >(['Adipose Clipped'])
  const [graphData, setGraphData] = useState<GraphDataI>({
    'Adipose Clipped': [],
    Marks: [],
    Mortalities: [],
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any[] | null>(null)
  const [nestedModalData, setNestedModalData] =
    useState<NestedModalDataI | null>(null)
  const [nestedModalInputValue, setNestedModalInputValue] =
    useState<NestedModalInputValueI>({
      fieldClicked: '',
      value: '',
    })
  const [markIdToSymbolArr, setMarkIdToSymbolArr] = useState([])
  const [nestedModalComment, setNestedModalComment] = useState<string>('')

  const axisLabelDictionary = {
    'Adipose Clipped': { xLabel: 'Date', yLabel: undefined },
    Species: { xLabel: 'Date', yLabel: 'Count' },
    Marks: { xLabel: 'Date', yLabel: 'Count' },
    Mortalities: { xLabel: 'Date', yLabel: undefined },
  }

  const buttonNameToChartType = {
    'Adipose Clipped': 'true-or-false',
    Species: 'scatterplot',
    Marks: 'scatterplot',
    Mortalities: 'true-or-false',
  }

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
    qcComments: 'Comments',
  }

  const identifierToDataValueFromRecord = {
    taxonCode: 'createdCatchRawResponse.taxonCode',
    captureRunClass: 'createdCatchRawResponse.captureRunClass',
    lifeStage: 'createdCatchRawResponse.lifeStage',
    forkLength: 'createdCatchRawResponse.forkLength',
    markType: 'createdExistingMarksResponse[0].markTypeId',
    markColor: 'createdExistingMarksResponse[0].markColorId',
    markPos: 'createdExistingMarksResponse[0].markPositionId',
    dead: 'createdCatchRawResponse.dead',
    adiposeClipped: 'createdCatchRawResponse.adiposeClipped',
  }

  useEffect(() => {
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter((catchRaw) => {
      return catchRaw.createdCatchRawResponse.programId === programId
    })
    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]

    let adiposeClippedData: any[] = []
    let adiposeClippedByDate: any = {}
    let marksData: any[] = []
    let deadData: any[] = []
    let deadDataByDate: any = {}
    /// {
    //   '1715929200000' : {'true': [1,2], 'false': [3]},
    //   '1715937800000' : {'true': [4], 'false': [5,6]},
    // }

    interface MarkCombosI {
      [key: string]: any
    }

    const markCombos = {} as MarkCombosI

    qcData.forEach((catchResponse: any, idx: number) => {
      const {
        id,
        adiposeClipped,
        dead,
        numFishCaught,
        createdAt,
        qcCompleted,
      } = catchResponse.createdCatchRawResponse
      const qcNotStarted = !qcCompleted

      const createdExistingMarksResponse =
        catchResponse.createdExistingMarksResponse ?? []

      const date = new Date(createdAt)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      const dateTime = date.getTime()
      const normalizedDate = normalizeDate(new Date(createdAt))
      // const stagedForSubmission = catchResponse.stagedForSubmission

      const marks = [
        ...createdExistingMarksResponse,
        // ...createdMarkAppliedResponse,
      ].filter((mark: any) => {
        return mark.catchRawId === id
      })

      if (id) {
        if (adiposeClipped != null) {
          let adValue = adiposeClipped
          if (typeof adiposeClipped === 'string') {
            adValue = adiposeClipped === 'true' ? true : false
          }

          if (adiposeClippedByDate[normalizedDate]) {
            if (adValue === true) {
              adiposeClippedByDate[normalizedDate]['true'].push(id)
              if (qcNotStarted)
                adiposeClippedByDate[normalizedDate].colorScale = 'red'
            } else if (adValue === false) {
              adiposeClippedByDate[normalizedDate]['false'].push(id)
              if (qcNotStarted)
                adiposeClippedByDate[normalizedDate].colorScale = 'red'
            }
          } else {
            if (adValue === true) {
              adiposeClippedByDate[normalizedDate] = {
                true: [id],
                false: [],
                colorScale: qcNotStarted ? 'red' : 'grey',
              }
            } else if (adValue === false) {
              adiposeClippedByDate[normalizedDate] = {
                true: [],
                false: [id],
                colorScale: qcNotStarted ? 'red' : 'grey',
              }
            }
          }
        }

        if (marks.length) {
          marks.forEach((mark: any) => {
            const { markTypeId, markColorId, markPositionId } = mark
            const markType =
              markTypeState.filter((obj: any) => {
                return obj.id == markTypeId
              })[0]?.definition ?? 'NA'
            const markColor =
              markColorState.filter((obj: any) => {
                return obj.id == markColorId
              })[0]?.definition ?? 'NA'
            const markPosition =
              markPositionState.filter((obj: any) => {
                return obj.id == markPositionId
              })[0]?.definition ?? 'NA'
            const markIdentifier = `${markType}-${markColor}-${markPosition}`

            // if date does not exist,
            if (!markCombos[dateTime]) {
              //add to markCombos obj and set property to unique combo and count to 1
              markCombos[dateTime] = {
                [markIdentifier]: [{ catchRawId: id, ...mark }],
              } as any
            } else if (markCombos[dateTime]) {
              // if markIdentifier combo exists, increment
              if (markCombos[dateTime][markIdentifier]) {
                markCombos[dateTime][markIdentifier] = [
                  ...markCombos[dateTime][markIdentifier],
                  { catchRawId: id, ...mark },
                ]
              } else {
                // else set new markIdentifier count to
                markCombos[dateTime][markIdentifier] = [
                  { catchRawId: id, ...mark },
                ]
              }
            }
          })
        }

        if (dead != null) {
          let deadValue = dead
          if (typeof dead === 'string') {
            deadValue = dead === 'true' ? true : false
          }

          if (deadDataByDate[normalizedDate]) {
            if (deadValue === true) {
              deadDataByDate[normalizedDate]['true'].push(id)
              if (qcNotStarted)
                deadDataByDate[normalizedDate].colorScale = 'red'
            } else if (deadValue === false) {
              deadDataByDate[normalizedDate]['false'].push(id)
              if (qcNotStarted)
                deadDataByDate[normalizedDate].colorScale = 'red'
            }
          } else {
            if (deadValue === true) {
              deadDataByDate[normalizedDate] = {
                true: [id],
                false: [],
                colorScale: qcNotStarted ? 'red' : 'grey',
              }
            } else if (deadValue === false) {
              deadDataByDate[normalizedDate] = {
                true: [],
                false: [id],
                colorScale: qcNotStarted ? 'red' : 'grey',
              }
            }
          }
        }
      }
    })

    Object.keys(adiposeClippedByDate).forEach((date) => {
      if (adiposeClippedByDate[date]['true'].length) {
        adiposeClippedData.push({
          ids: adiposeClippedByDate[date]['true'],
          dataId: 'Adipose Clipped',
          x: date,
          y: 2,
          colorScale: adiposeClippedByDate[date]['colorScale'],
        })
      }
      if (adiposeClippedByDate[date]['false'].length) {
        adiposeClippedData.push({
          ids: adiposeClippedByDate[date]['false'],
          dataId: 'Adipose Clipped',
          x: date,
          y: 1,
          colorScale: adiposeClippedByDate[date]['colorScale'],
        })
      }
    })

    let markIdToColorBuilder: any = []
    let symbolCounter = 0

    Object.entries(markCombos).forEach(([dateTime, countObj], index) => {
      Object.entries(countObj as MarkCombosI).forEach(
        ([markIdentifier, itemsArray]) => {
          if (
            every(markIdToColorBuilder, (obj) => {
              return obj.name !== markIdentifier
            })
          ) {
            let usedColors = markIdToColorBuilder.map((obj: any) => {
              return obj.symbol.fill
            })

            let colorOptions = legendColorList.filter((color: any) => {
              return !usedColors.includes(color)
            })

            markIdToColorBuilder.push({
              name: markIdentifier,
              symbol: { fill: colorOptions[0] },
            })
          }

          let dotColor = markIdToColorBuilder.filter((obj: any) => {
            return obj.name === markIdentifier
          })[0].symbol.fill

          marksData.push({
            id: `${markIdentifier}_${dateTime}`,
            x: dateTime,
            y: itemsArray.length,
            colorScale: dotColor,
            itemsArray: itemsArray,
          })
          symbolCounter++
        }
      )
    })

    Object.keys(deadDataByDate).forEach((date) => {
      if (deadDataByDate[date]['true'].length) {
        deadData.push({
          ids: deadDataByDate[date]['true'],
          dataId: 'Mortalities',
          x: date,
          y: 2,
          colorScale: deadDataByDate[date]['colorScale'],
        })
      }
      if (deadDataByDate[date]['false'].length) {
        deadData.push({
          ids: deadDataByDate[date]['false'],
          dataId: 'Mortalities',
          x: date,
          y: 1,
          colorScale: deadDataByDate[date]['colorScale'],
        })
      }
    })

    setMarkIdToSymbolArr(markIdToColorBuilder)

    setGraphData({
      'Adipose Clipped': adiposeClippedData,
      Marks: marksData,
      Mortalities: deadData,
    })
  }, [qcCatchRawSubmissions])

  const handlePointClick = (datum: any) => {
    console.log('datum', datum)
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter((catchRaw) => {
      return catchRaw.createdCatchRawResponse.programId === programId
    })

    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]
    let idsAtPoint: any[] = []
    if (Object.keys(datum).includes('itemsArray')) {
      idsAtPoint = datum.itemsArray.map((item: any) => {
        if (Object.keys(item).includes('catchRawId')) {
          if (item.catchRawId) {
            return item.catchRawId
          }
        }
      })
    } else if (Object.keys(datum).includes('ids')) {
      idsAtPoint = datum.ids
    }

    const selectedData = qcData.filter((response) => {
      const id = response.createdCatchRawResponse?.id
      return idsAtPoint.includes(id)
    })

    setModalData(selectedData)
    setIsModalOpen(true)
  }

  const handleModalCellPressed = (fieldClicked: string, data: any) => {
    let catchRawId = get(data, 'createdCatchRawResponse.id')
    let rawData = get(
      data,
      identifierToDataValueFromRecord[
        fieldClicked as keyof typeof identifierToDataValueFromRecord
      ]
    )
    let parsedData = null

    switch (fieldClicked) {
      case 'taxonCode':
        parsedData = taxonState.filter((obj: any) => {
          return obj.code === rawData
        })[0]?.commonname
        break
      case 'captureRunClass':
        parsedData = runState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break
      case 'lifeStage':
        parsedData = lifeStageState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break
      case 'markType':
        parsedData = markTypeState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break
      case 'markPos':
        parsedData = markPositionState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break
      case 'markColor':
        parsedData = markColorState.filter((obj: any) => {
          return obj.id === rawData
        })[0]?.definition
        break

      default:
        break
    }

    if (rawData === undefined) {
      setNestedModalData({ catchRawId, fieldClicked, value: 'NA' })
    } else {
      if (typeof rawData === 'boolean') {
        rawData = rawData ? 'true' : 'false'
      }
      if (rawData === null) {
        rawData = 'NA'
      }
      setNestedModalData({
        catchRawId,
        fieldClicked,
        value: parsedData ? parsedData : rawData,
      })

      setNestedModalInputValue({
        fieldClicked,
        value: parsedData ? parsedData : rawData,
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalData(null)
  }

  const handleCloseNestedModal = () => {
    setNestedModalData(null)
    setNestedModalComment('')
  }

  const handleSaveNestedModal = () => {
    if (nestedModalData) {
      let catchRawId = nestedModalData.catchRawId
      let fieldName =
        identifierToName[
          nestedModalData.fieldClicked as keyof typeof identifierToName
        ]
      let submissions: any[] = []

      let submissionOne = {
        fieldName,
        value: nestedModalInputValue.value,
      }
      submissions.push(submissionOne)

      if (nestedModalComment) {
        let submissionTwo = {
          fieldName: 'comments',
          value: nestedModalComment,
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

  const GraphMenuButton = ({
    buttonName,
  }: {
    buttonName: 'Adipose Clipped' | 'Marks' | 'Mortalities'
  }) => {
    return (
      <Button
        bg={activeButtons.includes(buttonName) ? 'primary' : 'secondary'}
        marginX={0.5}
        flex={1}
        onPress={() => {
          const newActiveButtons = handleQCChartButtonClick(
            allButtons,
            activeButtons,
            buttonName
          ) as any
          setActiveButtons(newActiveButtons)
        }}
      >
        <Text
          fontSize='lg'
          color={activeButtons.includes(buttonName) ? 'secondary' : 'primary'}
          fontWeight={'bold'}
        >
          {buttonName}
        </Text>
      </Button>
    )
  }

  const CustomNestedModalInput = ({
    fieldClicked,
    data,
  }: {
    fieldClicked: string
    data: any
  }) => {
    const reorderedTaxon = reorderTaxon(taxonState)

    switch (fieldClicked) {
      case 'taxonCode':
        return (
          <VStack>
            <Text>Edit Species</Text>
            <CustomSelect
              // set selectedValue to using nestedModalInputValue.value as taxonCode to find commonname
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Species'}
              onValueChange={(value: string) => {
                const filteredTaxon = reorderedTaxon.filter(
                  (taxon: any) => taxon.code === value
                )
                const taxonCode = filteredTaxon[0]?.code

                setNestedModalInputValue({
                  fieldClicked: 'taxonCode',
                  value: taxonCode,
                })
              }}
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
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Run'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({
                  fieldClicked: 'captureRunClass',
                  value,
                })
              }
              setFieldTouched={() => console.log('run field touched')}
              selectOptions={runState.map((run: any) => ({
                label: run?.definition,
                value: run?.id,
              }))}
            />
          </VStack>
        )
      case 'lifeStage':
        return (
          <VStack>
            <Text>Edit Life Stage</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Life Stage'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'lifeStage', value })
              }
              setFieldTouched={() => console.log('lifestage field touched')}
              selectOptions={lifeStageState.map((lifeStage: any) => ({
                label: lifeStage?.definition,
                value: lifeStage?.id,
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
              onChangeText={(value) => {
                setNestedModalInputValue({ fieldClicked: 'forkLength', value })
              }}
              // onBlur={handleBlur('comments')}
              value={nestedModalInputValue.value as string}
            />
          </VStack>
        )
      case 'markType':
        return (
          <VStack>
            <Text>Edit Mark Type</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Mark Type'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'markType', value })
              }
              setFieldTouched={() => console.log('marktype field touched')}
              selectOptions={markTypeState.map((markType: any) => ({
                label: markType?.definition,
                value: markType?.id,
              }))}
            />
          </VStack>
        )
      case 'markColor':
        return (
          <VStack>
            <Text>Edit Mark Color</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Mark Type'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'markColor', value })
              }
              setFieldTouched={() => console.log('markcolor field touched')}
              selectOptions={markColorState.map((markColor: any) => ({
                label: markColor?.definition,
                value: markColor?.id,
              }))}
            />
          </VStack>
        )
      case 'markPos':
        return (
          <VStack>
            <Text>Edit Mark Position</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Mark Type'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'markPos', value })
              }
              setFieldTouched={() => console.log('markposition field touched')}
              selectOptions={markPositionState.map((markPosition: any) => ({
                label: markPosition?.definition,
                value: markPosition?.id,
              }))}
            />
          </VStack>
        )
      case 'dead':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Mortality</Text>
            <Radio.Group
              name='mortality'
              accessibilityLabel='mortality'
              value={nestedModalInputValue.value as string}
              onChange={(value: any) => {
                setNestedModalInputValue({
                  fieldClicked: 'dead',
                  value,
                })
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
      case 'adiposeClipped':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Adipose Clipped</Text>
            <Radio.Group
              name='adiposeClipped'
              accessibilityLabel='adiposeClipped'
              value={nestedModalInputValue.value as string}
              onChange={(value: any) => {
                setNestedModalInputValue({
                  fieldClicked: 'adiposeClipped',
                  value,
                })
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
            headerText={'QC Categorical Observations'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            Edit values by selecting a point on a plot below. Red points
            indicate records that have not been QC'd, while the gray points
            indicate records that have been QC'd and approved.
          </Text>

          <HStack mb={'10'}>
            <GraphMenuButton buttonName={'Adipose Clipped'} />
            <GraphMenuButton buttonName={'Marks'} />
            <GraphMenuButton buttonName={'Mortalities'} />
          </HStack>

          <ScrollView>
            {activeButtons.map((buttonName) => {
              return (
                <Graph
                  xLabel={axisLabelDictionary[buttonName]['xLabel']}
                  yLabel={axisLabelDictionary[buttonName]['yLabel']}
                  key={buttonName}
                  chartType={buttonNameToChartType[buttonName] as any}
                  showDates
                  onPointClick={(datum) => handlePointClick(datum)}
                  timeBased={false}
                  data={graphData[buttonName]}
                  title={buttonName}
                  barColor='grey'
                  selectedBarColor='green'
                  height={400}
                  width={600}
                  legendData={
                    buttonName === 'Marks' ? markIdToSymbolArr : undefined
                  }
                  legendItemsPerRow={2}
                />
              )
            })}
          </ScrollView>

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
      {modalData ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseModal()}
          height='5/6'
        >
          <>
            <CustomModalHeader
              headerText={
                'Click on a cell to flag data as low confidence or edit value'
              }
              headerStyle={{ fontSize: 23, fontWeight: '300' }}
              showHeaderButton={false}
              closeModal={() => setModalData(null)}
            />

            <Text
              color='black'
              fontSize='2xl'
              marginLeft={8}
              marginBottom={8}
              fontWeight={'light'}
            >
              {`Selected Point${modalData.length > 1 ? `s` : ''} Date: `}
              {moment(
                modalData?.[0]?.createdCatchRawResponse?.createdAt
              ).format('MMMM Do, YYYY')}
            </Text>
            <VStack alignItems={'center'}>
              <Heading fontSize={23} mb={5}>
                Table of Selected Points
              </Heading>
              <ScrollView
                horizontal
                size={'80%'}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                }}
              >
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title
                      style={{ justifyContent: 'center', minWidth: 90 }}
                    >
                      Variable
                    </DataTable.Title>
                    {modalData.map((data, idx) => (
                      <DataTable.Title
                        key={idx}
                        style={{ justifyContent: 'center', minWidth: 90 }}
                      >{`Fish ${idx + 1}`}</DataTable.Title>
                    ))}
                  </DataTable.Header>

                  <ScrollView size={'full'}>
                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Species</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        const taxonCode = data.createdCatchRawResponse.taxonCode
                        let species = taxonState.filter((obj: any) => {
                          return obj.code === taxonCode
                        })
                        let commonname = species[0]?.commonname

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`species-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('taxonCode', data)
                            }
                          >
                            <Text>
                              {species.length
                                ? `${truncateAndTrimString(
                                    capitalizeFirstLetterOfEachWord(commonname),
                                    12
                                  )}...`
                                : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Run</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let run = data.createdCatchRawResponse.captureRunClass
                        let runDefinition = runState.filter((obj: any) => {
                          return obj.id === run
                        })[0]?.definition

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`run-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('captureRunClass', data)
                            }
                          >
                            <Text>
                              {capitalizeFirstLetterOfEachWord(runDefinition) ??
                                'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Life Stage</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let lifeStageId = data.createdCatchRawResponse.lifeStage
                        let lifeStage = lifeStageState.filter((obj: any) => {
                          return obj.id === lifeStageId
                        })[0]?.definition

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`lifestage-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('lifeStage', data)
                            }
                          >
                            <Text>
                              {capitalizeFirstLetterOfEachWord(lifeStage) ??
                                'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Fork Length</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let forkLength =
                          data?.createdCatchRawResponse.forkLength

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`forklength-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('forkLength', data)
                            }
                          >
                            <Text>
                              {capitalizeFirstLetterOfEachWord(forkLength) ??
                                'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Mark Type</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let createdExistingMarksResponse =
                          data.createdExistingMarksResponse

                        let markTypeId = createdExistingMarksResponse
                          ? createdExistingMarksResponse[0].markTypeId
                          : null

                        let markType = markTypeState.filter((obj: any) => {
                          return obj.id === markTypeId
                        })

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`marktype-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('markType', data)
                            }
                          >
                            <Text>
                              {markType.length
                                ? `${truncateAndTrimString(
                                    capitalizeFirstLetterOfEachWord(
                                      markType[0]?.definition
                                    ),
                                    12
                                  )}...`
                                : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Mark Color</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        if (data.createdExistingMarksResponse) {
                          let markColorCode =
                            data?.createdExistingMarksResponse[0]?.markColorId
                          let markColor = markColorState.filter((obj: any) => {
                            return obj.id === markColorCode
                          })

                          return (
                            <DataTable.Cell
                              style={{
                                minWidth: 120,
                                minHeight: 70,
                                width: '100%',
                                justifyContent: 'center',
                              }}
                              key={`markcolor-${idx}`}
                              onPress={() =>
                                handleModalCellPressed('markColor', data)
                              }
                            >
                              <Text>
                                {markColor.length
                                  ? capitalizeFirstLetterOfEachWord(
                                      markColor[0]?.definition
                                    )
                                  : 'NA'}
                              </Text>
                            </DataTable.Cell>
                          )
                        } else {
                          return (
                            <DataTable.Cell
                              style={{
                                minWidth: 120,
                                minHeight: 70,
                                width: '100%',
                                justifyContent: 'center',
                              }}
                              key={`markcolor-${idx}`}
                              onPress={() =>
                                handleModalCellPressed('markColor', data)
                              }
                            >
                              <Text>NA</Text>
                            </DataTable.Cell>
                          )
                        }
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Mark Position</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        if (data.createdExistingMarksResponse) {
                          let markPositionCode =
                            data?.createdExistingMarksResponse[0]
                              ?.markPositionId

                          let markPosition = markPositionState.filter(
                            (obj: any) => {
                              return obj.id === markPositionCode
                            }
                          )

                          // let markTypeCode = data.createdCatchRawResponse.markType
                          // let markType = markTypeState.filter((obj: any) => {
                          //   return obj.id === markTypeCode
                          // })

                          return (
                            <DataTable.Cell
                              style={{
                                minWidth: 120,
                                minHeight: 70,
                                width: '100%',
                                justifyContent: 'center',
                              }}
                              key={`markpos-${idx}`}
                              onPress={() =>
                                handleModalCellPressed('markPos', data)
                              }
                            >
                              <Text>
                                {markPosition.length
                                  ? capitalizeFirstLetterOfEachWord(
                                      markPosition[0]?.definition
                                    )
                                  : 'NA'}
                              </Text>
                            </DataTable.Cell>
                          )
                        } else {
                          return (
                            <DataTable.Cell
                              style={{
                                minWidth: 120,
                                minHeight: 70,
                                width: '100%',
                                justifyContent: 'center',
                              }}
                              key={`markpos-${idx}`}
                              onPress={() =>
                                handleModalCellPressed('markPos', data)
                              }
                            >
                              <Text>NA</Text>
                            </DataTable.Cell>
                          )
                        }
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Adipose Clip</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let adiposeClipped: boolean =
                          data.createdCatchRawResponse.adiposeClipped

                        let adValue = adiposeClipped
                        if (typeof adiposeClipped === 'string') {
                          adValue = adiposeClipped === 'true' ? true : false
                        }

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`adipose-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('adiposeClipped', data)
                            }
                          >
                            <Text>
                              {adValue != null
                                ? adValue
                                  ? 'True'
                                  : 'False'
                                : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Mort</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let deadValue = data.createdCatchRawResponse.dead
                        if (typeof deadValue === 'string') {
                          deadValue = deadValue === 'true' ? true : false
                        }

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`mortality-${idx}`}
                            onPress={() => handleModalCellPressed('dead', data)}
                          >
                            <Text>
                              {deadValue != null
                                ? deadValue
                                  ? 'True'
                                  : 'False'
                                : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell
                        style={{
                          minWidth: 120,
                          minHeight: 70,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Text>Crew</Text>
                      </DataTable.Cell>

                      {modalData.map((data, idx) => {
                        let trapVisitId =
                          data.createdCatchRawResponse.trapVisitId

                        let crew = []
                        if (visitSetupDefaults?.trapVisitCrew) {
                          crew = visitSetupDefaults?.trapVisitCrew?.filter(
                            (obj: any) => {
                              return obj.trapVisitId === trapVisitId
                            }
                          )

                          crew = crew.map((crewObj: any) => {
                            return crewObj.personnelId
                          })
                        }

                        let selectedCrew: any = []

                        if (crew.length > 0) {
                          visitSetupDefaults.crewMembers.forEach(
                            (arr: any[]) => {
                              selectedCrew = arr.filter((crewMember: any) => {
                                return crew.includes(crewMember.personnelId)
                              })
                            }
                          )
                        }

                        return (
                          <DataTable.Cell
                            style={{
                              minWidth: 120,
                              minHeight: 70,
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            key={`crew-${idx}`}
                          >
                            {selectedCrew.length ? (
                              selectedCrew.map(
                                (crewMember: any, idx: number) => {
                                  return (
                                    <Text key={idx}>
                                      {`${crewMember.firstName} ${crewMember.lastName}`}
                                    </Text>
                                  )
                                }
                              )
                            ) : (
                              <Text>NA</Text>
                            )}
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>
                  </ScrollView>
                </DataTable>
              </ScrollView>
            </VStack>
          </>
        </CustomModal>
      ) : (
        <></>
      )}
      {nestedModalData ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseModal()}
          height='3/4'
        >
          <>
            <CustomModalHeader
              headerText={
                identifierToName[
                  nestedModalData.fieldClicked as keyof typeof identifierToName
                ]
              }
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
                    handleSaveNestedModal()
                    handleCloseNestedModal()
                    handleCloseModal()
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
              <Text color='black' fontSize='2xl' mb={5} fontWeight={'light'}>
                You have the{' '}
                {
                  identifierToName[
                    nestedModalData.fieldClicked as keyof typeof identifierToName
                  ]
                }{' '}
                marked as {`${startCase(nestedModalData.value)}`}
              </Text>
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
                  onChangeText={(value) => {
                    setNestedModalComment(value)
                  }}
                  // onBlur={handleBlur('comments')}
                  value={nestedModalComment}
                />
              </HStack>

              <View mt='50px'>
                {CustomNestedModalInput({
                  fieldClicked: nestedModalData.fieldClicked,
                  data: nestedModalData.value,
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
  let markType = state.dropdowns.values.markType
  let markColor = state.dropdowns.values.markColor
  let markPosition = state.dropdowns.values.bodyPart

  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
    previousCatchRawSubmissions:
      state.trapVisitFormPostBundler.previousCatchRawSubmissions,
    taxonState: taxon ?? [],
    runState: run ?? [],
    lifeStageState: lifeStage ?? [],
    markTypeState: markType ?? [],
    markColorState: markColor ?? [],
    markPositionState: markPosition ?? [],
    visitSetupDefaults: state.visitSetupDefaults,
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(CatchCategoricalQC)

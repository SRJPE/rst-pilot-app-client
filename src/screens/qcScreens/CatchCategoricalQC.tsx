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
import { catchRawQCSubmission } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { every } from 'lodash'
import { DataTable } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  capitalizeFirstLetterOfEachWord,
  getRandomColor,
  normalizeDate,
  reorderTaxon,
  truncateAndTrimString,
} from '../../utils/utils'
import { get } from 'lodash'

interface GraphDataI {
  'Adipose Clipped': any[]
  Species: any[]
  Marks: any[]
  Mortalities: any[]
}

interface NestedModalDataI {
  [fieldClicked: string]: string
}

interface NestedModalValueI {
  fieldClicked: string
  value: string | number | boolean
}

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
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [activeButtons, setActiveButtons] = useState<
    ('Adipose Clipped' | 'Species' | 'Marks' | 'Mortalities')[]
  >(['Adipose Clipped'])
  const [graphData, setGraphData] = useState<GraphDataI>({
    'Adipose Clipped': [],
    Species: [],
    Marks: [],
    Mortalities: [],
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any[] | null>(null)
  const [nestedModalData, setNestedModalData] =
    useState<NestedModalDataI | null>(null)
  const [nestedModalInputValue, setNestedModalInputValue] =
    useState<NestedModalValueI>({
      fieldClicked: '',
      value: '',
    })
  const [markIdToSymbolArr, setMarkIdToSymbolArr] = useState([])

  const axisLabelDictionary = {
    'Adipose Clipped': { xLabel: 'Sampling Time', yLabel: undefined },
    Species: { xLabel: 'Date', yLabel: 'Count' },
    Marks: { xLabel: 'Date', yLabel: 'Count' },
    Mortalities: { xLabel: 'Date', yLabel: 'Count' },
  }

  const buttonNameToChartType = {
    'Adipose Clipped': 'true-or-false',
    Species: 'scatterplot',
    Marks: 'scatterplot',
    Mortalities: 'bar',
  }

  const identifierToName = {
    taxonCode: 'Species',
    captureRunClass: 'Run',
    lifeStage: 'Lifestage',
    forkLength: 'Fork Length',
    markType: 'Mark Type',
    markColor: 'Mark Color',
    markPos: 'Mark Position',
    dead: 'Mortality',
    adiposeClipped: 'Adipose Clipped',
  }

  const identifierToDataValueFromRecord = {
    taxonCode: 'createdCatchRawResponse.taxonCode',
    captureRunClass: 'createdCatchRawResponse.captureRunClass',
    lifeStage: 'createdCatchRawResponse.lifeStage',
    forkLength: 'createdCatchRawResponse.forkLength',
    markType: 'createdCatchRawResponse.markTypeId',
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
    let speciesData: any[] = []
    let marksData: any[] = []
    let deadData: any[] = []

    interface MarkCombosI {
      [key: string]: any
    }

    const markCombos = {} as MarkCombosI

    let fishCountByDateAndSpecies: any = {
      // [date]: {
      //    species: {count: 00, ids: [...]}
      // }
    }

    qcData.forEach((catchResponse: any, idx: number) => {
      const {
        id,
        adiposeClipped,
        taxonCode,
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
      // const dateTime = moment(createdAt).format('MMM Do YY')
      // const date = new Date(createdAt)
      const dateTime = date.getTime()
      const normalizedDate = normalizeDate(new Date(createdAt))

      const marks = [
        ...createdExistingMarksResponse,
        // ...createdMarkAppliedResponse,
      ].filter((mark: any) => {
        return mark.catchRawId === id
      })

      const species = taxonState.filter((obj: any) => {
        return obj.code === taxonCode
      })[0]?.commonname

      if (id) {
        if (adiposeClipped != null) {
          adiposeClippedData.push({
            ids: [id],
            dataId: 'Adipose Clipped',
            x: idx + 1,
            y: adiposeClipped ? 2 : 1,
            colorScale: qcNotStarted ? 'red' : undefined,
            // catchResponse,
          })
        }

        if (species) {
          if (
            Object.keys(fishCountByDateAndSpecies).includes(
              String(normalizedDate)
            )
          ) {
            const fishAtDate = fishCountByDateAndSpecies[normalizedDate]

            // add to already existing species count and ids
            if (Object.keys(fishAtDate).includes(species)) {
              let speciesAtDate = {
                ...fishCountByDateAndSpecies[normalizedDate][species],
              }
              speciesAtDate.count += numFishCaught
              speciesAtDate.ids.push(id)

              fishCountByDateAndSpecies[normalizedDate][species] = speciesAtDate
            }
            // add new species with new count
            else {
              fishCountByDateAndSpecies[normalizedDate] = {
                ...fishAtDate,
                [species]: { count: numFishCaught, ids: [id] },
              }
            }
          } else {
            // add date with new species and count
            fishCountByDateAndSpecies[normalizedDate] = {
              [species]: { count: numFishCaught, ids: [id] },
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

        if (dead) {
          let speciesAlreadyExistsIdx = null
          let speciesAlreadyExists = deadData.filter(
            (dataObj: any, idx: number) => {
              if (dataObj.x === species) {
                speciesAlreadyExistsIdx = idx
                return dataObj.x === species
              }
            }
          )[0]

          if (speciesAlreadyExists && speciesAlreadyExistsIdx) {
            deadData.splice(1, speciesAlreadyExistsIdx)
            deadData.push({
              ids: [id],
              dataId: 'Mortalities',
              x: species,
              y: speciesAlreadyExists.y + numFishCaught,
              colorScale: qcNotStarted ? 'red' : undefined,
              // catchResponse,
            })
          } else {
            deadData.push({
              ids: [id],
              dataId: 'Mortalities',
              x: species,
              y: numFishCaught,
              colorScale: qcNotStarted ? 'red' : undefined,
              // catchResponse,
            })
          }
        }
      }
    })

    let markIdToColorBuilder: any = []
    let symbolCounter = 0

    const addJitter = (value: any, jitterAmount = 0.1) => {
      return value + Math.random() * jitterAmount - jitterAmount / 2
    }

    Object.entries(markCombos).forEach(([dateTime, countObj], index) => {
      Object.entries(countObj as MarkCombosI).forEach(
        ([markIdentifier, itemsArray]) => {
          let randomColor = getRandomColor()
          let symbol = every(itemsArray, ['qcCompleted', true])
            ? 'circle'
            : 'plus'
          markIdToColorBuilder.push({
            name: markIdentifier,
            symbol: { type: symbol, fill: randomColor },
          })

          // if other properties in the same countObj have same length,
          // then symbol should be star

          marksData.push({
            id: `${markIdentifier}_${dateTime}`,
            x: dateTime,
            y: itemsArray.length,
            colorScale: randomColor,
            symbol: every(itemsArray, ['qcCompleted', true])
              ? 'circle'
              : 'plus',
            itemsArray: itemsArray,
          })
          symbolCounter++
        }
      )
    })
    setMarkIdToSymbolArr(markIdToColorBuilder)

    Object.keys(fishCountByDateAndSpecies).forEach((date) => {
      const speciesCountFromDate = fishCountByDateAndSpecies[date]

      Object.keys(speciesCountFromDate).forEach((species) => {
        let count = speciesCountFromDate[species]?.count
        let ids = speciesCountFromDate[species]?.ids

        speciesData.push({
          ids,
          dataId: 'Species',
          x: date,
          y: count,
          // label: species
        })
      })
    })

    setGraphData({
      'Adipose Clipped': adiposeClippedData,
      Species: speciesData,
      Marks: marksData,
      Mortalities: deadData,
    })
  }, [qcCatchRawSubmissions])

  const handlePointClick = (datum: any) => {
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
      setNestedModalData({ [fieldClicked]: 'none' })
    } else {
      if (typeof rawData === 'boolean') {
        rawData = rawData ? 'Yes' : 'No'
      }
      if (rawData === null) {
        rawData = 'NA'
      }
      setNestedModalData({ [fieldClicked]: parsedData ? parsedData : rawData })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalData(null)
  }

  const handleCloseNestedModal = () => {
    setNestedModalData(null)
  }

  const handleModalSubmit = (submission: any) => {
    if (modalData) {
      const ids = Object.keys(submission).map((key: string) => {
        if (submission[key]) {
          return submission[key]['id']
        }
      })
      const catchRawId = ids.find((val) => Boolean(Number(val)))
      dispatch(catchRawQCSubmission({ catchRawId, submission }))
    }
  }

  const handleSaveNestedModal = () => {
    console.log('handle nested modal save')
  }

  const GraphMenuButton = ({
    buttonName,
  }: {
    buttonName: 'Adipose Clipped' | 'Species' | 'Marks' | 'Mortalities'
  }) => {
    return (
      <Button
        bg={activeButtons.includes(buttonName) ? 'primary' : 'secondary'}
        marginX={0.5}
        flex={1}
        onPress={() => {
          let activeButtonsCopy = [...activeButtons]
          if (activeButtons.includes(buttonName)) {
            activeButtonsCopy.splice(activeButtonsCopy.indexOf(buttonName), 1)
            setActiveButtons(activeButtonsCopy)
          } else {
            activeButtonsCopy.unshift(buttonName)
            setActiveButtons(activeButtonsCopy)
          }
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
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Species'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'taxonCode', value })
              }
              setFieldTouched={() => console.log('species field touched')}
              selectOptions={reorderedTaxon.map((taxon: any) => ({
                label: taxon?.commonname,
                value: taxon?.commonname,
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
                value: run?.definition,
              }))}
            />
          </VStack>
        )
      case 'lifeStage':
        return (
          <VStack>
            <Text>Edit Lifestage</Text>
            <CustomSelect
              selectedValue={nestedModalInputValue.value as string}
              placeholder={'Lifestage'}
              onValueChange={(value: string) =>
                setNestedModalInputValue({ fieldClicked: 'lifeStage', value })
              }
              setFieldTouched={() => console.log('lifestage field touched')}
              selectOptions={lifeStageState.map((lifeStage: any) => ({
                label: lifeStage?.definition,
                value: lifeStage?.definition,
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
                value: markType?.definition,
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
                value: markColor?.definition,
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
                value: markPosition?.definition,
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
              value={nestedModalInputValue.value as string}
              onChange={(value: any) => {
                if (value === 'true') {
                  setNestedModalInputValue({
                    fieldClicked: 'dead',
                    value: true,
                  })
                } else {
                  setNestedModalInputValue({
                    fieldClicked: 'dead',
                    value: false,
                  })
                }
              }}
            >
              <Radio
                colorScheme='primary'
                value='false'
                my={1}
                _icon={{ color: 'primary' }}
              >
                Yes
              </Radio>
              <Radio
                colorScheme='primary'
                value='true'
                my={1}
                _icon={{ color: 'primary' }}
              >
                No
              </Radio>
            </Radio.Group>
          </VStack>
        )
      case 'adiposeClipped':
        return (
          <VStack alignItems={'flex-start'}>
            <Text>Edit Adipose Clipped</Text>
            <Radio.Group
              name='isLead'
              accessibilityLabel='is lead'
              value={nestedModalInputValue.value as string}
              onChange={(value: any) => {
                if (value === 'true') {
                  setNestedModalInputValue({
                    fieldClicked: 'adiposeClipped',
                    value: true,
                  })
                } else {
                  setNestedModalInputValue({
                    fieldClicked: 'adiposeClipped',
                    value: false,
                  })
                }
              }}
            >
              <Radio
                colorScheme='primary'
                value='false'
                my={1}
                _icon={{ color: 'primary' }}
              >
                Yes
              </Radio>
              <Radio
                colorScheme='primary'
                value='true'
                my={1}
                _icon={{ color: 'primary' }}
              >
                No
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
            Edit values by selecting a point on the plot below.
          </Text>

          <HStack mb={'10'}>
            <GraphMenuButton buttonName={'Adipose Clipped'} />
            <GraphMenuButton buttonName={'Species'} />
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
                  showDates={['Species', 'Marks'].includes(buttonName)}
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
      {modalData ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseModal()}
          height='1/2'
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

            <VStack alignItems={'center'}>
              <Heading fontSize={23} mb={5}>
                Table of Selected Points
              </Heading>
              <ScrollView horizontal size={'full'}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Variable</DataTable.Title>
                    {modalData.map((data, idx) => (
                      <DataTable.Title key={idx}>{`Fish ${
                        idx + 1
                      }`}</DataTable.Title>
                    ))}
                  </DataTable.Header>

                  <ScrollView size={'full'}>
                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
                        <Text>Species</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        const taxonCode = data.createdCatchRawResponse.taxonCode
                        let species = taxonState.filter((obj: any) => {
                          return obj.code === taxonCode
                        })

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
                            key={`species-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('taxonCode', data)
                            }
                          >
                            <Text>
                              {species.length
                                ? `${truncateAndTrimString(
                                    capitalizeFirstLetterOfEachWord(
                                      species[0]?.commonname
                                    ),
                                    10
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
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
                        <Text>Run</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let run = data.createdCatchRawResponse.captureRunClass
                        let runDefinition = runState.filter((obj: any) => {
                          return obj.id === run
                        })[0]?.definition

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
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
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
                        <Text>Life Stage</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let lifeStageId = data.createdCatchRawResponse.lifeStage
                        let lifeStage = lifeStageState.filter((obj: any) => {
                          return obj.id === lifeStageId
                        })[0]?.definition

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
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
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
                        <Text>Fork Length</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let forkLength =
                          data?.createdCatchRawResponse.forkLength

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
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
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
                        <Text>Mark Type</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let markTypeCode =
                          data?.createdCatchRawResponse.markType
                        let markType = markTypeState.filter((obj: any) => {
                          return obj.id === markTypeCode
                        })

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
                            key={`marktype-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('markType', data)
                            }
                          >
                            <Text>
                              {markType.length
                                ? capitalizeFirstLetterOfEachWord(
                                    markType[0]?.definition
                                  )
                                : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
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
                              style={{ minWidth: 100, width: '100%' }}
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
                              style={{ minWidth: 100, width: '100%' }}
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
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
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
                              style={{ minWidth: 100, width: '100%' }}
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
                              style={{ minWidth: 100, width: '100%' }}
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
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
                        <Text>Adipose Clip</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let adiposeClipped: boolean =
                          data.createdCatchRawResponse.adiposeClipped

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
                            key={`adipose-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('adiposeClipped', data)
                            }
                          >
                            <Text>
                              {adiposeClipped != null
                                ? adiposeClipped
                                  ? 'Yes'
                                  : 'No'
                                : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
                        <Text>Mort</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let mort: boolean = data.createdCatchRawResponse.dead

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
                            key={`mortality-${idx}`}
                            onPress={() => handleModalCellPressed('dead', data)}
                          >
                            <Text>
                              {mort != null ? (mort ? 'Yes' : 'No') : 'NA'}
                            </Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
                        <Text>Crew</Text>
                      </DataTable.Cell>

                      {modalData.map((data, idx) => {
                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
                            key={`crew-${idx}`}
                          >
                            <Text>placeholder</Text>
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
          height='1/2'
        >
          <>
            <CustomModalHeader
              headerText={
                identifierToName[
                  Object.keys(
                    nestedModalData
                  )[0] as keyof typeof identifierToName
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
              <Text color='black' fontSize='2xl' mb={5} fontWeight={'light'}>
                You have the{' '}
                {
                  identifierToName[
                    Object.keys(
                      nestedModalData
                    )[0] as keyof typeof identifierToName
                  ]
                }{' '}
                marked as {`${Object.values(nestedModalData)[0]}`}
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
                  // onChangeText={handleChange('comments')}
                  // onBlur={handleBlur('comments')}
                  value={'Flag Comment (optional)'}
                />
              </HStack>

              <View mt='50px'>
                {CustomNestedModalInput({
                  fieldClicked: Object.keys(nestedModalData)[0],
                  data: Object.values(nestedModalData)[0],
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
  }
}

export default connect(mapStateToProps)(CatchCategoricalQC)

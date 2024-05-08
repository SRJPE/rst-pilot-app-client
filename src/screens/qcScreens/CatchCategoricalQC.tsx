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
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { catchRawQCSubmission } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import moment from 'moment'
import { every } from 'lodash'
import { DataTable } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import CustomSelect from '../../components/Shared/CustomSelect'
import { getRandomColor, reorderTaxon } from '../../utils/utils'
import { get } from 'lodash'

interface GraphDataI {
  'Adipose Clipped': any[]
  Species: any[]
  Marks: any[]
  Mortalities: any[]
}

interface NestedModalDataI {
  fieldClicked: string
  data: any
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
  const [nestedModalValue, setNestedModalValue] = useState<string | boolean>('')
  const [markIdToSymbolArr, setMarkIdToSymbolArr] = useState([])

  const axisLabelDictionary = {
    'Adipose Clipped': { xLabel: 'Sampling Time', yLabel: undefined },
    Species: { xLabel: 'Date', yLabel: 'Count' },
    Marks: { xLabel: 'Date', yLabel: 'Count' },
    Mortalities: { xLabel: 'Date', yLabel: 'Count' },
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
      const createdMarkAppliedResponse =
        catchResponse.createdMarkAppliedResponse ?? []

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
      })[0].commonName

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
                console.log(obj, 'this!')
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
        let count = speciesCountFromDate[species].count
        let ids = speciesCountFromDate[species].ids

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

    console.log('graphData: ', graphData)
  }, [qcCatchRawSubmissions])

  const normalizeDate = (date: Date) => {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date.getTime()
  }

  const handlePointClick = (datum: any) => {
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter((catchRaw) => {
      return catchRaw.createdCatchRawResponse.programId === programId
    })
    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]
    let idsAtPoint: any[] = []
    const objKeys = Object.keys(datum)
    if (objKeys.includes('ids')) {
      idsAtPoint = datum.ids
    } else if (objKeys.includes('itemsArray')) {
      idsAtPoint = datum.itemsArray.map((item: any) => item.catchRawId)
    }
    console.log('4')

    const selectedData = qcData.filter((response) => {
      const id = response.createdCatchRawResponse?.id
      return idsAtPoint.includes(id)
    })

    setModalData(selectedData)
    setIsModalOpen(true)
  }

  const handleModalCellPressed = (fieldClicked: string, data: any) => {
    setNestedModalData({ fieldClicked, data })
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
              selectedValue={nestedModalValue as string}
              placeholder={'Species'}
              onValueChange={(value: string) => setNestedModalValue(value)}
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
              selectedValue={nestedModalValue as string}
              placeholder={'Run'}
              onValueChange={(value: string) => setNestedModalValue(value)}
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
              selectedValue={nestedModalValue as string}
              placeholder={'Lifestage'}
              onValueChange={(value: string) => setNestedModalValue(value)}
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
                let payload = { ...data }
                payload.createdCatchRawResponse.forkLength = value
                console.log('handle fork length edit submit')
              }}
              // onBlur={handleBlur('comments')}
              value={''}
            />
          </VStack>
        )
      case 'markType':
        return (
          <VStack>
            <Text>Edit Mark Type</Text>
            <CustomSelect
              selectedValue={nestedModalValue as string}
              placeholder={'Mark Type'}
              onValueChange={(value: string) => setNestedModalValue(value)}
              setFieldTouched={() => console.log('marktype field touched')}
              selectOptions={markTypeState.map((markType: any) => ({
                label: markType?.definition,
                value: markType?.definition,
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
              value={undefined}
              onChange={(value: any) => {
                if (value === 'true') {
                  setNestedModalValue(true)
                } else {
                  setNestedModalValue(false)
                }
              }}
            >
              <Radio
                colorScheme='primary'
                value='false'
                my={1}
                _icon={{ color: 'primary' }}
              >
                Dead
              </Radio>
              <Radio
                colorScheme='primary'
                value='true'
                my={1}
                _icon={{ color: 'primary' }}
              >
                Alive
              </Radio>
            </Radio.Group>
          </VStack>
        )
    }
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
    dead: 'Mortality',
  }

  const identifierToDataValueFromRecord = {
    taxonCode: 'createdCatchRawResponse.taxonCode',
    captureRunClass: 'createdCatchRawResponse.captureRunClass',
    lifeStage: 'createdCatchRawResponse.captureRunClass',
    forkLength: 'createdCatchRawResponse.forkLength',
    markType: 'createdCatchRawResponse.markType',
    dead: 'createdCatchRawResponse.dead',
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
                              {species.length ? species[0].commonname : 'NA'}
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

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
                            key={`run-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('captureRunClass', data)
                            }
                          >
                            <Text>{run ?? 'NA'}</Text>
                          </DataTable.Cell>
                        )
                      })}
                    </DataTable.Row>

                    <DataTable.Row
                      style={[{ justifyContent: 'center', width: '100%' }]}
                    >
                      <DataTable.Cell style={{ minWidth: 100, width: '100%' }}>
                        <Text>Lifestage</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let lifeStageId = data.createdCatchRawResponse.lifeStage
                        let lifeStage = lifeStageState.filter((obj: any) => {
                          return obj.id === lifeStageId
                        })

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
                            key={`lifestage-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('lifeStage', data)
                            }
                          >
                            <Text>
                              {lifeStage.length
                                ? lifeStage[0].definition
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
                        <Text>Fork Length</Text>
                      </DataTable.Cell>
                      {modalData.map((data, idx) => {
                        let forkLength = data.createdCatchRawResponse.forkLength

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
                            key={`forklength-${idx}`}
                            onPress={() =>
                              handleModalCellPressed('forkLength', data)
                            }
                          >
                            <Text>{forkLength ?? 'NA'}</Text>
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
                        let markTypeCode = data.createdCatchRawResponse.markType
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
                              {markType.length ? markType[0].definition : 'NA'}
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
                        let mort = data.createdCatchRawResponse.dead

                        return (
                          <DataTable.Cell
                            style={{ minWidth: 100, width: '100%' }}
                            key={`mortality-${idx}`}
                            onPress={() => handleModalCellPressed('dead', data)}
                          >
                            <Text>{mort != null ? `${mort}` : 'NA'}</Text>
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
                            <Text>crew members</Text>
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
                You have the {nestedModalData.fieldClicked} marked as{' '}
                <Text fontWeight={'bold'}>
                  {get(
                    nestedModalData.data,
                    identifierToDataValueFromRecord[
                      nestedModalData.fieldClicked as keyof typeof identifierToDataValueFromRecord
                    ]
                  )}
                </Text>{' '}
              </Text>
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

              <View mt='50px'>{CustomNestedModalInput(nestedModalData)}</View>
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

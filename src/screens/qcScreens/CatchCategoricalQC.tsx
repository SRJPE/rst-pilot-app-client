import { useEffect, useState } from 'react'
import { Button, HStack, View, VStack, Text, ScrollView } from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { AppDispatch, RootState } from '../../redux/store'
import { connect, useDispatch } from 'react-redux'
import CustomModal from '../../components/Shared/CustomModal'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { catchRawQCSubmission } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import moment from 'moment'
import { every } from 'lodash'
interface GraphDataI {
  'Adipose Clipped': any[]
  Species: any[]
  Marks: any[]
  Mortalities: any[]
}

function CatchCategoricalQC({
  navigation,
  route,
  qcCatchRawSubmissions,
  taxon,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any
  taxon: any
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
  const [pointClicked, setPointClicked] = useState<any | null>(null)

  useEffect(() => {
    const previousCatchRaw = route.params.previousCatchRaw
    const qcData = [...qcCatchRawSubmissions, ...previousCatchRaw]

    let adiposeClippedData: any[] = []
    let speciesData: any[] = []
    let marksData: any[] = []
    let deadData: any[] = []

    interface MarkCombosI {
      [key: string]: any
    }

    const markCombos = {} as MarkCombosI

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

      const marks = [
        ...createdExistingMarksResponse,
        // ...createdMarkAppliedResponse,
      ].filter((mark: any) => {
        return mark.catchRawId === id
      })
      console.log('🚀 ~ qcData.forEach ~ marks:', marks)

      let species = taxon.filter((obj: any) => {
        return obj.code === taxonCode
      })[0].commonName

      if (id) {
        if (adiposeClipped != null) {
          adiposeClippedData.push({
            id,
            x: idx + 1,
            y: adiposeClipped ? 2 : 1,
            colorScale: qcNotStarted ? 'red' : undefined,
          })
        }

        if (taxonCode) {
          let speciesAlreadyExistsIdx = null
          let speciesAlreadyExists = speciesData.filter(
            (dataObj: any, idx: number) => {
              if (dataObj.x === species) {
                speciesAlreadyExistsIdx = idx
                return dataObj.x === species
              }
            }
          )[0]

          if (speciesAlreadyExists && speciesAlreadyExistsIdx) {
            speciesData.splice(1, speciesAlreadyExistsIdx)
            speciesData.push({
              id,
              x: idx + 1,
              y: speciesAlreadyExists.y + numFishCaught,
              colorScale: qcNotStarted ? 'red' : undefined,
              label: species,
            })
          } else {
            speciesData.push({
              id,
              x: idx + 1,
              y: numFishCaught,
              colorScale: qcNotStarted ? 'red' : undefined,
              label: species,
            })
          }
        }

        // MARK DATA PROCESSING NOT COMPLETE
        if (marks.length) {
          marks.forEach((mark: any) => {
            const { markTypeId, markColorId, markPositionId } = mark
            const markIdentifier = `${markTypeId}-${markColorId}-${markPositionId}`

            // if date does not exist,
            if (!markCombos[dateTime]) {
              //add to markCombos obj and set property to unique combo and count to 1
              markCombos[dateTime] = {
                [markIdentifier]: [{ catchRawId: id, mark }],
              } as any
            } else if (markCombos[dateTime]) {
              // if markIdentifier combo exists, increment
              if (markCombos[dateTime][markIdentifier]) {
                markCombos[dateTime][markIdentifier] = [
                  ...markCombos[dateTime][markIdentifier],
                  { catchRawId: id, mark },
                ]
              } else {
                // else set new markIdentifier count to
                markCombos[dateTime][markIdentifier] = [
                  { catchRawId: id, mark },
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
              id,
              x: species,
              y: speciesAlreadyExists.y + numFishCaught,
              colorScale: qcNotStarted ? 'red' : undefined,
            })
          } else {
            deadData.push({
              id,
              x: species,
              y: numFishCaught,
              colorScale: qcNotStarted ? 'red' : undefined,
            })
          }
        }
      }
    })

    const symbolOptions = [
      'cross',
      'diamond',
      'plus',
      'minus',
      'square',
      // 'star',
      'triangleDown',
      'triangleUp',
    ]
    const test = {
      markIdentifier: 'unusedMark',
    }

    console.log('markCombos', markCombos)

    let symbolCounter = 0
    const addJitter = (value: any, jitterAmount = 0.1) => {
      return value + Math.random() * jitterAmount - jitterAmount / 2
    }
    Object.entries(markCombos).forEach(([dateTime, countObj], index) => {
      //iterate over the countObj values.
      //create an Obj of found lengths
      // for each countObject value's length
      //check to see if it is already present in the found lengths array
      // if found (needs to be a star)

      // end obj
      /*
      {
        1: [12-5-4, 2-8-null]
        2: []
        3: []
        4: [down-here]
      }

      */

      Object.entries(countObj as MarkCombosI).forEach(
        ([markIdentifier, itemsArray]) => {
          let symbol = symbolOptions[symbolCounter]

          // if other properties in the same countObj have same length,
          // then symbol should be star

          marksData.push({
            id: `${markIdentifier}_${dateTime}`,
            x: dateTime,
            y: itemsArray.length,
            colorScale: every(itemsArray, ['qcCompleted', true])
              ? 'black'
              : 'red',
            symbol: every(itemsArray, ['qcCompleted', true])
              ? 'circle'
              : symbol,
            itemsArray: itemsArray,
          })
          symbolCounter++
        }
      )
    })

    setGraphData({
      'Adipose Clipped': adiposeClippedData,
      Species: speciesData,
      Marks: marksData,
      Mortalities: deadData,
    })
  }, [qcCatchRawSubmissions])

  const handlePointClick = (datum: any) => {
    setPointClicked(datum)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPointClicked(null)
  }

  const handleModalSubmit = (submission: any) => {
    if (pointClicked) {
      const ids = Object.keys(submission).map((key: string) => {
        if (submission[key]) {
          return submission[key]['id']
        }
      })
      const catchRawId = ids.find((val) => Boolean(Number(val)))
      dispatch(catchRawQCSubmission({ catchRawId, submission }))
    }
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

  const buttonNameToChartType = {
    'Adipose Clipped': 'true-or-false',
    Species: 'bar',
    Marks: 'scatter',
    Mortalities: 'bar',
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
      {pointClicked ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseModal()}
          height='1/2'
        >
          <GraphModalContent
            closeModal={() => handleCloseModal()}
            pointClicked={pointClicked}
            onSubmit={(submission: any) => handleModalSubmit(submission)}
            headerText={'Table of Selected Points'}
            modalData={graphData}
            dataFormatter={(header, dataAtId) => {
              // 'Adipose Clipped' | 'Species' | 'Marks' | 'Mortalities'
              if (header === 'Adipose Clipped') {
                if (dataAtId.y === 1) return 'false'
                if (dataAtId.y === 2) return 'true'
              } else if (header === 'Species') {
                return dataAtId.label
              } else {
                return dataAtId.y
              }
            }}
          />
        </CustomModal>
      ) : (
        <></>
      )}
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  let taxon = state.dropdowns.values.taxon

  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
    taxon: taxon ?? [],
  }
}

export default connect(mapStateToProps)(CatchCategoricalQC)

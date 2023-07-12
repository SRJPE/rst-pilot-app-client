import { useEffect, useState } from 'react'
import { Button, HStack, View, VStack, Text, ScrollView } from 'native-base'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import { RootState } from '../../redux/store'
import { connect } from 'react-redux'

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
      const qcNotStarted = qcCompleted ? false : true

      const createdExistingMarksResponse =
        catchResponse.createdExistingMarksResponse ?? []
      const createdMarkAppliedResponse =
        catchResponse.createdMarkAppliedResponse ?? []

      const dateTime = new Date(createdAt)

      const marks = [
        ...createdExistingMarksResponse,
        ...createdMarkAppliedResponse,
      ].filter((mark: any) => {
        return mark.catchRawId === id
      })

      let species = taxon.filter((obj: any) => {
        return obj.code === taxonCode
      })[0].commonname

      if (id) {
        if (adiposeClipped) {
          adiposeClippedData.push({
            id,
            x: idx + 1,
            y: adiposeClipped ? 1 : 0,
            colorScale: qcCompleted ? 'red' : undefined,
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
            marksData.push({
              id,
              x: `${mark.markTypeId} - ${mark.markColorId}`,
              y: 1,
              colorScale: qcNotStarted ? 'red' : undefined,
            })
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

    setGraphData({
      'Adipose Clipped': adiposeClippedData,
      Species: speciesData,
      Marks: marksData,
      Mortalities: deadData,
    })
  }, [qcCatchRawSubmissions])

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
                  chartType='bar'
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

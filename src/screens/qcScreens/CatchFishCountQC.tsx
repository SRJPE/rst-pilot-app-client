import { MaterialIcons } from '@expo/vector-icons'
import {
  Button,
  HStack,
  View,
  VStack,
  Text,
  ScrollView,
  Icon,
  Input,
  Box,
  Divider,
} from 'native-base'
import { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import CustomModal from '../../components/Shared/CustomModal'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import Graph from '../../components/Shared/Graph'
import GraphModalContent from '../../components/Shared/GraphModalContent'
import { AppDispatch, RootState } from '../../redux/store'
import { normalizeDate, reorderTaxon } from '../../utils/utils'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  catchRawQCSubmission,
  postQCSubmissions,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import moment from 'moment'

interface ModalDataI {
  measuredFish: number | null
  plusCountFish: number | null
  catchRawIdsWithPlusCount?: number[]
  dateTimestamp?: number | null
}

function CatchFishCountQC({
  navigation,
  route,
  qcCatchRawSubmissions,
  previousCatchRawSubmissions,
  taxonDropdowns,
}: {
  navigation: any
  route: any
  qcCatchRawSubmissions: any
  previousCatchRawSubmissions: any
  taxonDropdowns: any[]
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [graphData, setGraphData] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pointClicked, setPointClicked] = useState<any | null>(null)
  const [selectedSpecies, setSelectedSpecies] = useState<string>('')
  const [modalData, setModalData] = useState<ModalDataI>({
    measuredFish: null,
    plusCountFish: null,
  })
  const [modalInputValue, setModalInputValue] = useState<string>('')
  const [modalCommentValue, setModalCommentValue] = useState<string>('')
  const reorderedTaxon = reorderTaxon(taxonDropdowns)

  useEffect(() => {
    const programId = route.params.programId
    const programCatchRaw = previousCatchRawSubmissions.filter(
      (catchRaw: any) => {
        return catchRaw.createdCatchRawResponse.programId === programId
      }
    )
    const selectedSpeciesTaxon = reorderedTaxon.find(
      (taxon) => taxon.commonname == selectedSpecies
    )?.code

    const qcData = [...qcCatchRawSubmissions, ...programCatchRaw]

    const qcDataFiltered = qcData.filter((catchRawResponse: any) => {
      return (
        catchRawResponse.createdCatchRawResponse.taxonCode ===
        selectedSpeciesTaxon
      )
    })

    const totalCountByDay: any[] = []
    const datesFormatted: any = {}

    // Structure: datesFormatted = { date: {count, catchRawIds: [...]}, ...}

    qcDataFiltered.forEach((catchResponse) => {
      const catchRaw = catchResponse.createdCatchRawResponse
      const numFishCaught: number = catchRaw?.numFishCaught
      const plusCount: boolean = catchRaw?.plusCount
      const createdAt = new Date(catchRaw.createdAt)
      const normalizedDate = normalizeDate(createdAt)
      const qcCompleted = catchResponse.qcCompleted

      if (Object.keys(datesFormatted).includes(String(normalizedDate))) {
        datesFormatted[normalizedDate].count += numFishCaught
        if (!qcCompleted) datesFormatted[normalizedDate].qcCompleted = false

        // add catchRawId to array if not already included
        if (!datesFormatted[normalizedDate].catchRawIds.includes(catchRaw.id)) {
          datesFormatted[normalizedDate].catchRawIds.push(catchRaw.id)
        }

        // set containsPlusCount to true if any catchRaw has plusCount
        if (plusCount) {
          datesFormatted[normalizedDate].containsPlusCount = true
          datesFormatted[normalizedDate].plusCountValue += numFishCaught
          datesFormatted[normalizedDate].firstPlusCountRecordId = catchRaw.id
        }
      } else {
        datesFormatted[normalizedDate] = {
          count: numFishCaught,
          catchRawIds: [catchRaw.id],
          containsPlusCount: plusCount,
          firstPlusCountRecordId: plusCount ? catchRaw.id : null,
          plusCountValue: plusCount ? numFishCaught : 0,
          qcCompleted,
        }
      }
    })

    Object.keys(datesFormatted).forEach((dateString) => {
      totalCountByDay.push({
        x: Number(dateString),
        y: datesFormatted[dateString].count,
        catchRawIds: datesFormatted[dateString].catchRawIds,
        containsPlusCount: datesFormatted[dateString].containsPlusCount,
        plusCountValue: datesFormatted[dateString].plusCountValue,
        firstPlusCountRecordId:
          datesFormatted[dateString].firstPlusCountRecordId,
        colorScale: !datesFormatted[dateString].qcCompleted
          ? 'rgb(255, 100, 84)'
          : undefined,
      })
    })

    setGraphData(totalCountByDay)
  }, [selectedSpecies, qcCatchRawSubmissions])

  const handlePointClick = (datum: any) => {
    try {
      let catchRawIdsWithPlusCount = []

      if (datum.containsPlusCount) {
        // from datum.catchRawIds, get all catchRawIds that have plusCount
        catchRawIdsWithPlusCount = datum.catchRawIds.filter(
          (catchRawId: number) => {
            return graphData.find((data) =>
              data.catchRawIds.includes(catchRawId)
            )
          }
        )
      }
      setModalData({
        measuredFish: datum._y - datum.plusCountValue,
        plusCountFish: datum.plusCountValue,
        catchRawIdsWithPlusCount,
        dateTimestamp: datum.x,
      })

      setPointClicked(datum)
      setIsModalOpen(true)
      setModalInputValue(`${datum.plusCountValue}`)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPointClicked(null)
    setModalInputValue('')
    setModalCommentValue('')
    setModalData({ measuredFish: null, plusCountFish: null })
  }

  const handleModalSubmit = () => {
    let submissions: any[] = []

    let catchRawId = pointClicked?.firstPlusCountRecordId

    catchRawId = catchRawId ? catchRawId : pointClicked?.catchRawIds[0]

    if (pointClicked && catchRawId) {
      let submissionOne = {
        fieldName: 'Plus Count',
        value: modalInputValue,
      }
      submissions.push(submissionOne)

      if (modalCommentValue) {
        let submissionTwo = {
          fieldName: 'Comments',
          value: modalCommentValue,
        }
        submissions.push(submissionTwo)
      }

      dispatch(catchRawQCSubmission({ catchRawId, submissions }))
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
            headerText={'QC Total Daily Count'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            Select a species to see total daily counts for the selected species.
            Points represent total daily counts of measured and plus count fish.
            Edit values by selecting a point on the plot below.
          </Text>

          <Box width='70%' marginBottom={5}>
            <CustomSelect
              selectedValue={selectedSpecies}
              placeholder={'Species'}
              style={{ width: '100%' }}
              onValueChange={(value: string) => {
                setSelectedSpecies(value)
              }}
              selectOptions={reorderedTaxon.map((taxon: any) => ({
                label: taxon?.commonname,
                value: taxon?.commonname,
              }))}
            />
          </Box>

          {selectedSpecies &&
            (graphData.length > 0 ? (
              <ScrollView>
                <Graph
                  xLabel={'Date'}
                  yLabel={'Total Daily Catch'}
                  chartType='bar'
                  data={selectedSpecies != '' ? graphData : []}
                  showDates={true}
                  barColor='grey'
                  onPointClick={(datum) => handlePointClick(datum)}
                  selectedBarColor='green'
                  height={400}
                  width={600}
                />
              </ScrollView>
            ) : (
              <Text fontSize='xl'>No data available for this species</Text>
            ))}

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
                Approve
              </Text>
            </Button>
          </HStack>
        </VStack>
      </View>

      {modalData && pointClicked ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseModal()}
          height='3/4'
        >
          <>
            <CustomModalHeader
              headerText={'Plus Count Editor'}
              headerFontSize={23}
              showHeaderButton={true}
              closeModal={() => handleCloseModal()}
              headerButton={
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
                  shadow='3'
                  onPress={() => {
                    handleModalSubmit()
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
              {modalData.dateTimestamp && (
                <>
                  <Text
                    color='black'
                    fontSize='2xl'
                    mb={5}
                    fontWeight={'light'}
                  >
                    Selected Point Date:{' '}
                    {moment(modalData.dateTimestamp).format('MMMM Do, YYYY')}
                  </Text>
                  <Divider mb={5} />
                </>
              )}
              <Text color='black' fontSize='2xl' mb={5} fontWeight={'light'}>
                You collected{' '}
                <Text fontWeight={'bold'}>
                  {modalData.measuredFish} measured
                </Text>{' '}
                fish and{' '}
                <Text fontWeight={'bold'}>
                  {modalData.plusCountFish} plus count
                </Text>{' '}
                fish.
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
                  placeholder='Flag Comment (optional)'
                  keyboardType='default'
                  onChangeText={(value) => setModalCommentValue(value)}
                  value={modalCommentValue}
                />
              </HStack>

              <View mt='50px'>
                <Text>Edit Plus Count</Text>
                <Input
                  height='50px'
                  width='350px'
                  fontSize='16'
                  placeholder='Enter Plus Count Value'
                  keyboardType='default'
                  onChangeText={(value) => setModalInputValue(value)}
                  value={modalInputValue}
                />
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

  return {
    qcCatchRawSubmissions: state.trapVisitFormPostBundler.qcCatchRawSubmissions,
    previousCatchRawSubmissions:
      state.trapVisitFormPostBundler.previousCatchRawSubmissions,
    taxonDropdowns: taxon ?? [],
  }
}

export default connect(mapStateToProps)(CatchFishCountQC)

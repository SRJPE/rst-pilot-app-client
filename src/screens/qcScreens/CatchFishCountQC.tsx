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

interface ModalDataI {
  measuredFish: number | null
  plusCountFish: number | null
  catchRawIdsWithPlusCount?: number[]
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

      if (Object.keys(datesFormatted).includes(String(normalizedDate))) {
        datesFormatted[normalizedDate].count += numFishCaught

        // add catchRawId to array if not already included
        if (!datesFormatted[normalizedDate].catchRawIds.includes(catchRaw.id)) {
          datesFormatted[normalizedDate].catchRawIds.push(catchRaw.id)
        }

        // set containsPlusCount to true if any catchRaw has plusCount
        if (plusCount) {
          datesFormatted[normalizedDate].containsPlusCount = true
          datesFormatted[normalizedDate].plusCountValue += numFishCaught
        }
      } else {
        datesFormatted[normalizedDate] = {
          count: numFishCaught,
          catchRawIds: [catchRaw.id],
          containsPlusCount: plusCount,
          plusCountValue: plusCount ? numFishCaught : 0,
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
      })
    })

    setGraphData(totalCountByDay)
  }, [selectedSpecies])

  const handlePointClick = (datum: any) => {
    console.log('point clicked: ', datum)
    let catchRawIdsWithPlusCount = []

    if (datum.containsPlusCount) {
      // from datum.catchRawIds, get all catchRawIds that have plusCount
      catchRawIdsWithPlusCount = datum.catchRawIds.filter(
        (catchRawId: number) => {
          return graphData.find((data) => data.catchRawIds.includes(catchRawId))
        }
      )

      setModalData({
        measuredFish: datum.y - datum.plusCountValue,
        plusCountFish: datum.plusCountValue,
        catchRawIdsWithPlusCount,
      })
    }

    setPointClicked(datum)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPointClicked(null)
    setModalInputValue('')
    setModalData({ measuredFish: null, plusCountFish: null })
  }

  const handleModalSubmit = (submission: any) => {
    console.log('submission', submission)
    if (pointClicked) {
      // const ids = Object.keys(submission).map((key: string) => {
      //   if (submission[key]) {
      //     return submission[key]['id']
      //   }
      // })
      // const catchRawId = ids.find((val) => Boolean(Number(val)))
      // dispatch(catchRawQCSubmission({ catchRawId, submission }))
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
            Edit values by selecting a point on the plot below. Gray lineplots
            show total daily counts for the past 5 years.
          </Text>

          <Box width='70%' marginBottom={5}>
            <CustomSelect
              selectedValue={selectedSpecies}
              placeholder={'Species'}
              style={{ width: '100%' }}
              onValueChange={(value: string) => {
                console.log('value', value)
                setSelectedSpecies(value)
              }}
              selectOptions={reorderedTaxon.map((taxon: any) => ({
                label: taxon?.commonname,
                value: taxon?.commonname,
              }))}
            />
          </Box>

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
      {modalData && pointClicked ? (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={() => handleCloseModal()}
          height='2/3'
        >
          <GraphModalContent
            closeModal={() => handleCloseModal()}
            pointClicked={pointClicked}
            onSubmit={(submission: any) => handleModalSubmit(submission)}
            headerText={'Plus Count Editor'}
            modalData={{ 'Total Daily Count': graphData }}
            showHeaderButton={true}
          >
            <VStack
              paddingX={20}
              justifyContent='center'
              justifyItems={'center'}
            >
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
                  placeholder='Write a comment'
                  keyboardType='default'
                  // onChangeText={handleChange('comments')}
                  // onBlur={handleBlur('comments')}
                  value={'Flag Comment (optional)'}
                />
              </HStack>

              <View mt='50px'>
                <Text>Edit numeric Inout</Text>
                <Input
                  height='50px'
                  width='350px'
                  fontSize='16'
                  placeholder='Write a comment'
                  keyboardType='default'
                  onChangeText={(value) => setModalInputValue(value)}
                  value={modalInputValue}
                />
              </View>
            </VStack>
          </GraphModalContent>
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

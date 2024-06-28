import { useEffect, useState } from 'react'
import { Box, Button, Center, Icon, Text, View, VStack } from 'native-base'
import { LayoutAnimation, TouchableOpacity } from 'react-native'
import api from '../../api/axiosConfig'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'

interface QCDataI {
  previousTrapVisits: any[]
  previousCatchRaw: any[]
}

function QCMain({
  navigation,
  route,
  previousTrapVisits,
  previousCatchRaw,
}: {
  navigation: any
  route: any
  previousTrapVisits: any[]
  previousCatchRaw: any[]
}) {
  const [activeButton, setActiveButton] = useState<
    'trapBtn' | 'catchBtn' | 'efficiencyBtn' | ''
  >('')
  const [activeCatchOption, setActiveCatchOption] = useState<
    | 'Measured Variables and Associated Categories'
    | 'Categorical Observations'
    | 'Total Fish Counts'
    | 'Partial Records'
    | ''
  >('')
  const [qcData, setQCData] = useState<QCDataI>({
    previousTrapVisits: [],
    previousCatchRaw: [],
  })

  useEffect(() => {
    const programId = route.params.programId
    const programsTrapVisits = previousTrapVisits.filter((trapVisit) => {
      return trapVisit.createdTrapVisitResponse.programId === programId
    })
    const programsCatchRaw = previousCatchRaw.filter((catchRaw) => {
      return catchRaw.createdCatchRawResponse.programId === programId
    })

    setQCData({
      previousTrapVisits: programsTrapVisits ?? [],
      previousCatchRaw: programsCatchRaw ?? [],
    })
  }, [route.params.programId])

  return (
    <VStack alignItems={'center'} marginTop={100} flex={1}>
      <Button
        w='4/5'
        bg={activeButton === 'trapBtn' ? 'themeOrange' : 'primary'}
        onPress={() => {
          setActiveButton('trapBtn')
          navigation.navigate('Trap QC', {
            programId: route.params.programId,
          })
        }}
      >
        <Text fontSize='xl' color='white' fontWeight={'bold'}>
          Environment & Trap Operations
        </Text>
      </Button>
      {/* ------------------------------------------------------------------------------------ */}
      <Accordion
        activeButton={activeButton}
        headerComponent={
          <View
            marginTop={25}
            w='4/5'
            bg={activeButton === 'catchBtn' ? 'themeOrange' : 'primary'}
            py={3}
          >
            <Center>
              <Text fontSize='xl' color='white' fontWeight={'bold'}>
                Catch
              </Text>
            </Center>
          </View>
        }
        headerOnPress={() => {
          setActiveButton('catchBtn')
        }}
      >
        <>
          <Button
            marginTop={1}
            w={655}
            bg={
              activeCatchOption ===
              'Measured Variables and Associated Categories'
                ? 'rgba(249, 163, 140, 0.46)'
                : 'secondary'
            }
            justifyContent='center'
            alignItems='center'
            onPress={() => {
              setActiveCatchOption(
                'Measured Variables and Associated Categories'
              )
              navigation.navigate('CatchMeasureQC', {
                programId: route.params.programId,
              })
            }}
          >
            <Text
              fontSize='xl'
              color='primary'
              fontWeight={'bold'}
              textAlign='center'
            >
              Measured Variables and Associated Categories
            </Text>
          </Button>
          <Button
            marginTop={1}
            w={655}
            bg={
              activeCatchOption === 'Categorical Observations'
                ? 'rgba(249, 163, 140, 0.46)'
                : 'secondary'
            }
            justifyContent='center'
            alignItems='center'
            onPress={() => {
              setActiveCatchOption('Categorical Observations')
              navigation.navigate('CatchCategoricalQC', {
                programId: route.params.programId,
              })
            }}
          >
            <Text
              fontSize='xl'
              color='primary'
              fontWeight={'bold'}
              textAlign='center'
            >
              Categorical Observations
            </Text>
          </Button>
          <Button
            marginTop={1}
            w={655}
            bg={
              activeCatchOption === 'Total Fish Counts'
                ? 'rgba(249, 163, 140, 0.46)'
                : 'secondary'
            }
            justifyContent='center'
            alignItems='center'
            onPress={() => {
              setActiveCatchOption('Total Fish Counts')
              navigation.navigate('CatchFishCountQC', {
                programId: route.params.programId,
              })
            }}
          >
            <Text
              fontSize='xl'
              color='primary'
              fontWeight={'bold'}
              textAlign='center'
            >
              Total Fish Counts
            </Text>
          </Button>
          <Button
            marginTop={1}
            w={655}
            bg={
              activeCatchOption === 'Partial Records'
                ? 'rgba(249, 163, 140, 0.46)'
                : 'secondary'
            }
            justifyContent='center'
            alignItems='center'
            onPress={() => {
              setActiveCatchOption('Partial Records')
              navigation.navigate('PartialRecordsQC', {
                programId: route.params.programId,
              })
            }}
          >
            <Text
              fontSize='xl'
              color='primary'
              fontWeight={'bold'}
              textAlign='center'
            >
              Partial Records
            </Text>
          </Button>
        </>
      </Accordion>
      {/* ------------------------------------------------------------------------------------ */}
      <Button
        marginTop={25}
        w='4/5'
        bg={activeButton === 'efficiencyBtn' ? 'themeOrange' : 'primary'}
        onPress={() => {
          setActiveButton('efficiencyBtn')
          navigation.navigate('EfficiencyQC', {
            programId: route.params.programId,
          })
        }}
      >
        <Text fontSize='xl' color='white' fontWeight={'bold'}>
          Efficiency
        </Text>
      </Button>
      <View flex={1}></View>
      <Button
        marginBottom={5}
        w='90%'
        bg='primary'
        onPress={() => {
          navigation.goBack()
        }}
      >
        <Text fontSize='xl' color='white' fontWeight={'bold'}>
          Back
        </Text>
      </Button>
    </VStack>
  )
}

const mapStateToProps = (state: RootState) => {
  let previousTrapVisits =
    state.trapVisitFormPostBundler.previousTrapVisitSubmissions
  let previousCatchRaw =
    state.trapVisitFormPostBundler.previousCatchRawSubmissions

  return {
    previousTrapVisits,
    previousCatchRaw,
  }
}

export default connect(mapStateToProps)(QCMain)

const Accordion = ({
  headerComponent,
  headerOnPress,
  children,
  activeButton,
}: {
  headerComponent: JSX.Element
  headerOnPress: () => void
  children?: JSX.Element
  activeButton: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (activeButton != 'catchBtn' && isOpen) {
      toggleOpen()
    }
  }, [activeButton])

  const toggleOpen = () => {
    setIsOpen((value) => !value)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          headerOnPress()
          toggleOpen()
        }}
        style={{
          flexDirection: 'row',
        }}
        activeOpacity={0.6}
      >
        {headerComponent}
      </TouchableOpacity>
      <View
        style={[
          {
            overflow: 'hidden',
          },
          !isOpen
            ? {
                height: 0,
              }
            : undefined,
        ]}
      >
        {children ? children : <></>}
      </View>
    </>
  )
}

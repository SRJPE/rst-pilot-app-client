import React, { useEffect, useState } from 'react'
import {
  Text,
  VStack,
  Heading,
  View,
  IconButton,
  Box,
  Pressable,
} from 'native-base'
import BottomNavigation from '../components/home/HomeNavButtons'
import { StyleSheet } from 'react-native'
import AppLogo from '../components/Shared/AppLogo'
import { Entypo } from '@expo/vector-icons'
import { getVisitSetupDefaults } from '../redux/reducers/visitSetupDefaults'
import { getTrapVisitDropdownValues } from '../redux/reducers/dropdownsSlice'
import { fetchPreviousTrapAndCatch } from '../redux/reducers/postSlices/trapVisitFormPostBundler'
import { RootState, AppDispatch } from '../redux/store'
import { connect, useDispatch, useSelector } from 'react-redux'
import { find } from 'lodash'
import { getUserPrograms } from '../redux/reducers/userCredentialsSlice'
import AlertDialog from '../components/Shared/AlertDialog'
import { retrieveTrapVisitsRequiringTurbidity } from '../utils/helpers/helperFunctions'

const styles = StyleSheet.create({
  recentItemsContainer: {
    minHeight: 75,
    alignSelf: 'flex-end',
    width: '100%',
    paddingHorizontal: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  recentItemsCardRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentItemsCard: {
    height: 150,
    width: 200,
    borderWidth: 1,
    borderColor: '#A29C9C',
    borderRadius: 5,
    display: 'flex',
  },
  recentItemsCardPreviewContainer: {
    backgroundColor: '#D9D9D9',
    flex: 3,
  },
  recentItemsCardTextContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const Home = ({
  navigation,
  userCredentialsStore,
  previousTrapVisits,
  visitSetupDefaultState,
}: {
  navigation: any
  userCredentialsStore: any
  previousTrapVisits: any
  visitSetupDefaultState: any
}) => {
  const visitsRequiringTurbidity =
    retrieveTrapVisitsRequiringTurbidity(previousTrapVisits)

  const [staggerOpen, setStaggerOpen] = useState(false as boolean)
  const [opacity, setOpacity] = useState(1 as number)
  const [recentTrapVisits, setRecentTrapVisits] = useState([] as Array<any>)
  const dispatch = useDispatch<AppDispatch>()

  const connectivityState = useSelector((state: any) => state.connectivity)

  useEffect(() => {
    staggerOpen ? setOpacity(0.25) : setOpacity(1)
  }, [staggerOpen])

  useEffect(() => {
    let filteredTrapVisits = previousTrapVisits?.filter((trapVisit: any) =>
      trapVisit.createdTrapVisitEnvironmentalResponse?.some(
        (response: any) =>
          response.measureName === 'water turbidity' &&
          response.measureValueNumeric === null
      )
    )
    console.log('filteredTrapVisits', filteredTrapVisits)
    let sortedTrapVisits = filteredTrapVisits
    sortedTrapVisits.sort(
      (a: any, b: any) =>
        new Date(b.createdTrapVisitResponse.trapVisitTimeEnd).getTime() -
        new Date(a.createdTrapVisitResponse.trapVisitTimeEnd).getTime()
    )
    sortedTrapVisits = sortedTrapVisits.map((trapVisit: any) => {
      return {
        date: new Date(
          trapVisit.createdTrapVisitResponse.trapVisitTimeEnd
        )?.toLocaleDateString('en-US'),
        streamName: find(visitSetupDefaultState.programs, {
          id: trapVisit.createdTrapVisitResponse.programId,
        })?.streamName,
        trapName: find(visitSetupDefaultState.trapLocations, {
          id: trapVisit.createdTrapVisitResponse.trapLocationId,
        })?.trapName,
      }
    })

    setRecentTrapVisits(sortedTrapVisits.slice(0, 3))
  }, [previousTrapVisits, visitSetupDefaultState])

  useEffect(() => {
    if (
      userCredentialsStore?.id &&
      connectivityState.isConnected &&
      connectivityState.isInternetReachable
    ) {
      try {
        dispatch(getVisitSetupDefaults(userCredentialsStore.id))
        dispatch(getTrapVisitDropdownValues())
        dispatch(fetchPreviousTrapAndCatch())
      } catch (error) {
        console.log('error from home screen: ', error)
      }
    }
  }, [
    userCredentialsStore.id,
    connectivityState.isConnected,
    connectivityState.isInternetReachable,
    userCredentialsStore?.userPrograms?.length,
  ])

  useEffect(() => {
    ;(async () => {
      if (userCredentialsStore?.id && !userCredentialsStore.userPrograms) {
        try {
          dispatch(getVisitSetupDefaults(userCredentialsStore.id))
          dispatch(getTrapVisitDropdownValues())

          dispatch(getUserPrograms(userCredentialsStore?.id))
        } catch (error) {
          console.log('error from home screen: ', error)
        }
      }
    })()
  }, [userCredentialsStore.userPrograms])

  const recentItemsCard = ({ text }: { text: string }) => {
    return (
      <Pressable onPress={() => navigation.navigate('Input Turbidity')}>
        <Box>
          <View style={styles.recentItemsCard}>
            <View style={styles.recentItemsCardTextContainer}>
              <Text fontSize={30} textAlign={'center'}>
                {text}
              </Text>
              {/* <Text color='#A1A1A1' fontSize={20}>
            {date}
          </Text> */}
            </View>
          </View>
        </Box>
      </Pressable>
    )
  }

  return (
    <VStack
      flex={1}
      space={5}
      alignItems='center'
      justifyContent='space-between'
      bg='#FFFFFF'
      // opacity={staggerOpen ? 0.25 : 1.0}
    >
      <View ml='10' mt='10' mb='-5' alignSelf='flex-start'>
        <IconButton
          onPress={() => navigation.openDrawer()}
          _icon={{
            as: Entypo,
            name: 'menu',
            size: 12,
            color: 'primary',
          }}
        />
      </View>
      <AppLogo imageSize={400} />
      <Heading fontWeight={300} fontSize={50}>
        Welcome!
      </Heading>
      <Text fontWeight={300} fontSize={23}>
        Select the action you would like to perform.
      </Text>
      <View style={[{ opacity: opacity }, styles.recentItemsContainer]}>
        {/* <Text fontWeight={300} fontSize={20} marginBottom={5}>
          Actions
        </Text> */}
        {/* <View style={styles.recentItemsCardRow}>
          {recentItemsCard({
            text: 'Input Turbidity',
          })}
        </View> */}
        <AlertDialog
          title='Action Required: Add Turbidity Values'
          description={`There ${
            visitsRequiringTurbidity.length === 1
              ? 'is 1 program'
              : `are ${visitsRequiringTurbidity.length} programs`
          } missing turbidity values. Please add the missing data to complete your records.`}
          onPress={() => {
            navigation.navigate('Input Turbidity')
            setStaggerOpen(false)
          }}
        />
      </View>

      <BottomNavigation
        navigation={navigation}
        setStaggerOpen={setStaggerOpen}
        staggerOpen={staggerOpen}
      />
    </VStack>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    userCredentialsStore: state.userCredentials,
    visitSetupDefaultState: state.visitSetupDefaults,
    previousTrapVisits:
      state.trapVisitFormPostBundler.previousTrapVisitSubmissions,
  }
}

export default connect(mapStateToProps)(Home)

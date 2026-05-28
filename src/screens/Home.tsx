import React, { useEffect, useRef, useState } from 'react'
import {
  Text,
  VStack,
  Heading,
  View,
  IconButton,
  Box,
  Pressable,
  HStack,
} from 'native-base'
import BottomNavigation from '../components/home/HomeNavButtons'
import { Animated, Easing, StyleSheet } from 'react-native'
import AppLogo from '../components/Shared/AppLogo'
import { Entypo } from '@expo/vector-icons'
import { getVisitSetupDefaults } from '../redux/reducers/visitSetupDefaults'
import { fetchPreviousTrapAndCatch } from '../redux/reducers/postSlices/trapVisitFormPostBundler'
import { RootState, AppDispatch } from '../redux/store'
import { connect, useDispatch, useSelector } from 'react-redux'
import { getUserPrograms } from '../redux/reducers/userCredentialsSlice'
import AlertDialog from '../components/Shared/AlertDialog'
import {
  retrieveTrapVisitsRequiringTurbidity,
  retrieveGeneticSamplesRequiringLabData,
} from '../utils/helpers/helperFunctions'
import { compact } from 'lodash'

const styles = StyleSheet.create({
  actionRequiredContainer: {
    minHeight: 75,
    alignSelf: 'flex-end',
    width: '50%',
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
  previousCatchRecords,
}: {
  navigation: any
  userCredentialsStore: any
  previousTrapVisits: any
  previousCatchRecords: any[]
}) => {
  const [staggerOpen, setStaggerOpen] = useState(false as boolean)
  const [opacity, setOpacity] = useState(1 as number)
  const [visitsRequiringTurbidity, setVisitsRequiringTurbidity] = useState(
    [] as any[]
  )
  const [geneticsRequiringLabData, setGeneticsRequiringLabData] = useState(
    [] as any[]
  )
  const dispatch = useDispatch<AppDispatch>()

  const connectivityState = useSelector((state: any) => state.connectivity)
  const fetchStatus = useSelector(
    (state: RootState) => state.trapVisitFormPostBundler.fetchStatus
  )
  const isLoading =
    fetchStatus === 'initial-state' || fetchStatus === 'fetch-pending'

  const spinValue = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
  }, [])
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  })

  useEffect(() => {
    setVisitsRequiringTurbidity(
      retrieveTrapVisitsRequiringTurbidity(previousTrapVisits)
    )
  }, [previousTrapVisits])

  useEffect(() => {
    setGeneticsRequiringLabData(
      retrieveGeneticSamplesRequiringLabData(previousCatchRecords)
    )
  }, [previousCatchRecords])

  useEffect(() => {
    staggerOpen ? setOpacity(0.25) : setOpacity(1)
  }, [staggerOpen])

  useEffect(() => {
    if (
      userCredentialsStore?.id &&
      connectivityState.isConnected &&
      connectivityState.isInternetReachable
    ) {
      try {
        dispatch(getVisitSetupDefaults(userCredentialsStore.id))
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
          dispatch(getUserPrograms(userCredentialsStore?.id))
        } catch (error) {
          console.log('error from home screen: ', error)
        }
      }
    })()
  }, [userCredentialsStore.userPrograms])

  const getCardWidth = () => {
    let count = 0
    if (visitsRequiringTurbidity.length > 0) {
      count += 1
    }
    if (geneticsRequiringLabData.length > 0) {
      count += 1
    }
    return count === 1 ? '100%' : '50%'
  }

  const recentItemsCard = ({ text }: { text: string }) => {
    return (
      <Pressable onPress={() => navigation.navigate('Input Turbidity')}>
        <Box>
          <View style={styles.recentItemsCard}>
            <View style={styles.recentItemsCardTextContainer}>
              <Text fontSize={30} textAlign={'center'}>
                {text}
              </Text>
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
      <HStack style={{ height: 150 }} alignItems='stretch'>
        {visitsRequiringTurbidity.length > 0 && (
          <View
            style={[
              { opacity: opacity },
              styles.actionRequiredContainer,
              { width: getCardWidth(), height: '100%' },
            ]}
          >
            <AlertDialog
              title='Add Turbidity Values'
              description={`There ${
                visitsRequiringTurbidity.length === 1
                  ? 'is 1 trap visit'
                  : `are ${visitsRequiringTurbidity.length} trap visits`
              } missing turbidity. Please add the missing data to complete your records.`}
              onPress={() => {
                navigation.navigate('Input Turbidity')
                setStaggerOpen(false)
              }}
            />
          </View>
        )}
        {geneticsRequiringLabData.length > 0 && (
          <View
            style={[
              { opacity: opacity },
              styles.actionRequiredContainer,
              { width: getCardWidth(), height: '100%' },
            ]}
          >
            <AlertDialog
              title='Add Genetic Sample Data'
              description={`There ${
                geneticsRequiringLabData.length === 1
                  ? 'is 1 genetic sample'
                  : `are ${geneticsRequiringLabData.length} genetic samples`
              } missing lab weight. Please add the missing data to complete your records.`}
              onPress={() => {
                navigation.navigate('Genetics')
                setStaggerOpen(false)
              }}
            />
          </View>
        )}
      </HStack>

      <BottomNavigation
        navigation={navigation}
        setStaggerOpen={setStaggerOpen}
        staggerOpen={staggerOpen}
      />

      {isLoading && (
        <Box
          position='absolute'
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg='rgba(255,255,255,0.85)'
          justifyContent='center'
          alignItems='center'
          zIndex={999}
        >
          <Animated.Image
            source={require('../../assets/data-tackle-spinner.png')}
            style={{
              transform: [{ rotate: spin }],
              width: 300,
              height: 300,
            }}
            alt='loading'
          />
          <Text fontSize='lg' mt={4} color='gray.600'>
            Loading...
          </Text>
        </Box>
      )}
    </VStack>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    userCredentialsStore: state.userCredentials,
    previousTrapVisits:
      state.trapVisitFormPostBundler.previousTrapVisitSubmissions,
    previousCatchRecords:
      state.trapVisitFormPostBundler.previousCatchRawSubmissions,
  }
}

export default connect(mapStateToProps)(Home)

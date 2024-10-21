import React, { useEffect, useState } from 'react'
import { Text, VStack, Heading, View, IconButton } from 'native-base'
import BottomNavigation from '../components/home/HomeNavButtons'
import { StyleSheet } from 'react-native'
import AppLogo from '../components/Shared/AppLogo'
import { Entypo } from '@expo/vector-icons'
import { getVisitSetupDefaults } from '../redux/reducers/visitSetupDefaults'
import { getTrapVisitDropdownValues } from '../redux/reducers/dropdownsSlice'
import { fetchPreviousTrapAndCatch } from '../redux/reducers/postSlices/trapVisitFormPostBundler'
import { RootState, AppDispatch } from '../redux/store'
import { connect, useDispatch } from 'react-redux'
import api from '../api/axiosConfig'
import { saveUserCredentials } from '../redux/reducers/userCredentialsSlice'

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
    height: 200,
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
    flex: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const Home = ({
  navigation,
  userCredentialsStore,
}: {
  navigation: any
  userCredentialsStore: any
}) => {
  const [staggerOpen, setStaggerOpen] = useState(false as boolean)
  const [opacity, setOpacity] = useState(1 as number)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    staggerOpen ? setOpacity(0.25) : setOpacity(1)
  }, [staggerOpen])

  useEffect(() => {
    if (userCredentialsStore?.id) {
      try {
        dispatch(getVisitSetupDefaults(userCredentialsStore.id))
        dispatch(getTrapVisitDropdownValues())
        dispatch(fetchPreviousTrapAndCatch())
      } catch (error) {
        console.log('error from home screen: ', error)
      }
    }
  }, [userCredentialsStore])

  useEffect(() => {
    ;(async () => {
      if (userCredentialsStore?.id && !userCredentialsStore.userPrograms) {
        try {
          dispatch(getVisitSetupDefaults(userCredentialsStore.id))
          dispatch(getTrapVisitDropdownValues())

          const userProgramsResponse = await api.get(
            `program/personnel/${userCredentialsStore.id}`
          )

          dispatch(
            saveUserCredentials({
              ...userCredentialsStore,
              userPrograms: userProgramsResponse.data,
            })
          )
        } catch (error) {
          console.log('error from home screen: ', error)
        }
      }
    })()
  }, [userCredentialsStore.userPrograms])

  const recentItemsCard = ({
    title,
    date,
  }: {
    title: string
    date: string
  }) => {
    return (
      <View style={styles.recentItemsCard}>
        <View style={styles.recentItemsCardPreviewContainer}></View>
        <View style={styles.recentItemsCardTextContainer}>
          <Text fontSize={19} maxWidth={150}>
            {title}
          </Text>
          <Text color='#A1A1A1'>{date}</Text>
        </View>
      </View>
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
      {/* <View style={[{ opacity: opacity }, styles.recentItemsContainer]}>
        <Text fontWeight={300} fontSize={20} marginBottom={5}>
          Recent Items
        </Text>
        <View style={styles.recentItemsCardRow}>
          {recentItemsCard({ title: 'Trap Visit Data Entry', date: '7/21/22' })}
          {recentItemsCard({ title: 'Report', date: '7/22/22' })}
          {recentItemsCard({ title: 'Quality Control', date: '7/24/22' })}
        </View>
      </View> */}

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
  }
}

export default connect(mapStateToProps)(Home)

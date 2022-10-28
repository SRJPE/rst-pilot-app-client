import React, { useEffect, useState } from 'react'
import { Text, VStack, CircleIcon, Heading, View } from 'native-base'
import BottomNavigation from '../../components/home/HomeNavButtons'
import TopIcons from '../../components/home/TopIcons'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  landingContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
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

export default function Home({ navigation }: { navigation: any }) {
  const [staggerOpen, setStaggerOpen] = useState(false as boolean)
  const [opacity, setOpacity] = useState(1 as number)

  useEffect(() => {
    staggerOpen ? setOpacity(0.25) : setOpacity(1)
  }, [staggerOpen])

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
      height='full'
      alignItems='center'
      justifyContent='space-between'
      // opacity={staggerOpen ? 0.25 : 1.0}
    >
      <TopIcons />

      <View style={styles.landingContent}>
        <CircleIcon size='300' color='primary' />
        <Heading fontWeight={300} fontSize={50} marginTop={5}>
          Welcome back, Ryan!
        </Heading>
        <Text fontWeight={300} fontSize={23} marginTop={5}>
          Select the action you would like to perform.
        </Text>
      </View>

      <View style={[{ opacity: opacity }, styles.recentItemsContainer]}>
        <Text fontWeight={300} fontSize={20} marginBottom={5}>
          Recent Items
        </Text>
        <View style={styles.recentItemsCardRow}>
          {recentItemsCard({ title: 'Trap Visit Data Entry', date: '7/21/22' })}
          {recentItemsCard({ title: 'Report', date: '7/22/22' })}
          {recentItemsCard({ title: 'Quality Control', date: '7/24/22' })}
        </View>
      </View>

      <BottomNavigation
        navigation={navigation}
        setStaggerOpen={setStaggerOpen}
        staggerOpen={staggerOpen}
      />
    </VStack>
  )
}

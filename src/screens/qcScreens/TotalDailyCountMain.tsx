import * as React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { SceneMap, TabBar, TabBarProps, TabView } from 'react-native-tab-view'
import CatchFishCountQC from './CatchFishCountQC'
import CatchFishCountByDateQC from './CatchFishCountByDateQC'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import { View as NativeBaseView } from 'native-base'

const initialLayout = { width: Dimensions.get('window').width }

export const TabPanelWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => <View style={styles.tabPanel}>{children}</View>

const TotalDailyCountMain = ({
  navigation,
  route,
}: {
  navigation: any
  route: any
}) => {
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'first', title: 'QC by Species' },
    { key: 'second', title: 'QC by Date' },
  ])

  const sceneMapObj = {
    first: () => <CatchFishCountQC navigation={navigation} route={route} />,
    second: () => (
      <CatchFishCountByDateQC navigation={navigation} route={route} />
    ),
  }

  const renderScene = SceneMap(sceneMapObj)

  const renderTabBar = (props: TabBarProps<any>) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#007C7C' }}
      style={{ backgroundColor: 'white' }}
      // tabStyle={{ color: '#007C7C' }}
    />
  )

  return (
    <>
      <NativeBaseView
        flex={1}
        bg='#fff'
        px='5%'
        py='3%'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <CustomModalHeader
          headerText={'QC Total Daily Count'}
          showHeaderButton={false}
          closeModal={() => navigation.goBack()}
        />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          commonOptions={{ labelStyle: { color: '#007C7C' } }}
        />
      </NativeBaseView>
    </>
  )
}

const styles = StyleSheet.create({
  tabPanel: {
    flex: 1,
    padding: 25,
  },
})

export default TotalDailyCountMain

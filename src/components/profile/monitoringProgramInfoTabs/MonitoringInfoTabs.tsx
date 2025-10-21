import * as React from 'react'
import { Dimensions, StyleSheet, View, Text } from 'react-native'
import { SceneMap, TabBar, TabBarProps, TabView } from 'react-native-tab-view'
import { MonitoringProgram } from '../../../utils/interfaces'
import { BasicInfoTabPanel } from './BasicInfoTabPanel'
import { SpeciesMeasuringRequirementsTabPanel } from './SpeciesMeasuringRequirementsTabPanel'
import { TrappingSitesTabPanel } from './TrappingSitesTabPanel'
import { CrewTabPanel } from './CrewTabPanel'

const initialLayout = { width: Dimensions.get('window').width }

export const TabPanelWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => <View style={styles.tabPanel}>{children}</View>

const MonitoringInfoTabs = ({
  monitoringProgramInfo,
  personnelStore,
  crewMembersStore,
  dropdownValues,
  userCredentialsStore,
}: {
  monitoringProgramInfo: MonitoringProgram | null
  personnelStore: any
  crewMembersStore: any
  dropdownValues: any[]
  userCredentialsStore: any
}) => {
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'first', title: 'Basic Info' },
    { key: 'second', title: 'Trapping Sites' },
    { key: 'third', title: 'Crew' },
    { key: 'fourth', title: 'Fish Measure Protocol' },
  ])

  const sceneMapObj = {
    first: () => (
      <BasicInfoTabPanel monitoringProgramInfo={monitoringProgramInfo} />
    ),
    second: () => (
      <TrappingSitesTabPanel monitoringProgramInfo={monitoringProgramInfo} />
    ),
    third: () => (
      <CrewTabPanel
        monitoringProgramInfo={monitoringProgramInfo}
        personnelStore={personnelStore}
        crewMembersStore={crewMembersStore}
        dropdownValues={dropdownValues}
        userCredentialsStore={userCredentialsStore}
      />
    ),
    fourth: () => (
      <SpeciesMeasuringRequirementsTabPanel
        monitoringProgramInfo={monitoringProgramInfo}
      />
    ),
  }

  const renderScene = SceneMap(sceneMapObj)

  const renderTabBar = (props: TabBarProps<any>) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#007C7C' }}
      style={{ backgroundColor: 'white' }}
      // labelStyle={{ color: '#007C7C' }}
      activeColor={'#007C7C'}
      inactiveColor={'gray'}
    />
  )

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  )
}

const styles = StyleSheet.create({
  tabPanel: {
    flex: 1,
    padding: 25,
  },
})

export default MonitoringInfoTabs

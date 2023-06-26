import { createStackNavigator } from "@react-navigation/stack"
import QCMain from "../screens/qcScreens/QCMain"
import ProgramQC from "../screens/qcScreens/ProgramQC"
import TrapQC from "../screens/qcScreens/TrapQC"
import CatchMeasureQC from "../screens/qcScreens/CatchMeasureQC"
import CatchCategoricalQC from "../screens/qcScreens/CatchCategoricalQC"
import CatchFishCountQC from "../screens/qcScreens/CatchFishCountQC"
import PartialRecordsQC from "../screens/qcScreens/PartialRecordsQc"
import EfficiencyQC from "../screens/qcScreens/EfficiencyQC"

const DataQualityControl = createStackNavigator()

export default function QCNavigation() {
  return (
    <DataQualityControl.Navigator
      initialRouteName='Select Program to QC'
      screenOptions={{ headerShown: false }}
    >
      <DataQualityControl.Screen
        name='Select Program to QC'
        component={ProgramQC}
      />
      <DataQualityControl.Screen name='Select Data to QC' component={QCMain} />
      <DataQualityControl.Screen name='Trap QC' component={TrapQC} />
      <DataQualityControl.Screen
        name='CatchMeasureQC'
        component={CatchMeasureQC}
      />
      <DataQualityControl.Screen
        name='CatchCategoricalQC'
        component={CatchCategoricalQC}
      />
      <DataQualityControl.Screen
        name='CatchFishCountQC'
        component={CatchFishCountQC}
      />
      <DataQualityControl.Screen
        name='PartialRecordsQC'
        component={PartialRecordsQC}
      />
      <DataQualityControl.Screen name='EfficiencyQC' component={EfficiencyQC} />
    </DataQualityControl.Navigator>
  )
}

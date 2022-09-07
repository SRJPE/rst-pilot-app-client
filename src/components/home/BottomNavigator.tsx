import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { View, Text, TouchableOpacity } from 'react-native'
import TrapVisitForm from '../TrapVisitForm/FormContainer/TrapVisitForm'
import GenerateReport from '../GenerateReport/GenerateReport'
import DataQualityControl from '../QCData/DataQualityControl'

function MyTabBar({
  state,
  descriptors,
  navigation,
}: {
  state: any
  descriptors: any
  navigation: any
}) {
  console.log('🚀 ~ navigation', navigation)
  console.log('🚀 ~ state', state)
  console.log('🚀 ~ descriptors', descriptors)
  console.log('🚀 ~ state.routes', state.routes)

  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map(({ route, index }: { route: any; index: any }) => {
        console.log('🚀 ~ {state.routes.map ~ route.key', route)
        if (!route) return
        const { options } = descriptors[route?.key]
        console.log('🚀 ~ {state.routes.map ~ options', options)
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true })
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <TouchableOpacity
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const Tab = createBottomTabNavigator()

export default function BottomNavigator() {
  return (
    // <Tab.Navigator>
    //   <Tab.Screen name='QCData' component={DataQualityControl} />
    //   <Tab.Screen name='TrapVisitForm' component={TrapVisitForm} />
    //   <Tab.Screen name='GenerateReport' component={GenerateReport} />
    // </Tab.Navigator>

    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      initialRouteName='Feed'
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name='Data Quality Control'
        component={DataQualityControl}
        options={{
          tabBarLabel: 'QC Data',
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name='home' color={color} size={size} />
          // ),
        }}
      />
      <Tab.Screen
        name='Trap Visit Form'
        component={TrapVisitForm}
        options={{
          tabBarLabel: 'Collect Data',
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name='bell' color={color} size={size} />
          // ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name='Generate Report'
        component={GenerateReport}
        options={{
          tabBarLabel: 'Generate Report',
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name='account' color={color} size={size} />
          // ),
        }}
      />
    </Tab.Navigator>
  )
}

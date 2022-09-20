import React, { useCallback } from 'react'
import { Button, HStack, Flex, CircleIcon } from 'native-base'
import { StyleSheet, Text, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 150,
    borderRadius: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    marginTop: 10,
  },
  centeredColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBackground: {
    backgroundColor: '#263238',
    width: 75,
    height: 75,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default function BottomNavigation({ navigation }: { navigation: any }) {
  const handlePressQCData = useCallback(() => {
    navigation.navigate('Data Quality Control')
  }, [navigation])
  const handlePressTrapVisit = useCallback(() => {
    navigation.navigate('Trap Visit Form')
  }, [navigation])
  const handlePressGenerateReport = useCallback(() => {
    navigation.navigate('Generate Report')
  }, [navigation])

  return (
    <Flex align='center'>
      <HStack space={0.5}>
        <Button
          variant='solid'
          bg='primary'
          onPress={handlePressQCData}
          style={styles.button}
        >
          <View style={styles.centeredColumn}>
            <View style={styles.buttonBackground}>
              <MaterialIcons name='timeline' size={50} color='white' />
            </View>
            <Text style={styles.buttonText}>QC Data</Text>
          </View>
        </Button>
        <Button
          variant='solid'
          bg='primary'
          onPress={handlePressTrapVisit}
          style={styles.button}
        >
          <View style={styles.centeredColumn}>
            <View style={styles.buttonBackground}>
              <Entypo name='plus' size={50} color='white' />
            </View>
            <Text style={styles.buttonText}>Collect Data</Text>
          </View>
        </Button>
        <Button
          variant='solid'
          bg='primary'
          onPress={handlePressGenerateReport}
          style={styles.button}
        >
          <View style={styles.centeredColumn}>
            <View style={styles.buttonBackground}>
              <MaterialCommunityIcons
                name='clipboard-text'
                size={50}
                color='white'
              />
            </View>
            <Text style={styles.buttonText}>Generate Report</Text>
          </View>
        </Button>
      </HStack>
    </Flex>
  )
}

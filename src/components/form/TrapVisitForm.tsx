import React from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(218, 218, 218, 0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    // display: 'flex',
    // backgroundColor: 'purple',
    alignItems: 'flex-start',
  },
  navButton: {
    // top: 460,
    // backgroundColor: '#007C7C',
    height: 40,
    width: 160,
    margin: 12,
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },

  nextButton: {
    color: '#FFFFFF',
    backgroundColor: '#007C7C',
    textAlign: 'center',
  },
  backButton: {
    color: '#007C7C',
    backgroundColor: '#D1E8F0',
    textAlign: 'center',
  },

  navContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
})

export default function TrapVisitForm() {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Text>Progress Bar</Text>
      </View>
      <Text>Trap Visit Form</Text>
      <View style={styles.navContainer}>
        <TouchableHighlight
          onPress={() =>
            Alert.prompt('Login Attempted', '', text =>
              console.log('test: ', text)
            )
          }
        >
          <View style={[styles.navButton, styles.backButton]}>
            <Text style={styles.backButton}>Back</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() =>
            Alert.prompt('Login Attempted', '', text =>
              console.log('test: ', text)
            )
          }
        >
          <View style={[styles.navButton, styles.nextButton]}>
            <Text style={styles.nextButton}>Next</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  )
}

// function DetailsScreen({ navigation }: { navigation: any }) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Details Screen</Text>
//       <Button
//         title='Go to Details... again'
//         onPress={() => navigation.push('Details')}
//       />
//       <Button title='Go to Home' onPress={() => navigation.navigate('Home')} />
//       <Button title='Go back' onPress={() => navigation.goBack()} />
//       <Button
//         title='Go back to first screen in stack'
//         onPress={() => navigation.popToTop()}
//       />
//     </View>
//   )
// }

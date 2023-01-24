import React, { useState } from 'react'
import { Button, Divider, Icon, ScrollView, Text, View } from 'native-base'
import { RootState } from '../redux/store'
import { connect } from 'react-redux'
import { startCase } from 'lodash'
import { Ionicons } from '@expo/vector-icons'

const mapStateToProps = (state: RootState) => {
  return {
    addGeneticSamples: state.addGeneticSamples,
    addMarksOrTags: state.addMarksOrTags,
    connectivity: state.connectivity,
    dropdowns: state.dropdowns,
    fishInput: state.fishInput,
    fishProcessing: state.fishProcessing,
    markRecaptureNavigation: state.markRecaptureNavigation,
    navigation: state.navigation,
    paperEntry: state.paperEntry,
    releaseTrial: state.releaseTrial,
    slideAlert: state.slideAlert,
    trapPostProcessing: state.trapPostProcessing,
    trapStatus: state.trapStatus,
    trapVisitFormPostBundler: state.trapVisitFormPostBundler,
    visitSetup: state.visitSetup,
    visitSetupDefaults: state.visitSetupDefaults,
  }
}
interface DebugPropsI {
  addGeneticSamples: any
  addMarksOrTags: any
  connectivity: any
  dropdowns: any
  fishInput: any
  fishProcessing: any
  markRecaptureNavigation: any
  navigation: any
  paperEntry: any
  releaseTrial: any
  slideAlert: any
  trapPostProcessing: any
  trapStatus: any
  trapVisitFormPostBundler: any
  visitSetup: any
  visitSetupDefaults: any
}

interface RowComponentI {
  name:
    | 'addGeneticSamples'
    | 'addMarksOrTags'
    | 'connectivity'
    | 'dropdowns'
    | 'fishInput'
    | 'fishProcessing'
    | 'markRecaptureNavigation'
    | 'navigation'
    | 'paperEntry'
    | 'releaseTrial'
    | 'slideAlert'
    | 'trapPostProcessing'
    | 'trapStatus'
    | 'trapVisitFormPostBundler'
    | 'visitSetup'
    | 'visitSetupDefaults'
  marginBottom?: string
}

const Debug = (props: DebugPropsI) => {
  const [logState, setLogState] = useState({
    addGeneticSamples: '',
    addMarksOrTags: '',
    connectivity: '',
    dropdowns: '',
    fishInput: '',
    fishProcessing: '',
    markRecaptureNavigation: '',
    navigation: '',
    paperEntry: '',
    releaseTrial: '',
    slideAlert: '',
    trapPostProcessing: '',
    trapStatus: '',
    trapVisitFormPostBundler: '',
    visitSetup: '',
    visitSetupDefaults: '',
  })

  const networkingSlicesToStatusKey = {
    dropdowns: 'status',
    trapVisitFormPostBundler: 'submissionStatus',
    visitSetupDefaults: 'status',
  }

  const rowComponent = ({ name, marginBottom }: RowComponentI) => {
    let showErrorIcon = false
    if (Object.keys(networkingSlicesToStatusKey).includes(name)) {
      let idx = name as keyof typeof networkingSlicesToStatusKey
      let status = props[name][networkingSlicesToStatusKey[idx]]
      if (status.includes('rejected') || status.includes('failed')) {
        showErrorIcon = true
      }
    }

    return (
      <View flexDirection={'column'} marginBottom={marginBottom} key={name}>
        <View flexDirection={'row'} alignItems='center'>
          {showErrorIcon && (
            <Icon
              as={Ionicons}
              name='warning'
              size={'2xl'}
              marginRight='3'
              color={'red.400'}
              display={logState[name] ? 'none' : 'flex'}
            />
          )}
          <Text
            fontSize={'2xl'}
            color='white'
            shadow={'7'}
            display={logState[name] ? 'none' : 'flex'}
          >
            {startCase(name)}:
          </Text>
          <View
            flex={1}
            bgColor='#121212'
            marginX={'5'}
            height='90%'
            shadow={'7'}
            padding='5'
            maxH={'500px'}
          >
            <ScrollView>
              <Text color={'white'} fontSize='xl'>
                {logState[name]}
              </Text>
            </ScrollView>
          </View>
          <View>
            <Text
              fontSize={'2xl'}
              color='white'
              shadow={'7'}
              marginBottom='5'
              maxW={'200px'}
              display={logState[name] ? 'flex' : 'none'}
            >
              {startCase(name)}
            </Text>
            <Button
              bgColor='#121212'
              shadow={'7'}
              onPress={() => {
                logState[name]
                  ? setLogState({
                      ...logState,
                      [name]: '',
                    })
                  : setLogState({
                      ...logState,
                      [name]: JSON.stringify(props[name]),
                    })
              }}
            >
              <Text fontSize={'2xl'} color='white'>
                {logState[name] ? 'Clear' : 'Log'}
              </Text>
            </Button>
          </View>
        </View>
        <Divider marginTop={'5'} />
      </View>
    )
  }

  return (
    <View flex={1} alignItems='center' bgColor={'#121212'} paddingX='10'>
      <Text fontSize='4xl' color={'white'} marginTop='10'>
        Developer Window
      </Text>
      <Divider marginTop={'10'} />

      <ScrollView
        flex={1}
        height='100%'
        width='100%'
        marginY={'10'}
        padding={'10'}
        alignSelf='stretch'
        backgroundColor='#292929'
      >
        {Object.keys(logState).map((key) =>
          rowComponent({ name: key as any, marginBottom: '10' })
        )}
      </ScrollView>
    </View>
  )
}

export default connect(mapStateToProps)(Debug)

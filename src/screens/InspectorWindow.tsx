import React, { useState, useEffect } from 'react'
import { Button, Divider, Icon, ScrollView, Text, View } from 'native-base'
import { AppDispatch, RootState, persistor } from '../redux/store'
import { connect, useDispatch } from 'react-redux'
import { startCase } from 'lodash'
import * as Clipboard from 'expo-clipboard'

const mapStateToProps = (state: RootState) => {
  return {
    addGeneticSamples: state.addGeneticSamples,
    addMarksOrTags: state.addMarksOrTags,
    connectivity: state.connectivity,
    dropdowns: state.dropdowns,
    fishInput: state.fishInput,
    fishProcessing: state.fishProcessing,
    markRecaptureNavigation: state.markRecaptureNavigation,
    markRecaptureFormPostBundler: state.markRecaptureFormPostBundler,
    navigation: state.navigation,
    paperEntry: state.paperEntry,
    releaseTrial: state.releaseTrial,
    slideAlert: state.slideAlert,
    trapPostProcessing: state.trapPostProcessing,
    trapVisitFormPostBundler: state.trapVisitFormPostBundler,
    visitSetup: state.visitSetup,
    visitSetupDefaults: state.visitSetupDefaults,
  }
}

interface DebugPropsI {
  navigation?: any
  addGeneticSamples?: any
  addMarksOrTags?: any
  connectivity?: any
  dropdowns?: any
  fishInput?: any
  fishProcessing?: any
  markRecaptureNavigation?: any
  markRecaptureFormPostBundler?: any
  paperEntry?: any
  releaseTrial?: any
  slideAlert?: any
  trapPostProcessing?: any
  trapVisitFormPostBundler?: any
  visitSetup?: any
  visitSetupDefaults?: any
}

interface RowComponentI {
  name:
    | 'trapVisitFormPostBundler'
    | 'addGeneticSamples'
    | 'addMarksOrTags'
    | 'connectivity'
    | 'dropdowns'
    | 'fishInput'
    | 'fishProcessing'
    | 'markRecaptureFormPostBundler'
    | 'markRecaptureNavigation'
    | 'paperEntry'
    | 'releaseTrial'
    | 'slideAlert'
    | 'trapPostProcessing'
    | 'visitSetup'
    | 'visitSetupDefaults'
  marginBottom?: string
}

const Debug = (props: DebugPropsI) => {
  const dispatch = useDispatch<AppDispatch>()
  const [logState, setLogState] = useState({
    addGeneticSamples: '',
    addMarksOrTags: '',
    connectivity: '',
    dropdowns: '',
    fishInput: '',
    fishProcessing: '',
    markRecaptureNavigation: '',
    markRecaptureFormPostBundler: '',
    navigation: '',
    paperEntry: '',
    releaseTrial: '',
    slideAlert: '',
    trapPostProcessing: '',
    trapVisitFormPostBundler: '',
    visitSetup: '',
    visitSetupDefaults: '',
  })

  const rowComponent = ({ name, marginBottom }: RowComponentI) => {
    const messageBuilder = () => {
      if (name === 'trapVisitFormPostBundler') {
        logState[name]
          ? setLogState({
              ...logState,
              ['trapVisitFormPostBundler']: '',
            })
          : setLogState({
              ...logState,
              ['trapVisitFormPostBundler']: `fetch status: ${props[name]['fetchStatus']}. submission status: ${props[name]['submissionStatus']}. previous trap visit submissions length: ${props[name]['previousTrapVisitSubmissions'].length}. previous catch raw submissions: ${props[name]['previousCatchRawSubmissions'].length}. pending trap visit submissions: ${props[name]['trapVisitSubmissions'].length}. pending catch raw submissions: ${props[name]['catchRawSubmissions'].length}. pending QC trap visit submissions: ${props[name]['qcTrapVisitSubmissions'].length}. pending QC catch raw submissions: ${props[name]['qcCatchRawSubmissions'].length}`,
            })
      } else {
        logState[name]
          ? setLogState({
              ...logState,
              [name]: '',
            })
          : setLogState({
              ...logState,
              [name]: JSON.stringify(props[name]),
            })
      }
    }

    return (
      <View flexDirection={'column'} marginBottom={marginBottom} key={name}>
        <View flexDirection={'row'} alignItems='center'>
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
              <Text
                color={'white'}
                fontSize='xl'
                onPress={() => Clipboard.setStringAsync(logState[name])}
              >
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
              onPress={() => messageBuilder()}
            >
              <Text fontSize={'2xl'} color='white'>
                {logState[name] ? 'Close' : 'Log'}
              </Text>
            </Button>
          </View>
        </View>
        {logState[name] && name === 'trapVisitFormPostBundler' && (
          <Button
            bgColor='#FF5B5B'
            shadow={'7'}
            onPress={() => {
              persistor.purge()
              setLogState({
                ...logState,
                ['trapVisitFormPostBundler']: '',
              })
            }}
            style={{ marginTop: 10, marginHorizontal: 10 }}
          >
            <Text fontSize={'2xl'} color='white'>
              Reset
            </Text>
          </Button>
        )}
        {logState[name] && name === 'markRecaptureFormPostBundler' && (
          <Button
            bgColor='#FF5B5B'
            shadow={'7'}
            onPress={() => {
              persistor.purge()
              setLogState({
                ...logState,
                ['markRecaptureFormPostBundler']: '',
              })
            }}
            style={{ marginTop: 10, marginHorizontal: 10 }}
          >
            <Text fontSize={'2xl'} color='white'>
              Reset
            </Text>
          </Button>
        )}
        <Divider marginTop={'5'} />
      </View>
    )
  }

  return (
    <View flex={1} alignItems='center' bgColor={'#121212'} paddingX='10'>
      <Text fontSize='4xl' color={'white'} marginTop='10'>
        Inspector
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
        {Object.keys(logState).map(key =>
          rowComponent({ name: key as any, marginBottom: '10' })
        )}
      </ScrollView>
    </View>
  )
}

export default connect(mapStateToProps)(Debug)

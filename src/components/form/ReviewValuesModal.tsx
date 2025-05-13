import React, { useEffect, useState } from 'react'
import { SafeAreaView, Dimensions } from 'react-native'
import CustomModal from '../Shared/CustomModal'
import CustomModalHeader from '../Shared/CustomModalHeader'
import { Text, Button, ScrollView, Divider, HStack, View } from 'native-base'
import { List } from 'react-native-paper'
import { SceneMap, TabBar, TabBarProps, TabView } from 'react-native-tab-view'
import { startCase } from 'lodash'

const initialLayout = { width: Dimensions.get('window').width }

type Props = {
  handleCloseReviewValuesModal: () => void
  formValues: any
  isOpen: boolean
  tabState: any
}
const hiddenFields = ['isWaterTurbidityPresent']

function groupBySpeciesForkLength(data: Array<any>) {
  const result = {} as any
  let totalCount = 0 as number

  Object.values(data).forEach((fish: any) => {
    const { species, forkLength, numFishCaught, run } = fish

    totalCount += Number(numFishCaught)

    if (fish.plusCount) {
      if (!result[`${species} - ${run} Plus Count`]) {
        result[`${species} - ${run} Plus Count`] = Number(numFishCaught)
      } else {
        result[`${species} - ${run} Plus Count`] += Number(numFishCaught)
      }
      return
    }

    if (!result[species]) {
      result[species] = []
    }

    // Add `forkLength` repeated `numFishCaught` times
    for (let i = 0; i < numFishCaught; i++) {
      if (forkLength) {
        result[species].push(forkLength)
      }
    }
  })

  // Sort the result object by its keys alphabetically
  const sortedResult = Object.keys(result)
    .sort()
    .reduce((acc, key) => {
      acc[key] = result[key]
      return acc
    }, {} as any)

  Object.assign(result, sortedResult)

  sortedResult['totalCount'] = totalCount

  return sortedResult
}

const AccordionListItem = ({
  field,
  sectionValues,
  sectionTitle,
}: {
  field: string
  sectionValues: any
  sectionTitle: string
}) => {
  // if unit field, do not show
  if (field.includes('Unit')) return null
  if (hiddenFields.includes(field)) return null

  let fieldName = field
  // if field has a number in it, capitalize
  if (/\d/.test(field)) {
    fieldName = field.toUpperCase()
  } else {
    fieldName = startCase(field)
  }

  let fieldValue = sectionValues[field]

  if (sectionValues[field] instanceof Date) {
    fieldValue = fieldValue.toLocaleString()
  } else if (typeof fieldValue === 'boolean') {
    fieldValue = fieldValue ? 'Yes' : 'No'
  } else if (Array.isArray(sectionValues[field])) {
    if (sectionValues[field].length) {
      fieldValue = fieldValue.join(', ')
      if (sectionTitle === 'Fish Input') {
        fieldValue = `${fieldValue} (Count: ${sectionValues[field].length})`
      }
    }
  }

  return field && fieldValue ? (
    <List.Item
      title={fieldName}
      titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
      style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}
      right={() => (
        <View style={{ width: '50%', alignItems: 'flex-end' }}>
          <Text fontSize={'md'}>
            {fieldValue} {sectionValues[`${field}Unit`] || ''}
          </Text>
        </View>
      )}
    />
  ) : null
}

const AccordionView = ({ tabValues }: { tabValues?: any }) => {
  const filteredTrapOperationsState = {
    ...tabValues.trapOperationsState,
  }
  delete filteredTrapOperationsState.trapVisitStartTime

  const fishInputLookupObj = groupBySpeciesForkLength(tabValues.fishInputState)
  return (
    <ScrollView>
      <List.Accordion title='Visit Setup' titleStyle={{ fontSize: 20 }}>
        <AccordionListItem
          field={'crew'}
          sectionValues={tabValues.visitSetupState}
          sectionTitle='Visit Setup'
        />
        {'dataRecorder' in tabValues.visitSetupState && (
          <AccordionListItem
            field={'dataRecorder'}
            sectionValues={tabValues.visitSetupState}
            sectionTitle='Visit Setup'
          />
        )}
        <Divider width={'97%'} alignSelf={'center'} />
      </List.Accordion>
      <List.Accordion title='Trap Operations' titleStyle={{ fontSize: 20 }}>
        {Object.keys(filteredTrapOperationsState).map(key => {
          return (
            <AccordionListItem
              field={key}
              sectionValues={filteredTrapOperationsState}
              sectionTitle='Trap Operations'
            />
          )
        })}
      </List.Accordion>
      <List.Accordion title='Fish Processing' titleStyle={{ fontSize: 20 }}>
        {Object.keys(tabValues.fishProcessingState).map(key => {
          return (
            <AccordionListItem
              field={key}
              sectionValues={tabValues.fishProcessingState}
              sectionTitle='Fish Processing'
            />
          )
        })}
      </List.Accordion>
      <List.Accordion title='Fish Input' titleStyle={{ fontSize: 20 }}>
        {Object.keys(fishInputLookupObj).map(key => {
          return (
            <AccordionListItem
              field={key}
              sectionValues={fishInputLookupObj}
              sectionTitle='Fish Input'
            />
          )
        })}
      </List.Accordion>
      <List.Accordion
        title='Trap Post-Processing'
        titleStyle={{ fontSize: 20 }}
      >
        {Object.keys(tabValues.trapPostProcessingState).map(key => {
          return (
            <AccordionListItem
              field={key}
              sectionValues={tabValues.trapPostProcessingState}
              sectionTitle='Trap Post-Processing'
            />
          )
        })}
      </List.Accordion>
    </ScrollView>
  )
}

const ReviewValuesModal = ({
  handleCloseReviewValuesModal,
  formValues,
  isOpen,
  tabState,
}: Props) => {
  const [index, setIndex] = useState(0)
  const [routes, setRoutes] = useState(
    [] as Array<{ key: string; title: string }>
  )
  const [sceneMapObj, setSceneMapObj] = useState({}) as any

  useEffect(() => {
    const tabRoutes = Object.keys(tabState.tabs).map((tabId: any) => ({
      key: tabId,
      title: tabState.tabs[tabId].name,
    }))
    setRoutes(tabRoutes)

    const tabScenesMapObj = {} as any
    tabRoutes.forEach((tab: any) => {
      tabScenesMapObj[tab.key] = () => (
        <AccordionView
          tabValues={{
            visitSetupState: formValues?.visitSetupState?.[tab.key]?.values,
            trapOperationsState:
              formValues?.trapOperationsState?.[tab.key]?.values,
            fishProcessingState:
              formValues?.fishProcessingState?.[tab.key]?.values,
            fishInputState: formValues?.fishInputState?.[tab.key]?.fishStore,
            trapPostProcessingState:
              formValues?.trapPostProcessingState?.[tab.key]?.values,
          }}
        />
      )
    })
    setSceneMapObj(tabScenesMapObj)
  }, [tabState, formValues])

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
    <SafeAreaView style={{ height: '100%' }}>
      <CustomModal
        isOpen={isOpen}
        closeModal={handleCloseReviewValuesModal}
        height='full'
      >
        <>
          <CustomModalHeader
            headerText={
              'Review all trap visit form sections and values before submission'
            }
            headerStyle={{ fontSize: 23, fontWeight: '300' }}
            showHeaderButton={false}
            closeModal={handleCloseReviewValuesModal}
          />
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            commonOptions={{ labelStyle: { color: '#007C7C' } }}
          />
          <HStack>
            <Button
              my={5}
              mx='auto'
              minWidth={300}
              bgColor='gray.400'
              onPress={handleCloseReviewValuesModal}
            >
              <Text fontSize='xl' color='white'>
                Close
              </Text>
            </Button>
            <Button
              my={5}
              mx='auto'
              minWidth={300}
              bgColor='primary'
              colorScheme='coolGray'
              onPress={handleCloseReviewValuesModal}
            >
              <Text fontSize='xl' color='white'>
                Export as File
              </Text>
            </Button>
          </HStack>
        </>
      </CustomModal>
    </SafeAreaView>
  )
}

export default ReviewValuesModal

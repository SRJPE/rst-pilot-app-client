import React, { useEffect, useState } from 'react'
import { SafeAreaView, Dimensions } from 'react-native'
import CustomModal from '../Shared/CustomModal'
import CustomModalHeader from '../Shared/CustomModalHeader'
import { Text, Button, ScrollView, Divider } from 'native-base'
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

const AccordionListItem = ({
  field,
  sectionValues,
}: {
  field: string
  sectionValues: any
}) => {
  // if unit field, do not show
  if (field.includes('Unit')) return null

  console.log('sectionValues', sectionValues)
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
  }

  return field && fieldValue ? (
    <List.Item
      title={fieldName}
      titleStyle={{ fontSize: 16 }}
      right={() => (
        <Text fontSize={'md'}>
          {fieldValue} {sectionValues[`${field}Unit`] || ''}
        </Text>
      )}
    />
  ) : null
}

const AccordionView = ({ tabValues }: { tabValues?: any }) => {
  return (
    <ScrollView>
      <List.Accordion title='Visit Setup' titleStyle={{ fontSize: 20 }}>
        <AccordionListItem
          field={'crew'}
          sectionValues={tabValues.visitSetupState}
        />
        {'dataRecorder' in tabValues.visitSetupState && (
          <AccordionListItem
            field={'dataRecorder'}
            sectionValues={tabValues.visitSetupState}
          />
        )}
        <Divider width={'97%'} alignSelf={'center'} />
      </List.Accordion>
      <List.Accordion title='Trap Operations' titleStyle={{ fontSize: 20 }}>
        {Object.keys(tabValues.trapOperationsState).map(key => {
          return (
            <AccordionListItem
              field={key}
              sectionValues={tabValues.trapOperationsState}
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
            />
          )
        })}
      </List.Accordion>
      <List.Accordion title='Fish Input' titleStyle={{ fontSize: 20 }}>
        <List.Item title='First item' />
        <List.Item title='Second item' />
      </List.Accordion>
      <List.Accordion
        title='Trap Post-Processing'
        titleStyle={{ fontSize: 20 }}
      >
        <List.Item title='First item' />
        <List.Item title='Second item' />
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
  console.log('formValues', formValues)
  console.log('tabState', tabState)
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

    console.log('tabRoutes', tabRoutes)

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

          <Button
            my={5}
            mx='auto'
            minWidth={300}
            bgColor='primary'
            onPress={handleCloseReviewValuesModal}
          >
            <Text fontSize='xl' color='white'>
              Close
            </Text>
          </Button>
        </>
      </CustomModal>
    </SafeAreaView>
  )
}

export default ReviewValuesModal

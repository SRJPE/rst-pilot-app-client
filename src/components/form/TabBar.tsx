import { Ionicons } from '@expo/vector-icons'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { Badge, Box, Icon, ScrollView, HStack, Button, Text } from 'native-base'
import { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { uid } from 'uid'
import {
  createTab,
  deleteTab,
  setActiveTab,
  TabStateI,
  updateErrorCount,
  updateErrorDetails,
} from '../../redux/reducers/formSlices/tabSlice'
import { AppDispatch, RootState } from '../../redux/store'

const TabBar = ({
  headerProps,
  tabSlice,
  trapOperationsSlice,
  fishProcessingSlice,
  trapPostProcessingSlice,
}: {
  headerProps: NativeStackHeaderProps
  tabSlice: TabStateI
  trapOperationsSlice: any
  fishProcessingSlice: any
  trapPostProcessingSlice: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const nonTabBarScreens = [
    'Paper Entry',
    'Add Fish',
    'Batch Count',
    'Incomplete Sections',
  ]
  const formSlicesToValidateDict = {
    'Trap Operations': trapOperationsSlice,
    'Fish Processing': fishProcessingSlice,
    'Trap Post-Processing': trapPostProcessingSlice
  }

  useEffect(() => {
    generateTabErrorsAndCount()
  }, [trapOperationsSlice, fishProcessingSlice, trapPostProcessingSlice])

  const generateTabErrorsAndCount = () => {
    let tabsErrorDetails: any = {}
    let tabsErrorCount: {
      [tabId: string]: number
    } = {}
    const tabIds = Object.keys(tabSlice.tabs)
    const formSliceIds = Object.keys(formSlicesToValidateDict)

    // for each tab ID
    tabIds.forEach((tabId) => {
      tabsErrorDetails[tabId] = {}
      tabsErrorCount[tabId] = 0

      // for each tab's form slices
      formSliceIds.forEach((formSliceId) => {
        let formSlice =
          formSlicesToValidateDict[
            formSliceId as keyof typeof formSlicesToValidateDict
          ]

        if (formSlice[tabId] && formSlice[tabId].errors) {
          tabsErrorDetails[tabId][formSliceId] = formSlice[tabId].errors
          tabsErrorCount[tabId] += Object.keys(formSlice[tabId].errors).length
        }
      })
    })

    Object.keys(tabsErrorCount).forEach((tabId) => {
      dispatch(updateErrorCount({tabId, errorCount: tabsErrorCount[tabId]}))
    })

    Object.keys(tabsErrorDetails).forEach((tabId) => {
      dispatch(updateErrorDetails({tabId, errorDetails: tabsErrorDetails[tabId]}))
    })
  }

  if (
    Object.keys(tabSlice.tabs).length &&
    !nonTabBarScreens.includes(headerProps.route.name)
  ) {
    // show tab bar
    return (
      <Box px={'2%'} pt={'2%'}>
        <ScrollView horizontal={true}>
          <HStack alignItems={'center'} justifyContent='space-between'>
            {Object.keys(tabSlice.tabs).map((tabId) => (
              <>
                <Button
                  size={'lg'}
                  height={'16'}
                  bg={tabId == tabSlice.activeTabId ? 'primary' : 'secondary'}
                  onPress={() => dispatch(setActiveTab(tabId))}
                  key={`button-${tabId}`}
                  mr={5}
                >
                  <HStack alignItems={'center'} justifyContent='space-between'>
                    <Text
                      fontSize='lg'
                      color={
                        tabId == tabSlice.activeTabId ? 'white' : 'primary'
                      }
                    >
                      {tabSlice.tabs[tabId].name}
                    </Text>
                    <Icon
                      onPress={() => dispatch(deleteTab(tabId))}
                      as={Ionicons}
                      name='ios-close-circle'
                      color='#FFF'
                      size={6}
                      margin='0'
                      padding='0'
                      marginLeft={3}
                    />
                  </HStack>
                </Button>
                {(tabSlice.incompleteSectionTouched && tabSlice.tabs[tabId].errorDetails[headerProps.route.name]) ? (
                  <Badge
                    colorScheme='danger'
                    rounded='full'
                    mb={'50px'}
                    ml={-9}
                    mr={3}
                    zIndex={1}
                    variant='solid'
                    alignSelf='flex-end'
                    _text={{
                      fontSize: 16,
                    }}
                    key={`badge-${tabId}`}
                  >
                    {
                      Object.keys(
                        tabSlice.tabs[tabId].errorDetails[
                          headerProps.route.name
                        ]
                      ).length
                    }
                  </Badge>
                ) : (
                  <></>
                )}
              </>
            ))}
            <Icon
              onPress={() => {
                const tabId = uid()
                dispatch(createTab({ tabId, tabName: 'New Tab' }))
                dispatch(setActiveTab(tabId))
                headerProps.navigation.navigate('Trap Visit Form', {
                  screen: 'Visit Setup',
                })
              }}
              as={Ionicons}
              name='ios-add-circle'
              color='primary'
              size={9}
              margin='0'
              padding='0'
            />
          </HStack>
        </ScrollView>
      </Box>
    )
  } else if (
    Object.keys(tabSlice.tabs).length &&
    nonTabBarScreens.includes(headerProps.route.name)
  ) {
    if (
      tabSlice.activeTabId != null &&
      headerProps.route.name == 'Paper Entry'
    ) {
      return <Text ml={5}>{tabSlice.tabs[tabSlice.activeTabId].trapSite}</Text>
    } else if (
      tabSlice.activeTabId != null &&
      headerProps.route.name != 'Incomplete Sections'
    ) {
      return <Text ml={5}>{tabSlice.tabs[tabSlice.activeTabId].name}</Text>
    } else {
      return <></>
    }
  } else {
    // show nothing
    return <></>
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
    trapOperationsSlice: state.trapOperations,
    fishProcessingSlice: state.fishProcessing,
    trapPostProcessingSlice: state.trapPostProcessing
  }
}

export default connect(mapStateToProps)(TabBar)

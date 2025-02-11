import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import {
  Badge,
  Box,
  ScrollView,
  HStack,
  Button,
  Text,
  VStack,
} from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import {
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
  navigationSlice,
}: {
  headerProps: NativeStackHeaderProps
  tabSlice: TabStateI
  trapOperationsSlice: any
  fishProcessingSlice: any
  trapPostProcessingSlice: any
  navigationSlice: any
}) => {
  const { activeStep, steps: navigationSteps } = navigationSlice
  const activePage = navigationSteps[activeStep]?.name

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
    'Trap Post-Processing': trapPostProcessingSlice,
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
    tabIds.forEach(tabId => {
      tabsErrorDetails[tabId] = {}
      tabsErrorCount[tabId] = 0

      // for each tab's form slices
      formSliceIds.forEach(formSliceId => {
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

    Object.keys(tabsErrorCount).forEach(tabId => {
      dispatch(updateErrorCount({ tabId, errorCount: tabsErrorCount[tabId] }))
    })

    Object.keys(tabsErrorDetails).forEach(tabId => {
      dispatch(
        updateErrorDetails({ tabId, errorDetails: tabsErrorDetails[tabId] })
      )
    })
  }

  //TODO: set default active tab
  //Currently receiving error if this function runs:
  //hit load error,  [Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.]
  const setDefaultActiveTab = (defaultTabDisabled: boolean) => {
    if (!defaultTabDisabled) {
      return
    }

    const fishProcessingResults = Object.entries(fishProcessingSlice).map(
      resultEntry => ({
        tabId: resultEntry[0],
        //@ts-ignore, this is a valid key
        fishProcessingResult: resultEntry[1].values.fishProcessedResult,
      })
    )

    const fishInputDefaultTabId = fishProcessingResults.find(
      result => result.fishProcessingResult === 'processed fish'
    )

    dispatch(setActiveTab(fishInputDefaultTabId))
  }

  if (
    Object.keys(tabSlice.tabs).length &&
    !nonTabBarScreens.includes(headerProps.route.name)
  ) {
    // show tab bar
    return (
      <Box px={'2%'} pt={'2%'}>
        <VStack>
          <ScrollView horizontal={true} width={'full'}>
            <HStack
              alignItems={'top'}
              justifyContent='space-between'
              w={'full'}
            >
              {Object.keys(tabSlice.tabs).map(tabId => {
                //if activepage is Fish Input and and fishProcessingSlice[tabSlice.activeTabId].values.fishProcessedResult is "no fish caught" disable button
                const isFishInputPage = activePage === 'Fish Input'
                const isNoFishCaught =
                  fishProcessingSlice[tabId]?.values?.fishProcessedResult ===
                  'no fish caught'
                const disableTabOnFishInput = isFishInputPage && isNoFishCaught

                // setDefaultActiveTab(disableTabOnFishInput)

                return (
                  <Box key={`button-${tabId}`}>
                    <Button
                      size={'lg'}
                      height={'16'}
                      bg={
                        disableTabOnFishInput
                          ? 'gray.300'
                          : tabId == tabSlice.activeTabId
                          ? 'primary'
                          : 'secondary'
                      }
                      onPress={() => dispatch(setActiveTab(tabId))}
                      mr={5}
                      disabled={disableTabOnFishInput}
                    >
                      <HStack
                        alignItems={'center'}
                        justifyContent='space-between'
                      >
                        <Text
                          fontSize='lg'
                          color={
                            disableTabOnFishInput
                              ? 'gray.800'
                              : tabId == tabSlice.activeTabId
                              ? 'white'
                              : 'primary'
                          }
                        >
                          {tabSlice.tabs[tabId].name}
                        </Text>
                      </HStack>
                    </Button>
                    {tabSlice.incompleteSectionTouched &&
                    tabSlice.tabs[tabId].errorDetails[headerProps.route.name] &&
                    Object.keys(
                      tabSlice.tabs[tabId].errorDetails[headerProps.route.name]
                    ).length ? (
                      <Badge
                        colorScheme='danger'
                        rounded='full'
                        mr={2}
                        mt={-3}
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
                  </Box>
                )
              })}
            </HStack>
          </ScrollView>
          {Object.keys(tabSlice.tabs).length > 1 && (
            <Text fontSize={'lg'} color={'black'} fontWeight={'light'} mt={'2'}>
              Please enter information for remaining tabs, if applicable, before
              proceeding to the next level
            </Text>
          )}
        </VStack>
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
    trapPostProcessingSlice: state.trapPostProcessing,
    navigationSlice: state.navigation,
  }
}

export default connect(mapStateToProps)(TabBar)

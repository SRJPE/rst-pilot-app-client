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

  useEffect(() => {
    if (tabSlice.activeTabId) {
      // no fish caught - the form ends
      // 'no catch data, fish left in live box' || 'no catch data, fish released' still goes to Trap Post-Processing'

      // ensure if disabling tabs that entire trap visit values are still being saved correctly on form save

      const isDisabledPage = ['Fish Input'].includes(activePage)

      const isNoFishCaught = ['not recorded', 'no fish caught'].includes(
        fishProcessingSlice[tabSlice?.activeTabId]?.values?.fishProcessedResult
      )

      const disableTabOnFishInput = isDisabledPage && isNoFishCaught

      if (disableTabOnFishInput) {
        setDefaultActiveTab(disableTabOnFishInput)
      }
    }
  }, [tabSlice.activeTabId, activePage])

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

    dispatch(setActiveTab(fishInputDefaultTabId?.tabId))
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
                const isDisabledPage = ['Fish Input'].includes(activePage)

                const isNoFishCaught = [
                  'not recorded',
                  'no fish caught',
                ].includes(
                  fishProcessingSlice[tabId]?.values?.fishProcessedResult
                )
                const disableTabOnActivePage = isDisabledPage && isNoFishCaught
                // setDefaultActiveTab(disableTabOnFishInput)

                return (
                  <Box key={`button-${tabId}`}>
                    <Button
                      size={'lg'}
                      height={'16'}
                      bg={
                        disableTabOnActivePage
                          ? 'gray.300'
                          : tabId == tabSlice.activeTabId
                          ? 'primary'
                          : 'secondary'
                      }
                      onPress={() => dispatch(setActiveTab(tabId))}
                      mr={5}
                      disabled={disableTabOnActivePage}
                    >
                      <HStack
                        alignItems={'center'}
                        justifyContent='space-between'
                      >
                        <Text
                          fontSize='lg'
                          color={
                            disableTabOnActivePage
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

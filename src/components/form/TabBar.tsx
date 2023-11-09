import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { Badge, Box, ScrollView, HStack, Button, Text, VStack } from 'native-base'
import { useEffect, useState } from 'react'
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
      dispatch(updateErrorCount({ tabId, errorCount: tabsErrorCount[tabId] }))
    })

    Object.keys(tabsErrorDetails).forEach((tabId) => {
      dispatch(
        updateErrorDetails({ tabId, errorDetails: tabsErrorDetails[tabId] })
      )
    })
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
              alignItems={'center'}
              justifyContent='space-between'
              w={'full'}
            >
              {Object.keys(tabSlice.tabs).map((tabId) => (
                <Box key={`button-${tabId}`}>
                  <Button
                    size={'lg'}
                    height={'16'}
                    bg={tabId == tabSlice.activeTabId ? 'primary' : 'secondary'}
                    onPress={() => dispatch(setActiveTab(tabId))}
                    mr={5}
                  >
                    <HStack
                      alignItems={'center'}
                      justifyContent='space-between'
                    >
                      <Text
                        fontSize='lg'
                        color={
                          tabId == tabSlice.activeTabId ? 'white' : 'primary'
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
              ))}
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
  }
}

export default connect(mapStateToProps)(TabBar)

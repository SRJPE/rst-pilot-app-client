import React from 'react'
import {
  Box,
  Button,
  Heading,
  HStack,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import {
  PendingVisitDraftI,
  removeDraftForTab,
} from '../redux/reducers/formSlices/pendingVisitDraftsSlice'
import { createTab, setActiveTab } from '../redux/reducers/formSlices/tabSlice'
import { restoreTabState as restoreVisitSetupTab } from '../redux/reducers/formSlices/visitSetupSlice'
import { restoreTabState as restoreTrapOperationsTab } from '../redux/reducers/formSlices/trapOperationsSlice'
import { restoreTabState as restoreFishProcessingTab } from '../redux/reducers/formSlices/fishProcessingSlice'
import { restoreTabState as restoreTrapPostProcessingTab } from '../redux/reducers/formSlices/trapPostProcessingSlice'
import { restoreTabState as restoreFishInputTab } from '../redux/reducers/formSlices/fishInputSlice'
import {
  checkIfFormIsComplete,
  markStepCompleted,
  updateActiveStep,
} from '../redux/reducers/formSlices/navigationSlice'

const mapStateToProps = (state: RootState) => {
  return {
    pendingVisitDraftsState: state.pendingVisitDrafts,
  }
}

const PendingTrapVisits = ({
  navigation,
  pendingVisitDraftsState,
}: {
  navigation: any
  pendingVisitDraftsState: { [tabId: string]: PendingVisitDraftI }
}) => {
  const dispatch = useDispatch<AppDispatch>()
  // redux-persist injects a `_persist` metadata key at the top level of this
  // slice's state (since it's a bare { [tabId]: draft } map with no wrapper) —
  // filter it out so it's never mistaken for a real draft.
  const drafts = Object.entries(pendingVisitDraftsState || {})
    .filter(([tabId]) => tabId !== '_persist')
    .map(([, draft]) => draft as PendingVisitDraftI)
    .sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

  const handleResume = (draft: PendingVisitDraftI) => {
    dispatch(
      createTab({
        tabId: draft.tabId,
        tabName: draft.tabName,
        trapSite: draft.trapSite,
      })
    )
    dispatch(setActiveTab(draft.tabId))

    if (draft.visitSetupTab) {
      dispatch(
        restoreVisitSetupTab({
          tabId: draft.tabId,
          tabState: draft.visitSetupTab,
        })
      )
    }
    if (draft.trapOperationsTab) {
      dispatch(
        restoreTrapOperationsTab({
          tabId: draft.tabId,
          tabState: draft.trapOperationsTab,
        })
      )
    }
    if (draft.fishProcessingTab) {
      dispatch(
        restoreFishProcessingTab({
          tabId: draft.tabId,
          tabState: draft.fishProcessingTab,
        })
      )
    }
    if (draft.trapPostProcessingTab) {
      dispatch(
        restoreTrapPostProcessingTab({
          tabId: draft.tabId,
          tabState: draft.trapPostProcessingTab,
        })
      )
    }
    if (draft.fishInputTab) {
      dispatch(
        restoreFishInputTab({
          tabId: draft.tabId,
          tabState: draft.fishInputTab,
        })
      )
    }

    // The visit was already deemed submit-ready once — mark the wizard's
    // first 5 steps complete and land on Incomplete Sections, matching the
    // review-screen state it was in right before it was originally submitted.
    ;[
      'visitSetup',
      'trapOperations',
      'fishProcessing',
      'fishInput',
      'trapPostProcessing',
    ].forEach(propName => {
      dispatch(markStepCompleted({ propName }))
    })
    dispatch(checkIfFormIsComplete())
    dispatch(updateActiveStep(6))

    navigation.navigate('Trap Visit Form', { screen: 'Incomplete Sections' })
  }

  const handleDiscard = (tabId: string) => {
    dispatch(removeDraftForTab(tabId))
  }

  return (
    <ScrollView bg='#fff' px='5%' py='3%'>
      <Heading mb='2'>Pending Trap Visits</Heading>
      <Text mb='4' color='gray.600'>
        Trap visits that haven't been uploaded to the database yet - saved
        locally while offline, or a submission that failed. Resume one to
        review, fix, and resave it.
      </Text>
      {drafts.length === 0 && (
        <Text color='gray.500'>No pending trap visits.</Text>
      )}
      <VStack space={4}>
        {drafts.map(draft => (
          <Box
            key={draft.tabId}
            borderWidth={1}
            borderColor='coolGray.200'
            borderRadius={8}
            p={4}
          >
            <HStack justifyContent='space-between' alignItems='center'>
              <VStack>
                <Text bold fontSize='lg'>
                  {draft.tabName || draft.trapSite}
                </Text>
                <Text color='gray.600'>{draft.trapSite}</Text>
                <Text color='gray.500' fontSize='sm'>
                  {draft.timestamp
                    ? new Date(draft.timestamp).toLocaleString()
                    : ''}
                </Text>
              </VStack>
              <HStack space={3}>
                <Button
                  bg='gray.400'
                  onPress={() => handleDiscard(draft.tabId)}
                >
                  <Text color='white'>Discard</Text>
                </Button>
                <Button bg='primary' onPress={() => handleResume(draft)}>
                  <Text color='white'>Resume</Text>
                </Button>
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </ScrollView>
  )
}

export default connect(mapStateToProps)(PendingTrapVisits)

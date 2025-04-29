import {
  Box,
  Button,
  HStack,
  Input,
  Popover,
  Text,
  FormControl,
  View,
  VStack,
} from 'native-base'
import { RootState } from '../../redux/store'
import { connect } from 'react-redux'
import { retrieveTrapVisitsRequiringTurbidity } from '../../utils/helpers/helperFunctions'
import type { TrapVisitResponse } from '../../utils/interfaces'
import type { InitialStateI } from '../../redux/reducers/visitSetupDefaults'

import { DataTable } from 'react-native-paper'

function InputTurbidity({
  navigation,
  userCredentialsStore,
  previousTrapVisits,
  visitSetupDefaultState,
}: {
  navigation: any
  userCredentialsStore: any
  previousTrapVisits: any[]

  //TODO: import correct type so component cant be passed to the connect function without error  ==> previousTrapVisits: TrapVisitResponse[]
  visitSetupDefaultState: InitialStateI
}) {
  const trapVisitsRequiringTurbidity =
    retrieveTrapVisitsRequiringTurbidity(previousTrapVisits)

  const generateTrapVisitTableData = (
    trapVisits: {
      trapVisitId: number
      programId: number
      trapLocationId: number
      waterTurbidity: number | null
      trapVisitEndTime: string
    }[]
  ) => {
    return trapVisits.map(trapVisit => {
      const program = visitSetupDefaultState.programs.find(
        (program: any) => program.id === trapVisit.programId
      )

      const trapLocation = visitSetupDefaultState.trapLocations.find(
        (trapLocation: any) => trapLocation.id === trapVisit.trapLocationId
      )

      return {
        trapVisitId: trapVisit.trapVisitId,
        programId: trapVisit.programId,
        programName: program?.programName,
        waterTurbidity: trapVisit.waterTurbidity,
        trapLocationName: trapLocation?.trapName,
        trapVisitEndTime: trapVisit.trapVisitEndTime,
      }
    })
  }
  const trapVisitTableData = generateTrapVisitTableData(
    trapVisitsRequiringTurbidity
  )

  return (
    <View flex={1} p={5}>
      <VStack
        space={5}
        bg='white'
        pb={5}
        h={'full'}
        borderRadius={5}
        overflow={'hidden'}
      >
        <Text fontSize='xl' bold bg='primary' color='white' p={5}>
          Input Water Turbidity
        </Text>
        <Text fontSize='md' p={5}>
          The following trap visits require water turbidity input. Click the
          Input Turbidity button to edit the water turbidity for each trap visit
          and complete record.
        </Text>
        {trapVisitTableData.map(trapVisit => (
          <Box
            key={trapVisit.trapVisitId}
            borderColor={'secondary'}
            shadow={1}
            borderWidth={1}
            borderTopWidth={5}
            borderRadius={5}
            borderTopColor={'primary'}
            p={5}
            mx={5}
            background={'lightBlue.50'}
          >
            <Text fontSize='md'>
              <Text bold>Program:</Text> {trapVisit.programName}
            </Text>
            <Text fontSize='md'>
              <Text bold>Trap Location:</Text> {trapVisit.trapLocationName}
            </Text>
            <Text fontSize='md'>
              <Text bold>Trap Visit End Time:</Text>{' '}
              {new Date(trapVisit.trapVisitEndTime).toLocaleString()}
            </Text>
            <HStack justifyContent='space-between' alignItems='center'>
              <Text fontSize='md'>
                <Text bold>Water Turbidity:</Text>{' '}
                {trapVisit.waterTurbidity ?? 'Not Recorded'}
              </Text>
              <Popover
                placement='top'
                trigger={triggerProps => {
                  return (
                    <Button bg='primary' {...triggerProps}>
                      <Text fontSize='md' color='white'>
                        Input Turbidity
                      </Text>
                    </Button>
                  )
                }}
              >
                <Popover.Content accessibilityLabel='Delete Customerd' w='56'>
                  <Popover.Arrow />
                  <Popover.CloseButton />
                  <Popover.Header>
                    <Text fontSize='sm' bold>
                      Save Turbidity Value
                    </Text>
                  </Popover.Header>
                  <Popover.Body>
                    <Input placeholder='0' />
                  </Popover.Body>
                  <Popover.Footer justifyContent='stretch'>
                    <Button variant={'outline'} w='full' borderColor='primary'>
                      <Text color='primary' bold>
                        Save
                      </Text>
                    </Button>
                  </Popover.Footer>
                </Popover.Content>
              </Popover>
            </HStack>
          </Box>
        ))}
        <Button
          bg={'primary'}
          mt='auto'
          mx={25}
          onPress={() => navigation.navigate('Home')}
        >
          <Text fontSize='md' color='white'>
            Return Home
          </Text>
        </Button>
      </VStack>
    </View>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    userCredentialsStore: state.userCredentials,
    visitSetupDefaultState: state.visitSetupDefaults,
    previousTrapVisits:
      state.trapVisitFormPostBundler.previousTrapVisitSubmissions,
  }
}

export default connect(mapStateToProps)(InputTurbidity)

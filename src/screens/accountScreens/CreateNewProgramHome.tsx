import React from 'react'
import { Text, Heading, View, VStack } from 'native-base'
import IncompleteSectionButton from '../../components/form/IncompleteSectionButton'
import CreateNewProgramButton from '../../components/createNewProgram/CreateNewProgramButton'
import CreateNewProgramNavButtons from '../../components/createNewProgram/CreateNewProgramNavButtons'

//slice needs to be made for main navigation (steps array will move there)

const stepsArray = [
  { name: 'Trapping Sites', propName: 'trappingSites', completed: false },
  { name: 'Crew Members', propName: 'crewMembers', completed: false },
  {
    name: 'Efficiency Trial Protocols',
    propName: 'efficiencyTrialProtocols',
    completed: true,
  },
  {
    name: 'Trapping Protocols',
    propName: 'trappingProtocols',
    completed: false,
  },
  {
    name: 'Permit Information',
    propName: 'permitInformation',
    completed: false,
  },
]

const CreateNewProgramHome = ({ navigation }: { navigation: any }) => {
  return (
    <>
      <View flex={1} bg='#fff'>
        <VStack space={10} p='15%'>
          <Heading>{`Welcome  {Program Name}`}</Heading>
          <Text fontSize='lg' color='grey'>
            {
              'Please fill in some important program information \nbefore you can begin trapping.'
            }
          </Text>
          {stepsArray.map((step: any, idx: number) => {
            return (
              <CreateNewProgramButton
                name={step.name}
                completed={step.completed}
                navigation={navigation}
                key={idx}
                step={idx + 1}
              />
            )
          })}
        </VStack>
      </View>
      <CreateNewProgramNavButtons />
    </>
  )
}

export default CreateNewProgramHome

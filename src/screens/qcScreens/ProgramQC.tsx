import { useEffect, useState } from 'react'
import { Box, Button, Center, Icon, Text, View, VStack } from 'native-base'
import { LayoutAnimation, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'

function ProgramQC({
  navigation,
  programs,
}: {
  navigation: any
  programs: any[]
}) {
  const userPrograms = [1]
  // TODO: ^ hard coded value to be updated to user's program ids ^
  // Use programId of 'FlowWest Test Entry' program

  const returnButtonColor = (programId: any) => {
    if (userPrograms.includes(programId)) {
      return 'primary'
    } else return 'gray.400'
  }

  const returnButtonDisabled = (programId: number) => {
    if (userPrograms.includes(programId)) {
      return false
    } else return true
  }

  return (
    <VStack alignItems={'center'} marginTop={100} flex={1}>
      {/* PLACEHOLDER WHILE QC IS IN DEV */}
      <Text fontSize='3xl' color='primary' fontWeight={'bold'} margin={10}>
        QC currently in development
      </Text>
      <Button w='3/5' bg={'secondary'} mb={10} isDisabled>
        <Text fontSize='xl' color='primary' fontWeight={'bold'}>
          Programs
        </Text>
      </Button>
      {/* ---------------------------------------------------------------------------------------- */}

      {programs.map(program => {
        return (
          <Button
            key={program.programName}
            w='4/5'
            bg={returnButtonColor(program.programId)}
            // hardcode TRUE for now
            disabled={true || returnButtonDisabled(program.programId)}
            isDisabled
            mb={5}
            onPress={() => {
              navigation.navigate('Select Data to QC', {
                programId: program.programId,
              })
            }}
          >
            <Text fontSize='xl' color='white' fontWeight={'bold'}>
              {program.programName}
            </Text>
          </Button>
        )
      })}

      <View flex={1}></View>
      <Button
        marginBottom={5}
        w='90%'
        bg='primary'
        onPress={() => {
          navigation.navigate('Home')
        }}
      >
        <Text fontSize='xl' color='white' fontWeight={'bold'}>
          Back
        </Text>
      </Button>
    </VStack>
  )
}

const mapStateToProps = (state: RootState) => {
  let programs = state.visitSetupDefaults.programs

  return {
    programs: programs ?? [],
  }
}

export default connect(mapStateToProps)(ProgramQC)

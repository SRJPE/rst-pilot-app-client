import { useEffect, useState } from 'react'
import { Box, Button, Center, Icon, Text, View, VStack } from 'native-base'
import { LayoutAnimation, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'

function ProgramQC({
  navigation,
  programs,
  cachedTrapVisits,
  cachedCatch,
}: {
  navigation: any
  programs: any[]
  cachedTrapVisits: any[]
  cachedCatch: any[]
}) {
  const returnCachedTrapVisits = (programId: number) => {
    const payload = cachedTrapVisits.filter((trapVisit) => {
      return trapVisit.createdTrapVisitResponse.programId == programId
    })
    return payload
  }

  const returnCachedCatch = (programId: number) => {
    const payload = cachedCatch.filter((catchSubmission) => {
      return catchSubmission.createdCatchRawResponse.programId == programId
    })
    return payload
  }

  const returnButtonColor = (program: any) => {
    const cachedTrapVisits = returnCachedTrapVisits(program.programId)
    if (cachedTrapVisits.length) {
      return 'primary'
    } else return 'gray.400'
  }

  const returnButtonDisabled = (programId: number) => {
    if (returnCachedTrapVisits(programId).length) {
      return false
    } else return true
  }

  return (
    <VStack alignItems={'center'} marginTop={100} flex={1}>
      <Button w='3/5' bg={'secondary'} mb={10}>
        <Text fontSize='xl' color='primary' fontWeight={'bold'}>
          Programs
        </Text>
      </Button>
      {/* ---------------------------------------------------------------------------------------- */}

      {programs.map((program) => {
        return (
          <Button
            key={program.programName}
            w='4/5'
            bg={returnButtonColor(program)}
            disabled={returnButtonDisabled(program.programId)}
            mb={5}
            onPress={() => {
              const cachedTrapVisits = returnCachedTrapVisits(program.programId)
              const cachedCatch = returnCachedCatch(program.programId)
              navigation.navigate('Select Data to QC')
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
  let cachedTrapVisits = [
    ...state.trapVisitFormPostBundler.previousTrapVisitSubmissions,
    ...state.trapVisitFormPostBundler.qcTrapVisitSubmissions,
  ]
  let cachedCatch = state.trapVisitFormPostBundler.previousCatchRawSubmissions

  return {
    programs: programs ?? [],
    cachedTrapVisits: cachedTrapVisits ?? [],
    cachedCatch: cachedCatch ?? [],
  }
}

export default connect(mapStateToProps)(ProgramQC)

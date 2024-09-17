import { Button, Text } from 'native-base'
import React from 'react'
import type { MonitoringProgram } from '../../utils/interfaces'
import CustomModalHeader from '../Shared/CustomModalHeader'
import MonitoringInfoTabs from './monitoringProgramInfoTabs/MonitoringInfoTabs'

const MonitoringProgramInfoModalContent = ({
  closeModal,
  monitoringProgramInfo,
}: {
  closeModal: () => void
  monitoringProgramInfo: MonitoringProgram | null
}) => {
  const { programName } = monitoringProgramInfo || { programName: '' }

  return (
    <>
      <CustomModalHeader
        headerText={programName}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      <MonitoringInfoTabs monitoringProgramInfo={monitoringProgramInfo} />
      <Button
        m={10}
        alignSelf='center'
        borderRadius={10}
        bg='primary'
        h='60px'
        w='400px'
        shadow='5'
        _disabled={{
          opacity: '75',
        }}
        onPress={() => {
          closeModal()
        }}
      >
        <Text fontSize='lg' fontWeight='bold' color='white'>
          Close
        </Text>
      </Button>
    </>
  )
}

export default MonitoringProgramInfoModalContent

import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { HStack, Icon, IconButton, Pressable, VStack, Text } from 'native-base'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import {
  CrewMembersStoreI,
  IndividualCrewMemberValuesI,
} from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'

const headers = [
  'First Name',
  'Last Name',
  'Phone',
  'Email',
  'Lead',
  'Agency',
  'Orcid ID',
  '',
]

const CrewMemberDataTable = ({
  crewMembersStore,
  handleShowAddCrewModal,
  handleRemoveCrewMember,
}: {
  crewMembersStore: CrewMembersStoreI
  handleShowAddCrewModal: any
  handleRemoveCrewMember: (uid: string) => void
}) => {
  const [processedData, setProcessedData] = useState(
    [] as Array<IndividualCrewMemberValuesI>
  )

  useEffect(() => {
    setProcessedData(Object.values(crewMembersStore))
  }, [crewMembersStore])

  return (
    <DataTable>
      <DataTable.Row>
        <DataTable.Cell style={{ justifyContent: 'flex-end' }}>
          <Pressable onPress={() => handleShowAddCrewModal()}>
            <HStack alignItems='center'>
              <Icon
                as={Ionicons}
                name={'add'}
                size='lg'
                color='primary'
                marginRight='1'
              />
              <Text color='primary' fontSize='md'>
                Add crew Member
              </Text>
            </HStack>
          </Pressable>
        </DataTable.Cell>
      </DataTable.Row>
      <DataTable.Header>
        <DataTable.Title style={{ flex: 2 }}>First Name</DataTable.Title>
        <DataTable.Title style={{ flex: 2 }}>Last Name</DataTable.Title>
        <DataTable.Title style={{ flex: 3 }}>Email</DataTable.Title>
        <DataTable.Title style={{ flex: 2 }}>Agency</DataTable.Title>
        <DataTable.Title style={{ flex: 1 }}>{''}</DataTable.Title>
      </DataTable.Header>
      {processedData.map((trapCrewObject, idx) => {
        return (
          <DataTable.Row style={[{ height: 55 }]} key={idx}>
            <DataTable.Cell style={{ flex: 2 }}>
              {trapCrewObject.firstName}
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 2 }}>
              {trapCrewObject.lastName}
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 3 }}>
              {trapCrewObject.email}
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 2 }}>
              {trapCrewObject.agency}
            </DataTable.Cell>
            <DataTable.Cell
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconButton
                variant='solid'
                bg='primary'
                colorScheme='primary'
                size='md'
                onPress={() => handleRemoveCrewMember(trapCrewObject.email!)}
              >
                <Icon as={Entypo} size='5' name='trash' color='warmGray.50' />
              </IconButton>
            </DataTable.Cell>
          </DataTable.Row>
        )
      })}
    </DataTable>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    crewMembersStore: state.crewMembers.crewMembersStore,
  }
}

export default connect(mapStateToProps)(CrewMemberDataTable)

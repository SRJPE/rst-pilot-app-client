import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { Icon, IconButton } from 'native-base'
import { Entypo } from '@expo/vector-icons'
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
  handleShowTableModal,
  handleRemoveCrewMember,
}: {
  crewMembersStore: CrewMembersStoreI
  handleShowTableModal: any
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
      <DataTable.Header>
        {/* {headers.map((header: string, idx: number) => (
          <DataTable.Title
            key={idx}
            numeric
            style={[{ justifyContent: 'center', flexWrap: 'wrap' }]}
          >
            {header}
          </DataTable.Title>
        ))} */}
        <DataTable.Title style={{ flex: 2 }}>First Name</DataTable.Title>
        <DataTable.Title style={{ flex: 2 }}>Last Name</DataTable.Title>
        <DataTable.Title style={{ flex: 3 }}>Email</DataTable.Title>
        <DataTable.Title style={{ flex: 2 }}>Agency</DataTable.Title>
        <DataTable.Title style={{ flex: 1 }}>{''}</DataTable.Title>
      </DataTable.Header>
      {processedData.map((trapCrewObject, idx) => {
        return (
          <DataTable.Row
            style={[{ height: 55 }]}
            key={idx}
            onPress={
              () => {}
              // handleShowTableModal(trapObject)
            }
          >
            {/* {Object.values(trapObject).map((cellValue: any, idx: number) => (
              <DataTable.Cell key={idx}>{cellValue}</DataTable.Cell>
              ))} */}

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

import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { Icon, IconButton } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import { CrewMembersStoreI } from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'

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
}: {
  crewMembersStore: CrewMembersStoreI
  handleShowTableModal: any
}) => {
  const [processedData, setProcessedData] = useState([] as Array<any>)

  useEffect(() => {
    setProcessedData(Object.values(crewMembersStore))
  }, [crewMembersStore])
  return (
    <DataTable>
      <DataTable.Header style={[{ paddingLeft: 0 }]}>
        {headers.map((header: string, idx: number) => (
          <DataTable.Title
            key={idx}
            numeric
            style={[{ justifyContent: 'center', flexWrap: 'wrap' }]}
          >
            {header}
          </DataTable.Title>
        ))}
      </DataTable.Header>
      {processedData.map((trapObject: any, idx: number) => {
        return (
          <DataTable.Row
            style={[{ height: 55 }]}
            key={idx}
            onPress={
              () => {}
              // handleShowTableModal(trapObject)
            }
          >
            {Object.values(trapObject).map((cellValue: any, idx: number) => (
              <DataTable.Cell key={idx}>{cellValue.toString()}</DataTable.Cell>
            ))}
            <IconButton
              marginY={3}
              variant='solid'
              bg='primary'
              colorScheme='primary'
              size='sm'
              onPress={() => handleShowTableModal(trapObject)}
            >
              <Icon as={Entypo} size='5' name='edit' color='warmGray.50' />
            </IconButton>
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

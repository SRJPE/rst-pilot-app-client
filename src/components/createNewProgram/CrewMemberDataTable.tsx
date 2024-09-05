import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { Icon, IconButton, Text } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import { CrewMembersStoreI } from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { startCase } from 'lodash'

interface Header {
  colData: string
  label: string
  numeric: boolean
  flex: number
}
const headers: Header[] = [
  { colData: 'firstName', label: 'First Name', numeric: false, flex: 1 },
  { colData: 'lastName', label: 'Last Name', numeric: false, flex: 1 },
  { colData: 'phoneNumber', label: 'Phone', numeric: false, flex: 1 },
  { colData: 'email', label: 'Email', numeric: false, flex: 1.5 },
  { colData: 'isLead', label: 'Lead', numeric: false, flex: 0.5 },
  { colData: 'agency', label: 'Agency', numeric: false, flex: 0.5 },
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
  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3]
    }
    return null
  }
  return (
    <DataTable style={{}}>
      <DataTable.Header>
        {headers.map(({ label, numeric, flex }, idx: number) => (
          <DataTable.Title
            key={idx}
            numeric={numeric}
            style={{
              paddingHorizontal: 10,
              flex: flex,
            }}
          >
            {label}
          </DataTable.Title>
        ))}
        <DataTable.Title
          style={{
            paddingHorizontal: 0,
            flex: 0.3,
          }}
        >
          {''}
        </DataTable.Title>
      </DataTable.Header>
      {processedData.map((crewObject: any, idx: number) => {
        return (
          <DataTable.Row style={[{ height: 55 }]} key={idx}>
            {Object.entries(crewObject).map(
              (keyValuePair: any, idx: number) => {
                const [key, cellValue] = keyValuePair
                const currentCol = headers.find(
                  (header) => header.colData === key
                )

                if (currentCol)
                  return (
                    <DataTable.Cell
                      numeric={currentCol.numeric}
                      key={idx}
                      style={{
                        paddingHorizontal: 10,
                        flex: currentCol.flex,
                      }}
                    >
                      {key === 'phoneNumber'
                        ? formatPhoneNumber(cellValue)
                        : typeof cellValue === 'boolean'
                        ? cellValue.toString().charAt(0).toUpperCase() +
                          cellValue.toString().slice(1)
                        : cellValue}
                    </DataTable.Cell>
                  )
              }
            )}
            <IconButton
              marginY={3}
              variant='solid'
              bg='primary'
              colorScheme='primary'
              size='sm'
              onPress={() => handleShowTableModal(crewObject)}
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

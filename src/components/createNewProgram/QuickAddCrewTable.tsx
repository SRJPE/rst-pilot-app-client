import React, { useEffect, useState } from 'react'
import { Button, Icon, Text } from 'native-base'
import { StyleSheet } from 'react-native'
import { DataTable } from 'react-native-paper'
import { PersonnelObject } from '../../screens/accountScreens/createNewProgram/CrewMembers'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  IndividualCrewMemberValuesI,
  removeIndividualCrewMember,
} from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { Ionicons } from '@expo/vector-icons'
import { CrewMemberEntryMode } from './AddCrewMemberModalContent'

type Props = {
  resetSearch: () => void
  emailSearchResults: any[]
  handleAddCrewMemberSubmission: (values: IndividualCrewMemberValuesI) => void
  showNoResultsMessage: boolean
  changeCrewMemberEntryMode: (mode: CrewMemberEntryMode) => void
  closeModal: () => void
}

const QuickAddCrewTable = ({
  resetSearch,
  emailSearchResults,
  handleAddCrewMemberSubmission,
  showNoResultsMessage,
  changeCrewMemberEntryMode,
  closeModal,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const crewMembersStore = useSelector(
    (state: RootState) => state.crewMembers.crewMembersStore
  )
  const fundingAgencies = useSelector(
    (state: RootState) => state.dropdowns.values.fundingAgency
  )

  const crewMembers = Object.values(crewMembersStore)

  const checkIsCrewMember = (personnel: PersonnelObject) =>
    crewMembers.find(crewMember => {
      return crewMember.email === personnel.email
    })

  const [page, setPage] = useState(0)
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(10)
  const from = page * numberOfItemsPerPage
  const to = Math.min(
    (page + 1) * numberOfItemsPerPage,
    emailSearchResults.length
  )
  useEffect(() => {
    setPage(0)
  }, [])

  const handleQuickAddCrewMember = (personnel: PersonnelObject) => {
    const { id, firstName, lastName, email, phone, role, orcidId, agencyId } =
      personnel

    const agencyDefinition = fundingAgencies.find(
      agency => agency.id === agencyId
    )?.definition
    const payload = {
      firstName,
      lastName,
      phoneNumber: phone,
      email,
      isLead: role === 'lead',
      orcidId,
      agency: agencyDefinition,
    }
    handleAddCrewMemberSubmission(payload as IndividualCrewMemberValuesI)
  }

  const handleQuickRemoveCrewMember = (personnel: PersonnelObject) => {
    console.log(
      '🚀 ~ file: AddCrewMemberModalContent.tsx:147 ~ handleQuickRemoveCrewMember ~ personnel:',
      personnel
    )

    dispatch(removeIndividualCrewMember(personnel.email))
  }

  return (
    <>
      {emailSearchResults.length > 0 && (
        <>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={styles.baseCell}>First</DataTable.Title>
              <DataTable.Title style={styles.baseCell}>Last</DataTable.Title>
              <DataTable.Title style={styles.extendedCell}>
                Email
              </DataTable.Title>
              <DataTable.Title style={styles.baseCell}>Actions</DataTable.Title>
            </DataTable.Header>
            {emailSearchResults.slice(from, to).map(personnel => {
              const { id, firstName, lastName, email } = personnel
              return (
                <DataTable.Row style={{ display: 'flex' }} key={id}>
                  <DataTable.Cell style={styles.baseCell}>
                    {firstName}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.baseCell}>
                    {lastName}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.extendedCell}>
                    {email}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {checkIsCrewMember(personnel) ? (
                      <Button
                        onPress={() => {
                          handleQuickRemoveCrewMember(personnel)
                        }}
                        width={100}
                        borderColor='red.500'
                        borderWidth={1}
                        bg='transparent'
                        leftIcon={
                          <Icon
                            as={Ionicons}
                            color='red.500'
                            name='remove'
                            size='sm'
                          />
                        }
                      >
                        <Text color='red.500'>Remove</Text>
                      </Button>
                    ) : (
                      <Button
                        onPress={() => {
                          handleQuickAddCrewMember(personnel)
                        }}
                        bg='transparent'
                        borderColor='primary'
                        borderWidth={1}
                        width={100}
                        leftIcon={
                          <Icon
                            as={Ionicons}
                            color='primary'
                            name='add'
                            size='sm'
                          />
                        }
                      >
                        <Text color='primary'>Add</Text>
                      </Button>
                    )}
                  </DataTable.Cell>
                </DataTable.Row>
              )
            })}
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(emailSearchResults.length / 10)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${emailSearchResults.length}`}
              showFastPaginationControls
              numberOfItemsPerPage={numberOfItemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
          <Button
            mt={5}
            onPress={() => {
              closeModal(), resetSearch()
            }}
            bg='primary'
          >
            <Text color='white' fontSize='lg'>
              Close Modal
            </Text>
          </Button>
        </>
      )}
      {showNoResultsMessage && (
        <Text fontSize={'lg'}>
          No records match your search. Try again or{' '}
          <Text
            color='primary'
            onPress={() => changeCrewMemberEntryMode('manual')}
          >
            click here
          </Text>{' '}
          to manually add crew member
        </Text>
      )}
    </>
  )
}

export default QuickAddCrewTable

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  baseCell: { flex: 1 },
  extendedCell: { flex: 2 },

  content: {
    padding: 20,
    backgroundColor: 'white',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
})

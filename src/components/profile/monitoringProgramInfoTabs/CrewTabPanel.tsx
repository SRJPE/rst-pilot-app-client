import { DataTable } from 'react-native-paper'
import {
  FishMeasureProtocol,
  MonitoringProgram,
} from '../../../utils/interfaces'
import { TabPanelWrapper } from './MonitoringInfoTabs'
import useTablePagination from '../../../utils/useTablePagination'
import TablePagination from '../../Shared/TablePagination'
import {
  HStack,
  Icon,
  Button,
  Text,
  Pressable,
  ScrollView,
  VStack,
  IconButton,
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import CustomModal from '../../Shared/CustomModal'
import AddCrewMemberModalContent from '../../createNewProgram/AddCrewMemberModalContent'
import { PersonnelObject } from '../../../screens/accountScreens/createNewProgram/CrewMembers'
import { IndividualCrewMemberState } from '@/src/redux/reducers/createNewProgramSlices/crewMembersSlice'
import {
  deletePersonnelFromTeam,
  getPersonnelDefaults,
  postPersonnel,
  postPersonnelToTeam,
} from '@/src/redux/reducers/personnelSlice'
import { AppDispatch } from '../../../redux/store'
import { useDispatch } from 'react-redux'
import {
  getUserPrograms,
  updatePersonnelById,
} from '../../../redux/reducers/userCredentialsSlice'
import { Entypo } from '@expo/vector-icons'
import EditAccountInfoModalContent from '../EditAccountInfoModalContent'

export const CrewTabPanel = ({
  monitoringProgramInfo,
  personnelStore,
  crewMembersStore,
  dropdownValues,
  userCredentialsStore,
}: {
  monitoringProgramInfo: MonitoringProgram | null
  personnelStore: any
  crewMembersStore: any
  dropdownValues: any
  userCredentialsStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const showPlaceholderData = monitoringProgramInfo?.crewMembers?.length === 0

  const { page, itemsPerPage, from, to, onPageChange } = useTablePagination(
    showPlaceholderData ? [] : monitoringProgramInfo?.crewMembers || [],
    { itemsPerPage: 10 }
  )

  const [addCrewMemberModalOpen, setAddCrewMemberModalOpen] = useState(false)
  const [editCrewMemberModalOpen, setEditCrewMemberModalOpen] = useState(false)
  const [crewMemberToEdit, setCrewMemberToEdit] = useState<any>(null)

  const [addTrapModalContent, setAddTrapModalContent] = useState(
    IndividualCrewMemberState as any
  )

  const personnelOptions = personnelStore.personnelOptions as PersonnelObject[]

  const handleAddCrewMember = (values: any) => {
    if (values.id) {
      dispatch(
        postPersonnelToTeam({
          programId: monitoringProgramInfo?.id,
          personnelId: values.id,
        })
      )
        .then(() => {
          dispatch(getPersonnelDefaults())
          dispatch(getUserPrograms(userCredentialsStore?.id))
        })
        .catch(err => {
          console.error('Failed to post personnel', err)
        })
      return
    }
    const agencyId = dropdownValues?.fundingAgency?.find(
      (agencyOption: { definition: string }) =>
        agencyOption.definition.toLowerCase() === values.agency.toLowerCase()
    )?.id

    const { firstName, lastName, email, orcidId, isLead, phoneNumber } = values

    const postValues = {
      programId: monitoringProgramInfo?.id,
      agencyId,
      role: isLead ? 'lead' : 'non-lead',
      phone: phoneNumber || null,
      firstName,
      lastName,
      email,
      orcidId: orcidId || null,
    }
    dispatch(postPersonnel(postValues))
      .then(() => {
        dispatch(getPersonnelDefaults())
        dispatch(getUserPrograms(userCredentialsStore?.id))
      })
      .catch(err => {
        console.error('Failed to post personnel', err)
      })
  }

  const handleRemoveCrewMember = (id: number) => {
    dispatch(
      deletePersonnelFromTeam({
        programId: monitoringProgramInfo?.id,
        personnelId: id,
      })
    )
      .then(() => {
        dispatch(getPersonnelDefaults())
        dispatch(getUserPrograms(userCredentialsStore?.id))
      })
      .catch(err => {
        console.error('Failed to post personnel', err)
      })
  }

  const openEditCrewMemberModal = async (id: number) => {
    const crewMember = monitoringProgramInfo?.crewMembers.find(
      crewMember => crewMember.id === id
    )
    console.log('crewMember', monitoringProgramInfo)
    if (!crewMember) return

    const agencyDefinition = dropdownValues?.fundingAgency?.find(
      (agencyOption: { id: number }) => agencyOption.id === crewMember.agencyId
    )?.definition

    setCrewMemberToEdit({
      ...crewMember,
      emailAddress: crewMember.email,
      agencyDefinition,
    })
    setEditCrewMemberModalOpen(true)
  }

  const handleSaveEditedCrewMember = async (values: any) => {
    const { firstName, lastName, phone, agencyDefinition, emailAddress, role } =
      values

    const selectedAgency = dropdownValues.fundingAgency.find(
      (agencyOption: { definition: any }) =>
        agencyOption.definition === agencyDefinition
    )

    const updatedValues = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      agencyId: selectedAgency?.id,
      role,
      updatedAt: new Date().toISOString(),
    }

    dispatch(
      await updatePersonnelById({
        ...updatedValues,
        id: crewMemberToEdit.id,
      })
    )
      .then(() => {
        setCrewMemberToEdit(null)
        setEditCrewMemberModalOpen(false)
        dispatch(getPersonnelDefaults())
        dispatch(getUserPrograms(userCredentialsStore?.id))
      })
      .catch(err => {
        console.error('Failed to post personnel', err)
      })
  }

  console.log('crewMemberToEdit', crewMemberToEdit)
  console.log('editCrewMemberModalOpen', editCrewMemberModalOpen)

  return (
    <>
      <TabPanelWrapper>
        <ScrollView>
          <VStack space={3} marginTop={5}>
            <Text fontSize='lg' fontWeight={500}>
              Crew Members:
            </Text>

            <DataTable>
              <DataTable.Row style={{ marginBottom: 0 }}>
                <DataTable.Cell style={{ justifyContent: 'flex-end' }}>
                  <Pressable onPress={() => setAddCrewMemberModalOpen(true)}>
                    <HStack alignItems='center'>
                      <Icon
                        as={Ionicons}
                        name={'add'}
                        size='lg'
                        color='primary'
                        marginRight='1'
                      />
                      <Text color='primary' fontSize='md'>
                        Add Crew Member
                      </Text>
                    </HStack>
                  </Pressable>
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 1 }}>
                  First Name
                </DataTable.Title>
                <DataTable.Title style={{ flex: 1 }}>Last Name</DataTable.Title>
                <DataTable.Title style={{ flex: 1 }}>Email</DataTable.Title>
                <DataTable.Title style={{ flex: 0.5 }}>Role</DataTable.Title>
                <DataTable.Title style={{ flex: 0.5 }}>{''}</DataTable.Title>
              </DataTable.Header>
              {monitoringProgramInfo?.crewMembers
                .slice(from, to)
                .map(({ firstName, lastName, email, role, id }, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell style={{ flex: 1 }}>
                      {firstName}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1 }}>
                      {lastName}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1 }}>{email}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.5 }}>
                      {role}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.5 }}>
                      <HStack
                        space={2}
                        alignItems='center'
                        justifyContent='flex-end'
                      >
                        <IconButton
                          variant='solid'
                          bg='primary'
                          colorScheme='primary'
                          size='md'
                          onPress={() => {
                            openEditCrewMemberModal(id)
                          }}
                        >
                          <Icon
                            as={Entypo}
                            size='5'
                            name='pencil'
                            color='warmGray.50'
                          />
                        </IconButton>
                        <IconButton
                          variant='solid'
                          bg='red.700'
                          colorScheme='red'
                          size='md'
                          onPress={() => {
                            handleRemoveCrewMember(id)
                          }}
                        >
                          <Icon
                            as={Entypo}
                            size='5'
                            name='trash'
                            color='warmGray.50'
                          />
                        </IconButton>
                      </HStack>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              <TablePagination
                items={
                  showPlaceholderData
                    ? []
                    : monitoringProgramInfo?.crewMembers || []
                }
                page={page}
                itemsPerPage={itemsPerPage}
                from={from}
                to={to}
                onPageChange={onPageChange}
              />
            </DataTable>
          </VStack>
        </ScrollView>
      </TabPanelWrapper>
      {/* --------- Modals --------- */}
      {addCrewMemberModalOpen && (
        <CustomModal
          isOpen={addCrewMemberModalOpen}
          closeModal={() => setAddCrewMemberModalOpen(false)}
          height='100%'
        >
          <AddCrewMemberModalContent
            personnelOptions={personnelOptions}
            addTrapModalContent={addTrapModalContent}
            closeModal={() => setAddCrewMemberModalOpen(false)}
            handleAddCrewMember={handleAddCrewMember}
          />
        </CustomModal>
      )}
      {editCrewMemberModalOpen && (
        <CustomModal
          isOpen={editCrewMemberModalOpen}
          closeModal={() => setEditCrewMemberModalOpen(false)}
          height='100%'
        >
          <EditAccountInfoModalContent
            closeModal={() => setEditCrewMemberModalOpen(false)}
            user={crewMemberToEdit}
            submissionHandler={handleSaveEditedCrewMember}
          />
        </CustomModal>
      )}
    </>
  )
}

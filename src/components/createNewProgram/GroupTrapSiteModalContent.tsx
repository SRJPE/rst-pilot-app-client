import { Formik, useFormikContext } from 'formik'
import {
  Box,
  Badge,
  Button,
  Divider,
  FormControl,
  HStack,
  Input,
  Radio,
  Text,
  VStack,
  Flex,
  Spacer,
} from 'native-base'
import { StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import DropDownPicker from 'react-native-dropdown-picker'
import { IndividualTrappingSiteValuesI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'

import CustomModalHeader from '../Shared/CustomModalHeader'
import { groupTrapSitesSchema } from '../../utils/helpers/yupValidations'
import GroupTrapSiteCard from '../form/GroupTrapSiteCard'
import { useEffect, useState } from 'react'

const TrapSiteCards = ({
  numberOfTrapSites,
  trappingSites,
}: {
  numberOfTrapSites: number
  trappingSites: IndividualTrappingSiteValuesI[]
}) => {
  let elements = []
  for (let i = 0; i < numberOfTrapSites; i++) {
    elements.push(
      <GroupTrapSiteCard trappingSites={trappingSites} cardId={i} />
    )
  }
  return <>{elements}</>
}

const NumberInput = ({ values, setValues }: any) => (
  <HStack space={5}>
    <Button
      size='sm'
      bg='primary'
      w={50}
      onPress={() => {
        if (values.numberOfTrapSites > 0)
          setValues({
            numberOfTrapSites: values.numberOfTrapSites - 1,
            trapSiteGroups: [...values.trapSiteGroups].slice(0, -1),
          })
      }}
    >
      <Text color='white'>-</Text>
    </Button>
    <Input
      height='50px'
      fontSize='16'
      width={50}
      keyboardType='numeric'
      value={`${values.numberOfTrapSites}`}
      isDisabled
      _disabled={{
        color: 'black',
        opacity: '100%',
        textAlign: 'center',
      }}
    />
    <Button
      size='sm'
      bg='primary'
      w={50}
      onPress={() => {
        if (values.numberOfTrapSites < 6)
          setValues({
            numberOfTrapSites: values.numberOfTrapSites + 1,
            trapSiteGroups: [
              ...values.trapSiteGroups,
              {
                groupId: `trapGroup-${values.numberOfTrapSites + 1}`,
                groupValue: [],
              },
            ],
          })
      }}
    >
      <Text color='white'>+</Text>
    </Button>
  </HStack>
)

const GroupTrapSiteModalContent = ({ closeModal }: { closeModal: any }) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleGroupTrapSiteSubmission = (values: {
    numberOfTrapSites: number
  }) => {
    // dispatch(saveIndividualCrewMember(values))
  }

  const trappingSites = useSelector(
    (state: any) =>
      Object.values(
        state.trappingSites.trappingSitesStore
      ) as IndividualTrappingSiteValuesI[]
  )

  return (
    <Formik
      validationSchema={groupTrapSitesSchema}
      initialValues={{ numberOfTrapSites: 0, trapSiteGroups: [] }}
      onSubmit={(values, { resetForm }) => {
        handleGroupTrapSiteSubmission(values)
        resetForm()
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        setValues,
        touched,
        errors,
        values,
      }) => {
        console.log('🚀 ~ GroupTrapSiteModalContent ~ values:', values)

        return (
          <>
            <CustomModalHeader
              headerText={'Group Trap Sites'}
              showHeaderButton={true}
              closeModal={closeModal}
            />
            <Divider my='1%' thickness='3' />
            <VStack mx='5%' my='2%' space={4}>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Number of Trapping Sites
                  </Text>
                </FormControl.Label>
                <NumberInput values={values} setValues={setValues} />
              </FormControl>
              <Divider thickness='3' my='2%' />
              <HStack space={5}>
                {trappingSites.map((site: any) => (
                  <Box style={[styles.badge, styles.badgeSelected]}>
                    <Text style={styles.badgeText}>{site.trapName}</Text>
                  </Box>
                ))}
              </HStack>
              <Divider thickness='3' my='2%' />
              <Flex
                flexDirection='row'
                flexWrap='wrap'
                justifyContent='flex-start'
              >
                <TrapSiteCards
                  numberOfTrapSites={values.numberOfTrapSites}
                  trappingSites={trappingSites}
                />
              </Flex>
            </VStack>
          </>
        )
      }}
    </Formik>
  )
}

export default GroupTrapSiteModalContent

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'hsl(0, 0%, 93%)',
    padding: 10,
    minWidth: 100,
    borderRadius: 50,
  },
  badgeSelected: {
    // backgroundColor: 'hsl(400, 100%, 50%)'
  },
  badgeText: { fontSize: 16, textAlign: 'center' },
})

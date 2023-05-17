import {
  Text,
  View,
  Divider,
  HStack,
  Box,
  Flex,
  VStack,
  FormControl,
} from 'native-base'
import { Formik } from 'formik'
import { groupTrapSitesSchema } from '../../../utils/helpers/yupValidations'
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { RootState } from '../../../redux/store'
import { connect } from 'react-redux'
import { TrappingSitesStoreI } from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import NumberInput from '../../../components/multipleTraps/NumberInput'
import ChipsDisplay from '../../../components/multipleTraps/ChipsDisplay'
import { GroupTrapSiteValues } from '../../../components/multipleTraps/interfaces'
import GroupTrapSiteRows from '../../../components/multipleTraps/GroupTrapSiteRows'
import { useState, useCallback } from 'react'

const MultipleTraps = ({
  navigation,
  trappingSitesStore,
}: {
  navigation: any
  trappingSitesStore: TrappingSitesStoreI
}) => {
  const [selectedItems, setSelectedItems] = useState([]) as any[]
  const handleGroupTrapSiteSubmission = (values: {
    numberOfTrapSites: number
  }) => {
    // dispatch(saveIndividualCrewMember(values))
  }

  return (
    <>
      <View
        flex={1}
        //justifyContent='center'
        alignItems='center'
        bg='hsl(0,0%, 100%)'
        padding={5}
      >
        <Formik
          validationSchema={groupTrapSitesSchema}
          initialValues={
            {
              numberOfTrapSites: 1,
              'trapSiteGroup-1': { groupItems: [], trapSiteName: '' },
            } as GroupTrapSiteValues
          }
          onSubmit={(values, { resetForm }) => {
            handleGroupTrapSiteSubmission(values)
            resetForm()
          }}
        >
          <>
            <FormControl>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  Number of Trapping Sites
                </Text>
              </FormControl.Label>
              <NumberInput
                trappingSites={trappingSitesStore}
                setSelectedItems={setSelectedItems}
              />
            </FormControl>
            <Divider thickness='3' my='2%' width='95%' />
            {/* <ChipsDisplay trappingSitesStore={trappingSitesStore} />
            <Divider thickness='3' my='2%' width='95%' /> */}

            <GroupTrapSiteRows
              trappingSitesStore={trappingSitesStore}
              selectedItemState={[selectedItems, setSelectedItems]}
            />
          </>
        </Formik>
      </View>
      <CreateNewProgramNavButtons navigation={navigation} />
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    trappingSitesStore: state.trappingSites.trappingSitesStore,
  }
}

export default connect(mapStateToProps)(MultipleTraps)

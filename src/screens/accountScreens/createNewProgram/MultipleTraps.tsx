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
import { RootState } from '../../../redux/store'
import { connect, useDispatch } from 'react-redux'
import { TrappingSitesStoreI } from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { GroupTrapSiteValuesI } from '../../../redux/reducers/createNewProgramSlices/multipleTrapsSlice'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import NumberInput from '../../../components/multipleTraps/NumberInput'
import ChipsDisplay from '../../../components/multipleTraps/ChipsDisplay'
import GroupTrapSiteRows from '../../../components/multipleTraps/GroupTrapSiteRows'
import { useState, useCallback, useEffect } from 'react'
import { clone, cloneDeep } from 'lodash'
import { numOfFormSteps } from '../../../redux/reducers/formSlices/navigationSlice'
import { AppDispatch } from '../../../redux/store'
import { saveMultipleTraps } from '../../../redux/reducers/createNewProgramSlices/multipleTrapsSlice'

const MultipleTraps = ({
  navigation,
  trappingSitesStore,
  multipleTrapsStore,
}: {
  navigation: any
  trappingSitesStore: TrappingSitesStoreI
  multipleTrapsStore: GroupTrapSiteValuesI
}) => {
  const [selectedItems, setSelectedItems] = useState([]) as any[]
  useEffect(() => {
    const storeCopy = cloneDeep(multipleTrapsStore)
    const formattedArray = Object.values(storeCopy).reduce((acc, cur) => {
      const selectedItems: { assignedTo: string; value: string }[] =
        cur.groupItems.map((item: string) => ({
          assignedTo: cur.trapSiteName,
          value: item,
        }))
      selectedItems.forEach(item => {
        acc.push(item)
      })
      return acc
    }, [])
    setSelectedItems(formattedArray)
  }, [multipleTrapsStore])
  const dispatch = useDispatch<AppDispatch>()
  const handleGroupTrapSiteSubmission = (values: GroupTrapSiteValuesI) => {
    dispatch(saveMultipleTraps(values))
    //saveMultipleTraps
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
          initialValues={{
            ...multipleTrapsStore,
            numberOfTrapSites: Object.keys(multipleTrapsStore).length || 1,
          }}
          onSubmit={(values, { resetForm }) => {
            handleGroupTrapSiteSubmission(values)

            resetForm()
          }}
        >
          {({ values }) => (
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
                multipleTrapSitesStore={multipleTrapsStore}
                selectedItemState={[selectedItems, setSelectedItems]}
              />
              <CreateNewProgramNavButtons
                handleSubmit={() => handleGroupTrapSiteSubmission(values)}
                navigation={navigation}
              />
            </>
          )}
        </Formik>
      </View>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    trappingSitesStore: state.trappingSites.trappingSitesStore,
    multipleTrapsStore: state.multipleTraps.groupTrapSiteValues,
  }
}

export default connect(mapStateToProps)(MultipleTraps)

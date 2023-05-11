import { Text, View } from 'native-base'
import { RootState } from '../../../redux/store'
import { connect } from 'react-redux'
import { TrappingSitesStoreI } from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'

const MultipleTraps = ({
  navigation,
  trappingSitesStore,
}: {
  navigation: any
  trappingSitesStore: TrappingSitesStoreI
}) => {
  return (
    <>
      <View flex={1} justifyContent='center' alignItems='center' bg='#FFF'>
        <Text fontSize='lg'>multiple Traps Place Holder</Text>
        <Text fontSize='lg'>{JSON.stringify(trappingSitesStore)}</Text>
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

import { Button, Heading, Icon, Image, Text, View, VStack } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import NavButtons from '../../../components/formContainer/NavButtons'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import IncompleteSectionButton from '../../../components/form/IncompleteSectionButton'
import { useEffect } from 'react'
import { checkIfFormIsComplete } from '../../../redux/reducers/formSlices/navigationSlice'

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.navigation,
  }
}

const IncompleteSections = ({
  reduxState,
  navigation,
}: {
  reduxState: any
  navigation: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const stepsArray = Object.values(reduxState.steps).slice(0, 6)

  useEffect(() => {
    dispatch(checkIfFormIsComplete())
  }, [])

  return (
    <>
      <View
        flex={1}
        bg='#fff'
        justifyContent='center'
        alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={10} p='10'>
          <Heading textAlign='center'>
            {'Please fill out any incomplete sections  \n before moving on:'}
          </Heading>

          {stepsArray.map((step: any, idx: number) => {
            return (
              <IncompleteSectionButton
                name={step.name}
                completed={step.completed}
                navigation={navigation}
                key={idx}
                step={idx + 1}
              />
            )
          })}
        </VStack>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}

export default connect(mapStateToProps)(IncompleteSections)

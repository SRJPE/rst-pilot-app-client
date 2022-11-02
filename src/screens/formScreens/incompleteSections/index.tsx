import { useEffect } from 'react'
import { Heading, View, VStack } from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { checkIfFormIsComplete } from '../../../redux/reducers/formSlices/navigationSlice'
import NavButtons from '../../../components/formContainer/NavButtons'
import IncompleteSectionButton from '../../../components/form/IncompleteSectionButton'

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
  const stepsArray = Object.values(reduxState.steps).slice(0, 6) as Array<any>
  console.log('🚀 ~ stepsArray', stepsArray)

  useEffect(() => {
    dispatch(checkIfFormIsComplete())
  }, [reduxState])

  return (
    <>
      <View
        flex={1}
        bg='#fff'
        justifyContent='center'
        // alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={10} p='10'>
          <Heading textAlign='center'>
            {'Please fill out any incomplete sections  \n before moving on:'}
          </Heading>

          {stepsArray.map((step: any, idx: number) => {
            console.log('🚀 ~ step $$$$', step)
            // console.log(
            //   '🚀 ~ {stepsArray.map ~ step',
            //   step.name + ';',
            //   step.completed
            // )
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

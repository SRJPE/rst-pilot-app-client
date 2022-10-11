import { Button, Heading, Icon, Image, Text, View, VStack } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import NavButtons from '../../../components/formContainer/NavButtons'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/store'

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
  console.log('🚀 ~ reduxState', reduxState)
  return (
    <>
      <View
        flex={1}
        justifyContent='center'
        alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={10} p='10'>
          <Heading textAlign='center'>
            {'Please fill out any incomplete sections  \n before moving on:'}
          </Heading>

          <Button
            rounded='xs'
            bg='primary'
            alignSelf='center'
            py='3'
            px='16'
            borderRadius='5'
            // onPress={handlePressCallTeamLead}
            leftIcon={
              <Icon as={Ionicons} name='checkmark-circle-outline' size='2xl' />
            }
            endIcon={
              <Button onPress={() => console.log('presssssed')}>Test</Button>
            }
          >
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontWeight='bold'
              color='#FFFFFF'
            >
              Call Team Lead
            </Text>
          </Button>
        </VStack>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}

export default connect(mapStateToProps)(IncompleteSections)

import { Image } from 'native-base'

const AppLogo = ({
  addBorder,
  imageSize,
}: {
  addBorder?: boolean
  imageSize?: number
}) => {
  return (
    <Image
      source={require('../../../assets/hands_and_bucket_data_tackle_logo.png')}
      height={imageSize}
      width={imageSize}
      borderRadius={1000}
      borderColor={addBorder ? 'primary' : '#fff'}
      borderWidth={addBorder ? 5 : 0}
      alt='salmon logo'
      mx='auto'
    />
  )
}
export default AppLogo

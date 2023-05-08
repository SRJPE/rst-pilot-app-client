import { useState } from 'react'
import {
  Center,
  Modal,
  Text,
  View,
  Box,
  Button as NativeButton,
  IButtonProps,
  IBoxProps,
} from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import PermitInfoDataTable from '../components/permitInfo/PermitInfoDataTable'
import useSavePdf from '../components/permitInfo/useSavePdf'
import { SAMPLE_PERMITS, Permit } from '../components/permitInfo/samplePermits'
import { SafeAreaView, StyleSheet } from 'react-native'
import Pdf from 'react-native-pdf'

export default function PermitInfo({ navigation }: { navigation: any }) {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [pdfType, setPdfType] = useState<PDF_Type | null>(null)
  const createAndSavePDF = useSavePdf()

  const DUMMY_DATA = {
    _4dContent: {
      uri: 'https://water.ca.gov/-/media/DWR-Website/Web-Pages/Programs/Integrated-Regional-Water-Management/Integrated-Regional-Management-Tribal-Engagement/Files/Example-IRWM-Funded-Tribal-Projects-Prop-84.pdf',
      cache: true,
    },
    _scpContent: {
      uri: 'https://www.doi.gov/sites/doi.gov/files/migrated/library/internet/subject/upload/Haas-TenYears.pdf',
      cache: true,
    },
  }

  const handleModalToggle = (
    modalOpenBool: boolean,
    pdfType: PDF_Type | null
  ) => {
    setModalOpen(modalOpenBool)
    setPdfType(pdfType)
  }

  return (
    <View flex={1} padding={50}>
      <SectionHeader title='4D Permit' />
      <PermitInfoDataTable
        header='Permitted expected take and indirect morality for RST'
        permits={SAMPLE_PERMITS.remaining}
      />
      <PermitInfoDataTable
        header='Remaining expected take and mortalities'
        permits={SAMPLE_PERMITS.remaining}
      />

      <Box>
        <Text fontSize='xl'>4D Trap will be stopped when:</Text>
        <Text fontSize='lg'>Flow exceeds: {'1,000 cfs'} </Text>
        <Text fontSize='lg'>Time exceeds: {'30c'} </Text>
      </Box>

      <SectionHeader
        title='Scientific Collection Permit (SCP)'
        boxProps={{ mt: 5 }}
      />

      <Box alignItems='flex-start' mt={5}>
        <Button onPress={() => handleModalToggle(true, '_4dContent')}>
          View 4d PDF
        </Button>
        <Button onPress={() => handleModalToggle(true, '_scpContent')}>
          View SCP PDF
        </Button>
      </Box>
      <Center>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <Modal.Content style={styles.modalContent}>
            <Box style={styles.modalHeaderContent}>
              <Text style={styles.modalHeaderText}>
                {pdfType === '_4dContent' ? '4d PDF' : 'SCP PDF'}
              </Text>
              <Button
                onPress={() =>
                  pdfType && createAndSavePDF(DUMMY_DATA[pdfType].uri)
                }
                iconName='ios-share'
                iconSize={20}
              >
                {''}
              </Button>
              <Button
                onPress={() => {
                  setModalOpen(false)
                  setPdfType(null)
                }}
                iconName='close'
                iconSize={20}
              >
                {''}
              </Button>
            </Box>
            <SafeAreaView style={{ flex: 1 }}>
              {pdfType && (
                <Pdf style={styles.pdfContainer} source={DUMMY_DATA[pdfType]} />
              )}
            </SafeAreaView>
          </Modal.Content>
        </Modal>
      </Center>
    </View>
  )
}

//=====================================
// SUB COMPONENTS
//=====================================

function Button({
  children,
  iconName = 'picture-as-pdf',
  iconSize = 32,
  ...props
}: ButtonWithIconProps) {
  return (
    <NativeButton
      bgColor='transparent'
      leftIcon={
        <MaterialIcons name={iconName} size={iconSize} color='#026D63' />
      }
      _text={{ color: 'black', fontSize: 'lg' }}
      {...props}
    >
      {children}
    </NativeButton>
  )
}

function SectionHeader({
  title,
  subheader,
  boxProps,
}: {
  title: string
  subheader?: string
  boxProps?: IBoxProps
}) {
  return (
    <Box {...boxProps}>
      <Text fontSize='2xl' bold>
        {title}
      </Text>
      {subheader && <Text fontSize='xl'>{subheader}</Text>}
    </Box>
  )
}

//=====================================
// STYLES
//=====================================

const styles = StyleSheet.create({
  modalHeaderContent: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  modalHeaderText: {
    flexGrow: 1,
    textAlign: 'center',
    paddingLeft: 80,
    fontWeight: '600',
    fontSize: 16,
  },
  modalContent: { flex: 1, maxWidth: '100%' },
  pdfContainer: { flex: 1, alignSelf: 'stretch' },
})

//=====================================
// TYPES
//=====================================

interface ButtonWithIconProps extends IButtonProps {
  iconName?: keyof typeof MaterialIcons.glyphMap
  iconSize?: number
}

type PDF_Type = '_4dContent' | '_scpContent'

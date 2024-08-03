// import React, { useEffect, useState } from 'react'
// import { Text } from 'native-base'
// import { WebView } from 'react-native-webview'
// import * as FileSystem from 'expo-file-system'
import axios from 'axios'

// interface DocumentViewerProps {
//   filePath: string
// }

// const DocumentViewer: React.FC<DocumentViewerProps> = ({ filePath }) => {
//   const [htmlContent, setHtmlContent] = useState<string | null>(null)

//   useEffect(() => {
//     const convertDocxToHtml = async () => {
//       try {
//         const fileUri = FileSystem.documentDirectory + filePath
//         const fileContent = await FileSystem.readAsStringAsync(fileUri, {
//           encoding: FileSystem.EncodingType.Base64,
//         })
//         const response = await axios.post('http://localhost:8000/convert', {
//           file: fileContent,
//         })
//         setHtmlContent(response.data)
//       } catch (error) {
//         console.error('Error converting file:', error)
//       }
//     }

//     if (filePath) {
//       convertDocxToHtml()
//     }
//   }, [filePath])

//   if (!filePath || !htmlContent) {
//     return <Text>File not found or inaccessible</Text>
//   }

//   return <WebView originWhitelist={['*']} source={{ html: htmlContent }} />
// }

// export default DocumentViewer

import { Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview'
import * as FileSystem from 'expo-file-system'

interface DocumentViewerProps {
  filePath: string
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ filePath }) => {
  const [fileExists, setFileExists] = useState(false)

  useEffect(() => {
    const checkFile = async () => {
      try {
        const info = await FileSystem.getInfoAsync(filePath)
        if (info.exists) {
          setFileExists(true)
          // convertDocxToHtml()
        } else {
          console.warn('File does not exist:', filePath)
        }
      } catch (error) {
        console.error('Error checking file:', error)
      }
    }

    if (filePath) {
      checkFile()
    }
  }, [filePath])

  return (
    <>
      {!filePath || !fileExists ? (
        <Text>File not found or inaccessible</Text>
      ) : (
        <Text>{filePath}</Text>
      )}
    </>
  )
  // return <WebView source={{ uri: filePath }} />
  //  return <WebView originWhitelist={['*']} source={{ html: htmlContent }} />
}

export default DocumentViewer

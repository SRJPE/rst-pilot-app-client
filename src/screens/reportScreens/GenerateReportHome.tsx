import { Entypo } from '@expo/vector-icons'
import {
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  View,
  VStack,
} from 'native-base'

import { printToFileAsync } from 'expo-print'
import { shareAsync } from 'expo-sharing'
import ReportCard from '../../components/generateReport/ReportCard'
import GenerateReportNavButtons from '../../components/generateReport/GenerateReportNavButtons'
import { useState } from 'react'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  // create,
} from 'docx'
import { generateWordDocument } from '../../components/generateReport/docXGenerator'

const GenerateReportHome = ({ navigation }: { navigation: any }) => {
  let [name, setName] = useState('TEST')

  const tempData = {
    systemDate: new Date().toLocaleString(),
    programLead: "BENJAMMIN'",
    programLeadAgency: 'TEST AGENCY',
    streamName: 'TEST STREAM',
    programRunDesignationMethod: 'TEST RUN METHOD',
    programLeadPhoneNumber: '(123) 456-7890',
    programLeadEmail: 'TEST@EMAIL.COM',
    systemWeek: 'TEST WEEK',
  }

  const {
    systemDate,
    programLead,
    programLeadAgency,
    streamName,
    programRunDesignationMethod,
    programLeadPhoneNumber,
    programLeadEmail,
    systemWeek,
  } = tempData

  // const generateWordDocument = () => {
  //   let doc = new Document({
  //     sections: [
  //       {
  //         children: [
  //           new Paragraph({
  //             text: 'Hello YouTube',
  //             heading: HeadingLevel.TITLE,
  //           }),
  //           new Paragraph({
  //             text: 'Do you want to learn how to create a word document?',
  //             heading: HeadingLevel.HEADING_1,
  //           }),
  //           new Paragraph({ text: 'Of course you do!' }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({ text: 'My', bold: true, color: '#ff0000' }),
  //             ],
  //             bullet: { level: 0 },
  //           }),
  //           new Paragraph({ text: 'Bullet', bullet: { level: 0 } }),
  //           new Paragraph({ text: 'Point', bullet: { level: 1 } }),
  //           new Paragraph({ text: 'List!', bullet: { level: 0 } }),
  //         ],
  //       },
  //     ],
  //   })
  //   // const doc = create()
  //   // doc.addParagraph('Date: ' + reportDate.toLocaleString())
  //   // doc.addParagraph('To: ' + reportTo)
  //   // doc.addParagraph('From: ' + reportFrom)
  //   // doc.addParagraph('Biweekly report (' + reportPeriod + ')')
  //   // doc.addParagraph(
  //   //   'Please find attached preliminary daily estimates of passage, 90% confidence intervals, and fork length ranges of unmarked juvenile salmonids sampled at ' +
  //   //     streamName +
  //   //     ' for the period ' +
  //   //     reportPeriod +
  //   //     ' (Table 2). Race designation was assigned using ' +
  //   //     raceDesignationMethod +
  //   //     '.'
  //   // )
  //   // doc.addParagraph(
  //   //   'Please note that data contained in these reports is subject to revision as this data is preliminary and undergoing QA/QC procedures.'
  //   // )
  //   // doc.addParagraph(
  //   //   'If you have any questions, please feel free to contact me at ' +
  //   //     programLeadPhoneNumber +
  //   //     ' or ' +
  //   //     programLeadEmail +
  //   //     '.'
  //   // )
  //   // doc.addParagraph('Methodology for generating passage estimates:')
  //   // doc.addParagraph(
  //   //   'Passage estimates are modeled by expanding the raw count of catch at RST by weekly Bailey’s Efficiency numbers (recaptures/releases). If no efficiency trials are performed in a week, a historical average Bailey’s Efficiency is used for that week.'
  //   // )
  //   Packer.toBase64String(doc).then((base64) => {
  //     const filename = FileSystem.documentDirectory + 'MyWordDocument.docx'
  //     FileSystem.writeAsStringAsync(filename, base64, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     }).then(() => {
  //       console.log(`Saved file: ${filename}`)
  //       Sharing.shareAsync(filename)
  //     })
  //   })
  // }

  return (
    <>
      <View flex={1} bg='#fff' p='6%' borderColor='themeGrey' borderWidth='15'>
        <VStack space={6}>
          <Heading>Select a standard report to share</Heading>

          <Divider bg='black' />
          <HStack my='5' space='10' alignSelf='center'>
            {[1, 2, 3].map((i) => (
              <ReportCard key={i} navigation={navigation} />
            ))}
          </HStack>
          <Button bg='primary' onPress={() => generateWordDocument(tempData)}>
            Generate PDF
          </Button>
        </VStack>
      </View>
      <GenerateReportNavButtons navigation={navigation} />
    </>
  )
}
export default GenerateReportHome

// const html = `
// <html style="padding: 30px;">
//   <head>
//     <title>Biweekly Report</title>
//      <style>
//   body {
//     font-family: Arial, sans-serif;
//   }

//   h2 {
//     text-align: center;
//     color: #007BFF;
//   }

//   table {
//     width: 100%;
//     border-collapse: collapse;
//     margin-top: 20px;
//   }

//   th, td {
//     padding: 10px;
//     text-align: center;
//     border: 1px solid #ddd;
//   }

//   th {
//     background-color: #007BFF;
//     color: white;
//   }

//   tr:nth-child(even) {
//     background-color: #f2f2f2;
//   }

//   tr:hover {
//     background-color: #ddd;
//   }
// </style>
//   </head>

//   <body>
//     <h2>Date: ${systemDate}</h2>
//     <p>To: Interested Parties</p>
//     <p>From: ${programLead}, ${programLeadAgency}</p>
//     <h3>Biweekly report ([Sys Date - 14] - ${systemDate})</h3>
//     <p>Please find attached preliminary daily estimates of passage, 90% confidence intervals, and fork length ranges of unmarked juvenile salmonids sampled at ${streamName} for the period [Sys Date - 14] through ${systemDate} (Table 2). Race designation was assigned using ${programRunDesignationMethod}.</p>
//     <p>Please note that data contained in these reports is subject to revision as this data is preliminary and undergoing QA/QC procedures.</p>
//     <p>If you have any questions, please feel free to contact me at ${programLeadPhoneNumber}, ${programLeadEmail}.</p>

//     <h3>Methodology for generating passage estimates:</h3>
//     <p>Passage estimates are modeled by expanding the raw count of catch at RST by weekly Bailey’s Efficiency numbers (recaptures/releases). If no efficiency trials are performed in a week, a historical average Bailey’s Efficiency is used for that week.</p>
//     <h3>Table 1 Historical mean cumulative passage for week ${systemWeek} and run.</h3>
//     <table >
//       <tr>
//         <th>Date</th>
//         <th>Discharge volume (cfs)</th>
//         <th>Water temperature (°C)</th>
//         <th>Water turbidity (NTU)</th>
//         <th>BY22 Winter</th>
//         <th>BY22 Spring</th>
//         <th>BY22 Fall</th>
//         <th>BY22 Late-Fall</th>
//         <th>BY22 RBT</th>
//       </tr>
//       <tr>
//         <td>Sample Date 1</td>
//         <td>123</td>
//         <td>12.5</td>
//         <td>5.6</td>
//         <td>${'2,543\n(52 - 78)'}</td>
//         <td>Value 2</td>
//         <td>Value 3</td>
//         <td>Value 4</td>
//         <td>Value 5</td>
//       </tr>
//       <tr>
//         <td>Sample Date 2</td>
//         <td>456</td>
//         <td>15.2</td>
//         <td>7.8</td>
//         <td>Value 6</td>
//         <td>Value 7</td>
//         <td>Value 8</td>
//         <td>Value 9</td>
//         <td>Value 10</td>
//       </tr>
//     </table>
//     <h3>Table 2 Passage Estimates</h3>
//     <h3>Figure 1 </h3>
//   </body>
// </html>`

// let generatePdf = async () => {
//   const file = await printToFileAsync({
//     html: html,
//     margins: {
//       left: 20,
//       top: 50,
//       right: 20,
//       bottom: 100,
//     },
//     base64: false,
//   })

//   await shareAsync(file.uri)
// }

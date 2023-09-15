import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
// import { saveAs } from 'file-saver'

import {
  AlignmentType,
  SectionType,
  PageOrientation,
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  TextDirection,
  HeightRule,
} from 'docx'
import { uid } from 'uid'

export const generateWordDocument = (tempData: any) => {
  const {
    programLead,
    programLeadAgency,
    systemDate,
    streamName,
    programRunDesignationMethod,
    programLeadPhoneNumber,
    programLeadEmail,
    systemWeek,
  } = tempData

  const createParagraph = (text: string): Paragraph => {
    return new Paragraph({
      spacing: {
        after: 250,
      },
      children: [
        new TextRun({
          text,
          size: 25,
        }),
      ],
    })
  }

  const createTable = () => {
    const tableData = {
      headers: [
        'Date',
        'Discharge volume (cfs)',
        'Water temperature (°C)',
        'Water turbidity (NTU)',
        'BY22 Winter',
        'BY22 Spring',
        'BY22 Fall',
        'BY22 Late-Fal',
        'BY22 RBT',
      ],
    }
    return new Table({
      width: {
        // size: 14535,
        // type: WidthType.DXA,
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          tableHeader: true,
          // height: { value: 40, rule: HeightRule.AUTO },
          children: [
            ...tableData.headers.map((headerText: string) => {
              return new TableCell({
                // width: {
                //   size: 3505,
                //   type: WidthType.DXA,
                // },

                children: [new Paragraph(headerText)],
                width: {
                  size: 100 / tableData.headers.length,
                  type: WidthType.PERCENTAGE,
                },
              })
            }),
          ],
        }),
      ],
    })
  }

  let doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            // heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 300,
            },
            children: [
              new TextRun({
                text: 'United States Department of the Interior',
                bold: true,
                size: 50,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 800,
            },
            children: [
              new TextRun({
                text: 'FISH AND WILDLIFE SERVICE',
                allCaps: true,
                size: 30,
              }),
              new TextRun({
                text: 'Red Bluff Fish & Wildlife Office',
                break: 1,
                size: 25,
              }),
              new TextRun({
                text: '10950 Tyler Road, Red Bluff, California 96080',
                break: 1,
                size: 25,
              }),
              new TextRun({
                text: '(530) 527-3043, FAX (530) 529-0292',
                break: 1,
                size: 25,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: {
              after: 250,
            },
            children: [
              new TextRun({
                text: `${systemDate}`,
                size: 25,
              }),
            ],
          }),
          createParagraph('To: Interested Parties'),
          createParagraph(`From: ${programLead}, ${programLeadAgency}`),
          createParagraph(
            `Subject: Biweekly report( [SYS DATE - 14] - ${systemDate})`
          ),
          createParagraph(
            `Please find attached preliminary daily estimates of passage, 90% confidence intervals, and fork length ranges of unmarked juvenile salmonids sampled at ${streamName} for the period [SYS Date - 14] through ${systemDate}. Race designation was assigned using ${programRunDesignationMethod}.`
          ),
          createParagraph(
            `Please note that data contained in these reports is subject to revision as this data is preliminary and undergoing QA/QC procedures.`
          ),
          createParagraph(
            `If you have any questions, please feel free to contact me at ${programLeadPhoneNumber}, ${programLeadEmail}.`
          ),
          // createTable(),
        ],
      },
      {
        properties: {
          // type: SectionType.NEXT_PAGE,
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
          },
        },
        children: [
          createParagraph(
            `Table 1.─ Preliminary estimates of passage by brood-year (BY) and run for unmarked juvenile Chinook salmon and steelhead trout captured by rotary- screw traps at Red Bluff Diversion Dam (RK391), Sacramento River, CA, for the dates listed below. Results include estimated passage, peak river discharge volume, water temperature, turbidity, and fork length (mm) range in parentheses. A dash (-) indicates that sampling was not conducted on that date.`
          ),
          createTable(),
        ],
      },
    ],
  })
  // const b64DecodeUnicode = (string: string) => {
  //   return decodeURIComponent(
  //     Array.prototype.map
  //       .call(atob(string), function (c) {
  //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  //       })
  //       .join('')
  //   )
  // }
  function b64DecodeUnicode(str: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
  }

  // function fromBinary(encoded: string) {
  //   const binary = atob(encoded)
  //   const bytes = new Uint8Array(binary.length)
  //   for (let i = 0; i < bytes.length; i++) {
  //     bytes[i] = binary.charCodeAt(i)
  //   }
  //   console.log(
  //     '🚀 ~ fromBinary ~ String.fromCharCode(...new Uint16Array(bytes.buffer)):',
  //     String.fromCharCode(...new Uint16Array(bytes.buffer))
  //   )
  //   return String.fromCharCode(...new Uint16Array(bytes.buffer))
  // }

  // Packer.toBase64String(doc).then((string) => {
  //   console.log('🚀 ~ Packer.toBase64String ~ base64:', string)
  //   const filename =
  //     FileSystem.documentDirectory + `MyWordDocument${uid()}.docx`
  //   console.log('🚀 ~ Packer.toBase64String ~ filename:', filename)
  //   const encoder = new TextEncoder()
  //   // const utf8 = new Uint8Array(string.length)
  //   const test = b64DecodeUnicode(string)
  //   // const test = await b64DecodeUnicode(string)
  //   // const test = encoder.encode(string)
  //   console.log('🚀 ~ Packer.toBase64String ~ test:', test)

  //   // const uint8array = new TextEncoder().encode(string)
  //   // console.log('🚀 ~ Packer.toBase64String ~ uint8array:', uint8array)
  //   // const test = new TextDecoder().decode(uint8array)
  //   // console.log('🚀 ~ Packer.toBase64String ~ test:', test)
  //   const decodedData = atob(string)
  //   console.log('🚀 ~ Packer.toBase64String ~ decodedData:', decodedData)

  //   FileSystem.writeAsStringAsync(filename, decodedData).then(() => {
  //     console.log(`Saved file: ${filename}`)
  //     Sharing.shareAsync(filename)
  //   })
  // })
  Packer.toBase64String(doc).then((base64) => {
    const filename =
      FileSystem.documentDirectory + `MyWordDocument${uid()}.docx`
    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      console.log(`Saved file: ${filename}`)
      Sharing.shareAsync(filename)
    })
  })
}

// styles: {
//   default: {
//     // heading1: {
//     //   run: {
//     //     size: 28,
//     //     bold: true,
//     //     italics: true,
//     //     color: 'FF0000',
//     //   },
//     //   paragraph: {
//     //     spacing: {
//     //       after: 120,
//     //     },
//     //   },
//     // },
//     // heading2: {
//     //   run: {
//     //     size: 26,
//     //     bold: true,
//     //     underline: {
//     //       type: UnderlineType.DOUBLE,
//     //       color: 'FF0000',
//     //     },
//     //   },
//     //   paragraph: {
//     //     spacing: {
//     //       before: 240,
//     //       after: 120,
//     //     },
//     //   },
//     // },
//     // listParagraph: {
//     //   run: {
//     //     color: '#FF0000',
//     //   },
//     // },
//     document: {
//       run: {
//         size: 5,
//         font: 'Calibri',
//       },
//       paragraph: {
//         alignment: AlignmentType.RIGHT,
//       },
//     },
//   },
// },

// new Paragraph({
//   spacing: {
//     after: 200,
//   },
//   children: [
//     new TextRun({
//       text: 'To: Interested Parties',
//       size: 25,
//     }),
//   ],
// }),
// new Paragraph({
//   spacing: {
//     after: 200,
//   },
//   children: [
//     new TextRun({
//       text: 'From: Scott Voss, Supervisory Fish Biologist, Red Bluff Fish and Wildlife Office',
//       size: 25,
//     }),
//   ],
// }),
// new Paragraph({
//   spacing: {
//     after: 200,
//   },
//   children: [
//     new TextRun({
//       text: 'Subject: Biweekly report (November 5, 2022 - November 18, 2022)',
//       size: 25,
//     }),
//   ],
// }),
// new Paragraph({
//   spacing: {
//     after: 200,
//   },
//   children: [
//     new TextRun({
//       text: 'Please find attached preliminary daily estimates of passage, 90% confidence intervals, and fork length ranges of unmarked juvenile salmonids sampled at Red Bluff Diversion Dam for the period November 5, 2022 through November 18, 2022. Race designation was assigned using length-at-date criteria.',
//       size: 25,
//     }),
//   ],
// }),
// new Paragraph({
//   spacing: {
//     after: 200,
//   },
//   children: [
//     new TextRun({
//       text: 'Mean cumulative weekly passage of winter Chinook thru November 18 (week 46) for the last 20 years of passage data is 88.0% ± 8.9%.',
//       size: 25,
//     }),
//   ],
// }),
// new Paragraph({
//   spacing: {
//     after: 200,
//   },
//   children: [
//     new TextRun({
//       text: 'Please note that data contained in these reports is subject to revision as this data is preliminary and undergoing QA/QC procedures.',
//       size: 25,
//     }),
//   ],
// }),
// new Paragraph({
//   spacing: {
//     after: 200,
//   },
//   children: [
//     new TextRun({
//       text: 'If you have any questions, please feel free to contact me at (530) 527-3043 ext 243.',
//       size: 25,
//     }),
//   ],
// }),

// new TableRow({
//   tableHeader: true,
//   children: [
//     new TableCell({
//       width: {
//         size: 3505,
//         type: WidthType.DXA,
//       },
//       children: [new Paragraph('Date')],
//     }),

//     new TableCell({
//       width: {
//         size: 3505,
//         type: WidthType.DXA,
//       },
//       children: [new Paragraph('Discharge volume (cfs)')],
//     }),

//     new TableCell({
//       width: {
//         size: 3505,
//         type: WidthType.DXA,
//       },
//       children: [new Paragraph('Water temperature (°C)')],
//     }),

//     new TableCell({
//       width: {
//         size: 3505,
//         type: WidthType.DXA,
//       },
//       children: [new Paragraph('Water turbidity (NTU)')],
//     }),

//     new TableCell({
//       width: {
//         size: 3505,
//         type: WidthType.DXA,
//       },
//       children: [new Paragraph('BY22 Winter')],
//     }),
//     new TableCell({
//       width: {
//         size: 3505,
//         type: WidthType.DXA,
//       },
//       children: [new Paragraph('BY22 Spring')],
//     }),
//     new TableCell({
//       width: {
//         size: 3505,
//         type: WidthType.DXA,
//       },
//       children: [new Paragraph('BY22 Fall')],
//     }),
//     new TableCell({
//       width: {
//         size: 3505,
//         type: WidthType.DXA,
//       },
//       children: [new Paragraph('BY22 Late-Fal')],
//     }),
//     new TableCell({
//       width: {
//         size: 3505,
//         type: WidthType.DXA,
//       },
//       children: [new Paragraph('BY22 RBT')],
//     }),
//   ],
// }),

import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { AlignmentType, Document, Packer, Paragraph, TextRun } from 'docx'
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
    ],
  })

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

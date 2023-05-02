import React from 'react'
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'

const useSavePdf = () => {
  const _4DContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pdf Content</title>
        <style>
            body {
                font-size: 16px;
                color: red;
            }

            h1 {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1>This is a sample 4d Download</h1>
       <table border="0" align="center" cellpadding="5" cellspacing="0" style="background-color:gold;border:5px solid darkolivegreen;color:darkolivegreen;font-size:150%;font-family:arial,helvetica,sans-serif;text-align:center;"><tbody><tr><td colspan="3" style="padding:5px;color:lightgoldenrodyellow;font-size:220%;border:5px solid lightgoldenrodyellow;text-align:center;"><img src="AbbeyRoad.jpg" width="200" height="200" align="left">Abby Road<br>The Beatles<br>Released 1969</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Side One:</td><td style="text-align:center;background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Come Together"</td><td style="text-align:center;background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Something"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">George Harrison</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Maxwell's Silver Hammer"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Oh! Darling"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Octopus's Garden"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Ringo Starr</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"I Want You (She's So Heavy)"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Side Two:</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Here Comes the Sun"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">George Harrison</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Because"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"You Never Give Me Your Money"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Sun King"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Mean Mr. Mustard"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Polythene Pam"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"She Came in Through the Bathroom Window"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Golden Slumbers"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Carry That Weight"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"The End"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:darkolivegreen;color:lightgoldenrodyellow;font-size:75%;border:5px solid lightgoldenrodyellow;white-space:nowrap;"></td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">"Her Majesty"</td><td style="background-color:lightgoldenrodyellow;border:5px solid lightgoldenrodyellow;white-space:nowrap;">Paul McCartney</td></tr></tbody></table>
    </body>
    </html>
`
  const scpContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pdf Content</title>
         <style>
            body {
                font-size: 16px;
                color: green;
            }

            h1 {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1>This is a sample SCP Download</h1>
       <table border="0" align="center" cellpadding="5" cellspacing="0" style="background-color:gold;border:5px solid gold;color:gold;font-size:150%;font-family:arial,helvetica,sans-serif;text-align:center;"><tbody><tr><td colspan="3" style="padding:5px;color:maroon;font-size:220%;border:5px solid maroon;text-align:center;"><img src="AbbeyRoad.jpg" width="200" height="200" align="left">Abby Road<br>The Beatles<br>Released 1969</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;">Side One:</td><td style="text-align:center;background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Come Together"</td><td style="text-align:center;background-color:maroon;border:5px solid maroon;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Something"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">George Harrison</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Maxwell's Silver Hammer"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Oh! Darling"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Octopus's Garden"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">Ringo Starr</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"I Want You (She's So Heavy)"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;">Side Two:</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Here Comes the Sun"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">George Harrison</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Because"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"You Never Give Me Your Money"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Sun King"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Mean Mr. Mustard"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Polythene Pam"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">John Lennon</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"She Came in Through the Bathroom Window"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Golden Slumbers"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Carry That Weight"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"The End"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">Paul McCartney</td></tr><tr><td style="text-align:center;background-color:gold;color:maroon;font-size:75%;border:5px solid maroon;white-space:nowrap;"></td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">"Her Majesty"</td><td style="background-color:maroon;border:5px solid maroon;white-space:nowrap;">Paul McCartney</td></tr></tbody></table>
    </body>
    </html>
`

  const createAndSavePDF = async (html: string) => {
    try {
      const { uri } = await Print.printToFileAsync({ html })

      await shareAsync(uri)
    } catch (error) {
      console.error(error)
    }
  }
  return { _4DContent, scpContent, createAndSavePDF }
}

export default useSavePdf
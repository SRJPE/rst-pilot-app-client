/**
 * Mill Creek, Deer Creek, Feather River, and Yuba River are the programs the
 * app's hardcoded fields (flow measure, water temperature, water turbidity,
 * debris volume, total revolutions, RPM after) were originally built around.
 *
 * `shouldRenderField` (utils.ts) defaults these fields to visible ONLY when a
 * program has zero `program_fields` rows configured at all — the instant a
 * program has ANY row (e.g. a custom field added through the dashboard's Add
 * Form Field flow for an unrelated section), that check flips and these
 * fields require an explicit row to keep showing. Since these four programs
 * never had rows for their own hardcoded fields, adding literally any custom
 * field to Mill/Deer/Feather/Yuba would silently hide all of them.
 *
 * This guard keeps that from ever mattering for these four programs: their
 * hardcoded fields always render, independent of whatever else has been
 * configured. Other programs (which opted into the custom-fields system)
 * keep the normal explicit-configuration behavior.
 *
 * Leaf module on purpose — importing from ../utils would drag
 * @react-navigation/native into a module we want plain-node testable.
 */
export const isCoreLegacyProgram = (program: any) => {
  const streamName = (program?.streamName ?? '').toLowerCase()
  return ['mill', 'deer', 'feather', 'yuba'].some(name =>
    streamName.includes(name)
  )
}

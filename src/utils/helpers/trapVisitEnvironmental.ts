import { find, uniqBy } from 'lodash'
// Leaf module on purpose — importing from ../utils would drag
// @react-navigation/native into a pure data-shaping helper.
import { calcAvgValue } from './math'

/**
 * Builds the trapVisitEnvironmental payload for a trap visit submission.
 *
 * Extracted from IncompleteSections so every submission path shares one
 * implementation. Previously three of the four paths (StartedTrapping,
 * NoFishCaught, HighFlows) hardcoded only the three legacy rows, so anything a
 * user created from the dashboard was silently discarded on those paths.
 *
 * Two rules here are load-bearing:
 *
 * 1. measureValueNumeric must be `null`, never `undefined`. The server drops
 *    rows where it is undefined (models/trapVisit/index.ts) with a 200 response
 *    — that is why a text/select value can look saved and not be.
 *
 * 2. ENVIRONMENTAL_FIELDS_TO_IGNORE must stay. `waterTurbidity` is seeded
 *    isEnvironmentalField: true, so without it we would emit both
 *    'water turbidity' (legacy, space-separated) and 'waterTurbidity'
 *    (camelCase) — and the dashboard's sanitizeFieldName maps BOTH to
 *    `water_turbidity`, so they would silently collide last-wins.
 */

export const ENVIRONMENTAL_FIELDS_TO_IGNORE = [
  'flowMeasure',
  'waterTemperature',
  'waterTurbidity',
]

// trap_visit_environmental column widths (see the widen migration).
const MEASURE_NAME_MAX = 100
const MEASURE_TEXT_MAX = 255

/** Field types whose value is text, never numeric. */
const TEXT_FIELD_TYPES = ['select', 'multi-select', 'radio', 'textarea']

/**
 * True only for a genuinely absent value.
 *
 * The previous code tested truthiness (`values.x ? ... : undefined`), which
 * also caught 0 — and the server DROPS rows whose measureValueNumeric is
 * undefined, silently, with a 200. So a recorded reading of 0 ("no flow")
 * vanished and became indistinguishable from "not measured".
 */
const isBlank = (value: any) =>
  value === undefined ||
  value === null ||
  value === '' ||
  // A NaN here means an empty numeric input was coerced somewhere upstream.
  // Without this guard it reaches the DB as the literal text "NaN".
  (typeof value === 'number' && Number.isNaN(value))

const toNumeric = (value: any) => {
  if (isBlank(value)) return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const toText = (value: any) => (isBlank(value) ? undefined : String(value))

/**
 * The three legacy rows. Names are space-separated for backward compatibility —
 * historical data uses them and the dashboard's sanitizeFieldName maps
 * 'water temperature' and 'waterTemperature' onto the same key either way.
 */
export const buildBaseEnvironmentalRows = (values: any) =>
  [
    {
      measureName: 'flow measure',
      measureValueNumeric: toNumeric(values.flowMeasure),
      measureValueText: toText(values.flowMeasure),
      measureUnit: 5,
    },
    {
      measureName: 'water temperature',
      measureValueNumeric: toNumeric(values.waterTemperature),
      measureValueText: toText(values.waterTemperature),
      measureUnit: values.waterTemperatureUnit === '°F' ? 1 : 2,
    },
    // waterTurbidity intentionally left alone: it branches on the separate
    // waterTurbidityIsPresent / recordTurbidityInPostProcessing flags rather
    // than on value truthiness, so it already stores a recorded 0 correctly,
    // and the null-vs-undefined distinction here is meaningful.
    {
      measureName: 'water turbidity',
      measureValueNumeric:
        values.waterTurbidityIsPresent && !isBlank(values.waterTurbidity)
          ? Number(values.waterTurbidity)
          : values?.recordTurbidityInPostProcessing
            ? null
            : undefined,
      measureValueText:
        values.waterTurbidityIsPresent && !isBlank(values.waterTurbidity)
          ? String(values.waterTurbidity)
          : values?.recordTurbidityInPostProcessing
            ? ''
            : undefined,
      measureUnit: 25,
    },
  ] as Array<any>

/**
 * One row per environmental form field the program has configured.
 * Multi-select values are comma-joined into a single row — NOT one row per
 * option — because the dashboard flattens by measureName into a single object
 * key, so duplicate names would overwrite each other.
 */
export const buildDynamicEnvironmentalRows = (
  values: any,
  programFormFields: Array<any>
) => {
  // The same form field appears once per equipmentId, so dedupe by name.
  const envFields = uniqBy(
    (programFormFields ?? []).filter(
      (field: any) =>
        field?.isEnvironmentalField &&
        !ENVIRONMENTAL_FIELDS_TO_IGNORE.includes(field.fieldName)
    ),
    'fieldName'
  )

  const rows: Array<any> = []

  envFields.forEach((field: any) => {
    const raw = values[field.fieldName]

    if (raw === undefined || raw === null || raw === '') return
    if (Array.isArray(raw) && raw.length === 0) return

    let text: string
    let numeric: number | null = null
    let unit: number | null = null

    if (Array.isArray(raw)) {
      text = raw.join(', ')
    } else if (
      // Check the declared type BEFORE coercing. Otherwise a text field whose
      // value happens to be digits (flowMeterSerialNumber = "12345") gets
      // stored as a number.
      TEXT_FIELD_TYPES.includes(field.fieldType) ||
      field.inputType === 'text'
    ) {
      text = String(raw)
    } else {
      text = String(raw)
      const parsed = Number(raw)
      if (!Number.isNaN(parsed)) {
        numeric = parsed
        unit = field.unitId ?? null
      }
    }

    rows.push({
      measureName: String(field.fieldName).slice(0, MEASURE_NAME_MAX),
      measureValueNumeric: numeric, // null, never undefined
      measureValueText: text.slice(0, MEASURE_TEXT_MAX),
      measureUnit: unit,
    })
  })

  return rows
}

/** Derived rows that aren't 1:1 with a form field. */
const buildDerivedEnvironmentalRows = (
  values: any,
  envFieldNames: Array<string>
) => {
  const rows: Array<any> = []

  if (values.turbidity1 && values.turbidity2 && values.turbidity3) {
    const meanFNU = calcAvgValue([
      values.turbidity1,
      values.turbidity2,
      values.turbidity3,
    ])
    rows.push({
      measureName: 'meanFNU',
      measureValueNumeric: meanFNU,
      measureValueText: meanFNU?.toString(),
      measureUnit: 38, // fnu
    })
  }

  if (envFieldNames.includes('riverDepth')) {
    rows.push(
      {
        measureName: 'riverLeft',
        measureValueNumeric: values.riverLeft,
        measureValueText: values.riverLeft?.toString(),
        measureUnit: 9,
      },
      {
        measureName: 'riverCenter',
        measureValueNumeric: values.riverCenter,
        measureValueText: values.riverCenter?.toString(),
        measureUnit: 9,
      },
      {
        measureName: 'riverRight',
        measureValueNumeric: values.riverRight,
        measureValueText: values.riverRight?.toString(),
        measureUnit: 9,
      }
    )
  }

  return rows
}

/**
 * Full payload: the three legacy rows, then one row per configured
 * environmental field, then derived rows.
 *
 * `baseValues` and `values` are separate on purpose. The three legacy rows have
 * always read from Trap Operations specifically; environmental *form fields*
 * can live in either Trap Operations or Trap Post-Processing, so they need the
 * merged object. Feeding the merged object to the legacy rows lets a blank
 * post-processing field clobber a real operations reading — which is exactly
 * how a recorded turbidity of "1234" became the text "NaN".
 */
export const buildTrapVisitEnvironmental = ({
  values,
  baseValues,
  programFormFields,
}: {
  /** Merged operations + post-processing values, for dynamic form fields. */
  values: any
  /** Source for the three legacy rows. Defaults to `values`. */
  baseValues?: any
  programFormFields: Array<any>
}) => {
  const envFieldNames = uniqBy(
    (programFormFields ?? []).filter(
      (field: any) =>
        field?.isEnvironmentalField &&
        !ENVIRONMENTAL_FIELDS_TO_IGNORE.includes(field.fieldName)
    ),
    'fieldName'
  ).map((field: any) => field.fieldName)

  return [
    ...buildBaseEnvironmentalRows(baseValues ?? values),
    ...buildDynamicEnvironmentalRows(values, programFormFields),
    ...buildDerivedEnvironmentalRows(values, envFieldNames),
  ]
}

/**
 * Resolves the program's form fields out of visitSetupDefaults.
 */
export const buildTrapVisitEnvironmentalForProgram = ({
  values,
  baseValues,
  programId,
  programs,
}: {
  values: any
  baseValues?: any
  programId: number
  programs: Array<any>
}) => {
  const selectedProgram = find(
    programs,
    (program: any) => program.id === programId
  )
  return buildTrapVisitEnvironmental({
    values,
    baseValues,
    programFormFields: selectedProgram?.programFormFields ?? [],
  })
}

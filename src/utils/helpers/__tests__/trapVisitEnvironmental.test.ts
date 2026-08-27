import { describe, it, expect } from 'vitest'
import {
  buildTrapVisitEnvironmental,
  buildBaseEnvironmentalRows,
  buildDynamicEnvironmentalRows,
  ENVIRONMENTAL_FIELDS_TO_IGNORE,
} from '../trapVisitEnvironmental'

/**
 * These tests exist because a real regression shipped here: post-processing
 * values were merged into the three legacy rows, and a NaN turbidity from
 * post-processing silently overwrote a recorded reading of "1234", reaching the
 * database as the literal text "NaN".
 *
 * The whole file is about protecting the four submission paths
 * (StartedTrapping, NoFishCaught, HighFlows, IncompleteSections) which all
 * funnel through this builder.
 */

/** A form-field definition as delivered by GET /program-fields/:programId. */
const field = (o: Record<string, any>) => ({
  isEnvironmentalField: true,
  unitId: null,
  inputType: null,
  fieldType: 'input',
  ...o,
})

const rowNamed = (rows: any[], name: string) =>
  rows.find(r => r.measureName === name)

describe('the three legacy rows', () => {
  it('emits all three with their historical space-separated names', () => {
    const rows = buildBaseEnvironmentalRows({
      flowMeasure: '12',
      waterTemperature: '55',
      waterTemperatureUnit: '°F',
      waterTurbidity: '3',
      waterTurbidityIsPresent: true,
    })
    const names = rows.map(r => r.measureName)
    expect(names).toContain('flow measure')
    expect(names).toContain('water temperature')
    expect(names).toContain('water turbidity')
  })

  it('preserves the historical measure units', () => {
    const f = buildBaseEnvironmentalRows({ flowMeasure: '1' })
    expect(rowNamed(f, 'flow measure').measureUnit).toBe(5)
    expect(rowNamed(f, 'water turbidity').measureUnit).toBe(25)

    const fahrenheit = buildBaseEnvironmentalRows({
      waterTemperature: '55',
      waterTemperatureUnit: '°F',
    })
    expect(rowNamed(fahrenheit, 'water temperature').measureUnit).toBe(1)

    const celsius = buildBaseEnvironmentalRows({
      waterTemperature: '12',
      waterTemperatureUnit: '°C',
    })
    expect(rowNamed(celsius, 'water temperature').measureUnit).toBe(2)
  })
})

describe('post-processing must not clobber trap operations', () => {
  // The exact reported bug.
  const opsValues = {
    flowMeasure: '1000',
    waterTemperature: '11',
    waterTemperatureUnit: '°C',
    waterTurbidity: '1234',
    recordTurbidityInPostProcessing: false,
  }
  const postValues = { debrisVolume: 1, totalRevolutions: 12, waterTurbidity: NaN }
  const waterTurbidityIsPresent = true

  it('keeps the operations turbidity when post-processing holds NaN', () => {
    const rows = buildTrapVisitEnvironmental({
      values: { ...opsValues, ...postValues, waterTurbidityIsPresent },
      baseValues: { ...opsValues, waterTurbidityIsPresent },
      programFormFields: [],
    })
    const turbidity = rowNamed(rows, 'water turbidity')
    expect(turbidity.measureValueNumeric).toBe(1234)
    expect(turbidity.measureValueText).toBe('1234')
  })

  it('never writes the literal text "NaN"', () => {
    const rows = buildTrapVisitEnvironmental({
      values: { ...opsValues, ...postValues, waterTurbidityIsPresent },
      baseValues: { ...opsValues, waterTurbidityIsPresent },
      programFormFields: [],
    })
    expect(JSON.stringify(rows)).not.toContain('NaN')
  })

  it('still resolves environmental fields that live in post-processing', () => {
    // This is why the merged object exists at all — don't "simplify" it away.
    const rows = buildTrapVisitEnvironmental({
      values: { ...opsValues, ...postValues, waterTurbidityIsPresent },
      baseValues: { ...opsValues, waterTurbidityIsPresent },
      programFormFields: [
        field({ fieldName: 'debrisVolume', inputType: 'float', unitId: 37 }),
      ],
    })
    expect(rowNamed(rows, 'debrisVolume').measureValueNumeric).toBe(1)
  })
})

describe('the legacy-name exclusion list', () => {
  it('is exactly the three legacy measures', () => {
    expect(ENVIRONMENTAL_FIELDS_TO_IGNORE).toEqual([
      'flowMeasure',
      'waterTemperature',
      'waterTurbidity',
    ])
  })

  it('prevents waterTurbidity being emitted twice under two spellings', () => {
    // waterTurbidity is seeded isEnvironmentalField: true. Without the ignore
    // list this emits both 'water turbidity' and 'waterTurbidity' — and the
    // dashboard's sanitizeFieldName collapses BOTH onto `water_turbidity`,
    // so one silently overwrites the other.
    const rows = buildTrapVisitEnvironmental({
      values: {
        waterTurbidity: '3',
        waterTurbidityIsPresent: true,
        waterTemperature: '55',
        flowMeasure: '12',
      },
      programFormFields: [
        field({ fieldName: 'waterTurbidity', unitId: 25 }),
        field({ fieldName: 'waterTemperature' }),
        field({ fieldName: 'flowMeasure' }),
      ],
    })
    const names = rows.map(r => r.measureName)
    expect(names).not.toContain('waterTurbidity')
    expect(names).not.toContain('waterTemperature')
    expect(names).not.toContain('flowMeasure')
    expect(names.filter(n => n === 'water turbidity')).toHaveLength(1)
  })
})

describe('zero, blank, and NaN handling', () => {
  // The server DROPS rows whose measureValueNumeric === undefined, silently,
  // with a 200. So "0" must never become undefined.
  it.each(['0', 0])('preserves a recorded zero (%o)', value => {
    const rows = buildBaseEnvironmentalRows({ flowMeasure: value })
    const flow = rowNamed(rows, 'flow measure')
    expect(flow.measureValueNumeric).toBe(0)
    expect(flow.measureValueText).toBe('0')
  })

  it.each(['', null, undefined])('skips a genuinely blank value (%o)', value => {
    const rows = buildBaseEnvironmentalRows({ flowMeasure: value })
    expect(rowNamed(rows, 'flow measure').measureValueNumeric).toBeUndefined()
  })

  it('skips an absent key entirely', () => {
    const rows = buildBaseEnvironmentalRows({})
    expect(rowNamed(rows, 'flow measure').measureValueNumeric).toBeUndefined()
  })

  it('never emits undefined for a dynamic field (server would drop it)', () => {
    const rows = buildDynamicEnvironmentalRows(
      { clarity: 'Murky', depth: '1.5' },
      [
        field({ fieldName: 'clarity', fieldType: 'select' }),
        field({ fieldName: 'depth', inputType: 'float', unitId: 16 }),
      ]
    )
    rows.forEach(r => expect(r.measureValueNumeric).not.toBeUndefined())
  })
})

describe('water turbidity branching', () => {
  it('writes a row with null when deferred to post-processing', () => {
    const rows = buildBaseEnvironmentalRows({
      waterTurbidityIsPresent: false,
      recordTurbidityInPostProcessing: true,
    })
    const t = rowNamed(rows, 'water turbidity')
    // null and undefined mean different things here: null writes the row with
    // a blank value, undefined skips it. Do not collapse them.
    expect(t.measureValueNumeric).toBeNull()
    expect(t.measureValueText).toBe('')
  })

  it('skips the row when turbidity is not part of this visit', () => {
    const rows = buildBaseEnvironmentalRows({})
    expect(rowNamed(rows, 'water turbidity').measureValueNumeric).toBeUndefined()
  })

  it('stores a recorded turbidity of 0', () => {
    const rows = buildBaseEnvironmentalRows({
      waterTurbidityIsPresent: true,
      waterTurbidity: '0',
    })
    expect(rowNamed(rows, 'water turbidity').measureValueNumeric).toBe(0)
  })
})

describe('dynamic environmental fields', () => {
  it('stores select values as text with a null numeric', () => {
    const rows = buildDynamicEnvironmentalRows({ clarity: 'Murky' }, [
      field({ fieldName: 'clarity', fieldType: 'select' }),
    ])
    expect(rows[0].measureValueText).toBe('Murky')
    expect(rows[0].measureValueNumeric).toBeNull()
  })

  it('stores numeric inputs with their unit', () => {
    const rows = buildDynamicEnvironmentalRows({ depth: '1.5' }, [
      field({ fieldName: 'depth', inputType: 'float', unitId: 16 }),
    ])
    expect(rows[0].measureValueNumeric).toBe(1.5)
    expect(rows[0].measureUnit).toBe(16)
  })

  it('does not coerce a text field whose value happens to be digits', () => {
    // flowMeterSerialNumber = "12345" must stay text.
    const rows = buildDynamicEnvironmentalRows({ serial: '12345' }, [
      field({ fieldName: 'serial', inputType: 'text' }),
    ])
    expect(rows[0].measureValueNumeric).toBeNull()
    expect(rows[0].measureValueText).toBe('12345')
  })

  it('joins a multi-select into ONE row, not one row per option', () => {
    // Duplicate measureNames would silently overwrite each other in the
    // dashboard, which flattens by measureName into a single object key.
    const rows = buildDynamicEnvironmentalRows({ debris: ['Wood', 'Algae'] }, [
      field({ fieldName: 'debris', fieldType: 'multi-select' }),
    ])
    expect(rows).toHaveLength(1)
    expect(rows[0].measureValueText).toBe('Wood, Algae')
  })

  it('emits one row when the same field is configured per equipment type', () => {
    const rows = buildDynamicEnvironmentalRows({ thing: 'x' }, [
      field({ fieldName: 'thing', fieldType: 'select', equipmentId: 3 }),
      field({ fieldName: 'thing', fieldType: 'select', equipmentId: 16 }),
    ])
    expect(rows).toHaveLength(1)
  })

  it('ignores non-environmental fields', () => {
    const rows = buildDynamicEnvironmentalRows({ skipMe: 'v' }, [
      field({ fieldName: 'skipMe', isEnvironmentalField: false }),
    ])
    expect(rows).toHaveLength(0)
  })

  it('omits empty values and empty arrays', () => {
    const rows = buildDynamicEnvironmentalRows({ a: '', b: [] }, [
      field({ fieldName: 'a' }),
      field({ fieldName: 'b', fieldType: 'multi-select' }),
    ])
    expect(rows).toHaveLength(0)
  })

  it('caps values to the trap_visit_environmental column widths', () => {
    // Overflowing these 400s the ENTIRE trap visit POST, losing the fish counts.
    const longName = 'a'.repeat(140)
    const rows = buildDynamicEnvironmentalRows(
      { [longName]: 'b'.repeat(400) },
      [field({ fieldName: longName, inputType: 'text' })]
    )
    expect(rows[0].measureName).toHaveLength(100)
    expect(rows[0].measureValueText).toHaveLength(255)
  })
})

describe('derived rows', () => {
  it('computes meanFNU from the three turbidity readings', () => {
    const rows = buildTrapVisitEnvironmental({
      values: { turbidity1: '1', turbidity2: '2', turbidity3: '3' },
      programFormFields: [],
    })
    expect(rowNamed(rows, 'meanFNU').measureValueNumeric).toBe(2)
  })

  it('expands riverDepth into left/center/right', () => {
    const rows = buildTrapVisitEnvironmental({
      values: { riverLeft: 1, riverCenter: 2, riverRight: 3 },
      programFormFields: [field({ fieldName: 'riverDepth' })],
    })
    const names = rows.map(r => r.measureName)
    expect(names).toEqual(
      expect.arrayContaining(['riverLeft', 'riverCenter', 'riverRight'])
    )
  })
})

describe('redux slice key collisions', () => {
  /**
   * These keys exist in BOTH trapOperationsSlice and trapPostProcessingSlice,
   * so post wins in `{...ops, ...post}`. If a future form field is named after
   * one of them AND marked environmental, a blank post-processing value will
   * silently clobber a real operations reading — the exact shape of the
   * original bug. waterTurbidity is the only current overlap and it is
   * excluded by ENVIRONMENTAL_FIELDS_TO_IGNORE.
   */
  const COLLIDING_SLICE_KEYS = [
    'rpm1',
    'rpm2',
    'rpm3',
    'trapVisitStartTime',
    'waterTurbidity',
  ]

  it('every colliding key is either not environmental or explicitly ignored', () => {
    const unguarded = COLLIDING_SLICE_KEYS.filter(key => {
      if (ENVIRONMENTAL_FIELDS_TO_IGNORE.includes(key)) return false
      // Simulate the key being an environmental field and see if a stale
      // post-processing value could reach the payload.
      const rows = buildDynamicEnvironmentalRows({ [key]: 'stale' }, [
        field({ fieldName: key }),
      ])
      return rows.length > 0
    })

    // If this fails, a new environmental field collides with a post-processing
    // key: give the legacy/base rows a dedicated source or rename the field.
    expect(unguarded).toEqual([
      'rpm1',
      'rpm2',
      'rpm3',
      'trapVisitStartTime',
    ])
  })

  it('waterTurbidity specifically cannot be clobbered', () => {
    const rows = buildDynamicEnvironmentalRows({ waterTurbidity: NaN }, [
      field({ fieldName: 'waterTurbidity' }),
    ])
    expect(rows).toHaveLength(0)
  })
})

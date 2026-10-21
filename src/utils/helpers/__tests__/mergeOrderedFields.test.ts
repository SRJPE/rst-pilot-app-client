import { describe, it, expect } from 'vitest'
import {
  mergeOrderedFields,
  isLastInput,
  fieldHasSavedValue,
  FieldSlot,
} from '../mergeOrderedFields'

const slot = (
  fieldName: string,
  overrides: Partial<FieldSlot> = {}
): FieldSlot => ({
  fieldName,
  fieldType: 'input',
  width: '28%',
  visible: true,
  render: () => null,
  ...overrides,
})

const names = (entries: { fieldName: string }[]) =>
  entries.map(e => e.fieldName)

/**
 * Slot sets and order_index values below are the real production ones,
 * verified against the database - not invented examples.
 */
describe('mergeOrderedFields', () => {
  // Trap Operations' hardcoded fields, in current source order.
  const trapOpsSlots = [
    slot('rpmBefore', { fieldType: 'composite', width: '100%' }),
    slot('flowMeasure'),
    slot('waterTemperature'),
    slot('waterTurbidity'),
  ]

  it('falls back to exact slot source order when the program has no config', () => {
    // Mill/Deer/Feather/Yuba: zero program_fields rows. This is the safety
    // property - these programs must see no change at all.
    const merged = mergeOrderedFields({ configured: [], slots: trapOpsSlots })
    expect(names(merged)).toEqual([
      'rpmBefore',
      'flowMeasure',
      'waterTemperature',
      'waterTurbidity',
    ])
    expect(merged.every(e => e.kind === 'slot')).toBe(true)
  })

  it('moves a configured slot to its configured position', () => {
    // waterTemperature is order_index 0 for programs 5, 6, 7 and 8 - i.e.
    // deliberately dragged to first. It used to render buried mid-screen.
    const merged = mergeOrderedFields({
      configured: [{ fieldName: 'waterTemperature', orderIndex: 0 }],
      slots: trapOpsSlots,
    })
    expect(names(merged)).toEqual([
      'rpmBefore',
      'flowMeasure',
      'waterTurbidity',
      'waterTemperature',
    ])
  })

  it('honors a fully configured screen with no prefix left over', () => {
    // Butte (program 9) configures every Trap Operations slot.
    const merged = mergeOrderedFields({
      configured: [
        { fieldName: 'waterTemperature', orderIndex: 2 },
        { fieldName: 'waterTurbidity', orderIndex: 4 },
        { fieldName: 'flowMeasure', orderIndex: 5 },
        { fieldName: 'rpmBefore', orderIndex: 7 },
      ],
      slots: trapOpsSlots,
    })
    expect(names(merged)).toEqual([
      'waterTemperature',
      'waterTurbidity',
      'flowMeasure',
      'rpmBefore',
    ])
    // Every entry still renders via its bespoke slot widget, not the generic one.
    expect(merged.every(e => e.kind === 'slot')).toBe(true)
  })

  it('keeps a configured field that has no slot', () => {
    const merged = mergeOrderedFields({
      configured: [
        { fieldName: 'dissolvedOxygen', orderIndex: 3, fieldType: 'input' },
        { fieldName: 'waterTemperature', orderIndex: 2 },
      ],
      slots: trapOpsSlots,
    })
    expect(names(merged)).toEqual([
      'rpmBefore',
      'flowMeasure',
      'waterTurbidity',
      'waterTemperature',
      'dissolvedOxygen',
    ])
    expect(merged.find(e => e.fieldName === 'dissolvedOxygen')?.kind).toBe(
      'config'
    )
  })

  it('is deterministic with duplicate order_index values', () => {
    // Program 5's Trap Operations has 23 rows across range 0-19 - duplicates
    // are real. Equal indices must keep incoming (API) order, not shuffle.
    const configured = [
      { fieldName: 'a', orderIndex: 11 },
      { fieldName: 'b', orderIndex: 11 },
      { fieldName: 'c', orderIndex: 1 },
    ]
    const first = mergeOrderedFields({ configured, slots: [] })
    const second = mergeOrderedFields({ configured, slots: [] })
    expect(names(first)).toEqual(['c', 'a', 'b'])
    expect(names(second)).toEqual(names(first))
  })

  it('sorts unset order_index last, not first', () => {
    const merged = mergeOrderedFields({
      configured: [
        { fieldName: 'unset', orderIndex: null },
        { fieldName: 'second', orderIndex: 31 },
        { fieldName: 'first', orderIndex: 0 },
      ],
      slots: [],
    })
    expect(names(merged)).toEqual(['first', 'second', 'unset'])
  })

  it('handles gapped indices without inventing positions', () => {
    // Programs 7/8: 16 rows spanning 0-31.
    const merged = mergeOrderedFields({
      configured: [
        { fieldName: 'waterTurbidity', orderIndex: 31 },
        { fieldName: 'waterTemperature', orderIndex: 0 },
        { fieldName: 'debrisVolume', orderIndex: 30 },
      ],
      slots: trapOpsSlots,
    })
    expect(names(merged)).toEqual([
      'rpmBefore',
      'flowMeasure',
      'waterTemperature',
      'debrisVolume',
      'waterTurbidity',
    ])
    // Positions are dense regardless of the sparse source indices.
    expect(merged.map(e => e.position)).toEqual([0, 1, 2, 3, 4])
  })

  it('excludes invisible slots before assigning positions', () => {
    const merged = mergeOrderedFields({
      configured: [],
      slots: [
        slot('rpmBefore', { fieldType: 'composite', width: '100%' }),
        slot('flowMeasure', { visible: false }),
        slot('waterTemperature'),
      ],
    })
    expect(names(merged)).toEqual(['rpmBefore', 'waterTemperature'])
    expect(merged.map(e => e.position)).toEqual([0, 1])
  })

  it('does not resurrect an invisible slot via its config row', () => {
    const merged = mergeOrderedFields({
      configured: [{ fieldName: 'flowMeasure', orderIndex: 1 }],
      slots: [
        slot('flowMeasure', { visible: false }),
        slot('waterTemperature'),
      ],
    })
    // flowMeasure has no visible slot, so it falls through to generic
    // rendering rather than silently vanishing.
    expect(names(merged)).toEqual(['waterTemperature', 'flowMeasure'])
    expect(merged.find(e => e.fieldName === 'flowMeasure')?.kind).toBe('config')
  })
})

describe('fieldHasSavedValue', () => {
  it('is false for missing, null, undefined, or empty-string values', () => {
    expect(fieldHasSavedValue({}, 'counterStart')).toBe(false)
    expect(fieldHasSavedValue({ counterStart: null }, 'counterStart')).toBe(
      false
    )
    expect(
      fieldHasSavedValue({ counterStart: undefined }, 'counterStart')
    ).toBe(false)
    expect(fieldHasSavedValue({ counterStart: '' }, 'counterStart')).toBe(false)
    expect(fieldHasSavedValue(null, 'counterStart')).toBe(false)
    expect(fieldHasSavedValue(undefined, 'counterStart')).toBe(false)
  })

  it('is true once a real value - including 0 or false - has been entered', () => {
    expect(fieldHasSavedValue({ counterStart: '5' }, 'counterStart')).toBe(true)
    // '0'/0/false are real entered values, not "empty" - a crew recording a
    // literal zero must not be treated the same as never having answered.
    expect(fieldHasSavedValue({ counterStart: '0' }, 'counterStart')).toBe(true)
    expect(fieldHasSavedValue({ counterStart: 0 }, 'counterStart')).toBe(true)
    expect(fieldHasSavedValue({ trapInThalweg: false }, 'trapInThalweg')).toBe(
      true
    )
  })

  it('checks composite fields across any of several sub-field names', () => {
    expect(
      fieldHasSavedValue({ rpm1: null, rpm2: null, rpm3: null }, [
        'rpm1',
        'rpm2',
        'rpm3',
      ])
    ).toBe(false)
    expect(
      fieldHasSavedValue({ rpm1: null, rpm2: '12', rpm3: null }, [
        'rpm1',
        'rpm2',
        'rpm3',
      ])
    ).toBe(true)
  })
})

/**
 * Regression coverage for a real production bug: TrapOperations.tsx and
 * TrapPostProcessing.tsx populate programFormFields/sectionFields via a
 * useEffect that read selectedProgramId without listing it as a dependency.
 * On a cold app reload, selectedProgramId could resolve to its real value
 * AFTER the effect's other dependencies had already settled, permanently
 * stranding programFormFields/sectionFields at null/empty even once the real
 * config was available - silently dropping counterStart/counterEnd/
 * totalRevolutions from a form the crew had already filled in on a previous
 * screen visit. The dependency array is fixed, but this asserts the
 * independent safety net (`visible: config || fieldHasSavedValue(...)`, wired
 * at each call site) actually holds even if a timing bug like that recurs.
 */
describe('regression: config going stale must not drop an already-entered value', () => {
  it('keeps a slot visible via fieldHasSavedValue when config is stuck empty', () => {
    // Simulates the exact stuck state: the effect's stale-selectedProgramId
    // race left these at their `null`/`[]` fallback, but the crew already
    // saved a value on a prior pass through this screen. `savedValues` here
    // stands in for the screen's Formik `initialValues` - see the next
    // describe block for why it must never be live `values`.
    const staleConfigured: Array<{ fieldName: string; orderIndex?: number }> =
      []
    const savedValues = {
      counterStart: '5',
      counterEnd: '',
      totalRevolutions: '',
    }

    const slots: FieldSlot[] = [
      slot('counterStart', {
        visible: fieldHasSavedValue(savedValues, 'counterStart'), // config says no, saved value says yes
      }),
      slot('counterEnd', {
        visible: fieldHasSavedValue(savedValues, 'counterEnd'), // neither config nor a saved value
      }),
    ]

    const merged = mergeOrderedFields({ configured: staleConfigured, slots })
    expect(names(merged)).toEqual(['counterStart'])
  })
})

/**
 * Regression coverage for a second, more severe bug this same safety net
 * shipped with initially: it was wired to LIVE Formik `values` instead of the
 * screen's stable `initialValues`. For any field where the pure config check
 * is false, that ties the field's mount/unmount directly to its own live
 * value - so backspacing the input to empty flips fieldHasSavedValue false on
 * that very keystroke, `visible` goes false, and the input the crew is
 * actively editing disappears out from under them mid-edit. Fixed by having
 * every call site pass `initialValues` (only updated on navigation/save, per
 * TrapOperations.tsx/TrapPostProcessing.tsx's Formik setup) instead of
 * `values`. This test proves the CORRECT wiring is stable through an edit;
 * it cannot directly test the old broken wiring without reintroducing it.
 */
describe('regression: clearing a live input must not unmount it', () => {
  it('stays visible through a full type-then-backspace-to-empty cycle when config is stuck (via stable initialValues)', () => {
    const staleConfigured: Array<{ fieldName: string; orderIndex?: number }> =
      []
    // The screen's Formik initialValues - this is what must be passed to
    // fieldHasSavedValue, and it does NOT change as the crew types, since
    // TrapOperations.tsx/TrapPostProcessing.tsx only write back to the
    // persisted redux slice (which initialValues is sourced from) on
    // navigation/save, not on every keystroke.
    const initialValues = { counterStart: '5' }

    const buildSlots = (liveValues: Record<string, any>): FieldSlot[] => [
      slot('counterStart', {
        visible: fieldHasSavedValue(initialValues, 'counterStart'),
        render: () => liveValues.counterStart, // stand-in for the rendered input
      }),
    ]

    // Simulate the crew typing into the field, then deleting everything they
    // typed - a live `values` object that goes '5' -> '55' -> '' within one
    // continuous edit, while `initialValues` (above) never moves.
    const keystrokes = [{ counterStart: '5' }, { counterStart: '55' }, {}]

    for (const liveValues of keystrokes) {
      const merged = mergeOrderedFields({
        configured: staleConfigured,
        slots: buildSlots(liveValues),
      })
      // The field must stay mounted through every keystroke, including the
      // final one where the crew has backspaced it back to empty.
      expect(names(merged)).toEqual(['counterStart'])
    }
  })
})

describe('isLastInput', () => {
  const merged = mergeOrderedFields({
    configured: [],
    slots: [slot('a'), slot('b'), slot('c', { fieldType: 'select' })],
  })

  it('is false while a later text input remains', () => {
    expect(isLastInput(merged, 0)).toBe(false)
  })

  it('is true for the last input even when selects follow it', () => {
    // The old `index === length - 1` check kept the keyboard open here.
    expect(isLastInput(merged, 1)).toBe(true)
  })

  it('is true at the end of the list', () => {
    expect(isLastInput(merged, 2)).toBe(true)
  })
})

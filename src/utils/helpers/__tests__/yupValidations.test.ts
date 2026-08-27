import { describe, it, expect } from 'vitest'
import { getValidator } from '../yupValidations'

describe('getValidator — input field threshold enforcement', () => {
  it('enforces min/max threshold for a numeric input field even when inputType is not set', () => {
    // Mirrors real form_field rows (e.g. shrCode/shrkCode) and every
    // dashboard-created custom field: fieldType 'input' with a configured
    // threshold, but inputType left null since the dashboard modal doesn't
    // collect it.
    const field = {
      fieldName: 'shrCode',
      displayName: 'SHR Code',
      fieldType: 'input',
      inputType: null,
      minThreshold: 1,
      maxThreshold: 4,
      required: false,
    }
    const validator = getValidator(field)
    expect(validator.isValidSync(2)).toBe(true)
    expect(validator.isValidSync(0)).toBe(false)
    expect(validator.isValidSync(5)).toBe(false)
  })

  it('enforces a minThreshold of exactly 0 (falsy, previously skipped)', () => {
    const field = {
      fieldName: 'ph',
      displayName: 'pH',
      fieldType: 'input',
      inputType: 'float',
      minThreshold: 0,
      maxThreshold: 14,
      required: false,
    }
    const validator = getValidator(field)
    expect(validator.isValidSync(7)).toBe(true)
    expect(validator.isValidSync(-1)).toBe(false)
    expect(validator.isValidSync(15)).toBe(false)
  })

  it('still validates float/integer input fields as numeric (no regression)', () => {
    const field = {
      fieldName: 'waterTemperature',
      displayName: 'Water Temperature',
      fieldType: 'input',
      inputType: 'float',
      required: true,
    }
    const validator = getValidator(field)
    expect(validator.isValidSync(15.5)).toBe(true)
    expect(validator.isValidSync('not a number')).toBe(false)
  })

  it('keeps inputType "text" input fields validated as strings, not numbers', () => {
    const field = {
      fieldName: 'flowMeterSerialNumber',
      displayName: 'Flow Meter Serial Number',
      fieldType: 'input',
      inputType: 'text',
      required: false,
    }
    const validator = getValidator(field)
    expect(validator.isValidSync('SN-12345')).toBe(true)
  })

  it('has no custom threshold constraint beyond the baseline min(0) when none is configured', () => {
    const field = {
      fieldName: 'airTemp',
      displayName: 'Air Temp',
      fieldType: 'input',
      inputType: null,
      required: false,
    }
    const validator = getValidator(field)
    expect(validator.isValidSync(1000)).toBe(true)
    expect(validator.isValidSync(0)).toBe(true)
  })
})

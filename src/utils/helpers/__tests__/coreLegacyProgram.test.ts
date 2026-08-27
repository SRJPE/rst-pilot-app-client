import { describe, it, expect } from 'vitest'
import { isCoreLegacyProgram } from '../coreLegacyProgram'

/**
 * stream_name values are the real production values (verified against the
 * database), not assumed names — this is exactly the field
 * TrapOperations.tsx / TrapPostProcessing.tsx match against today at
 * selectedProgramObj.streamName.
 */
describe('isCoreLegacyProgram', () => {
  it.each([
    ['Mill Creek', true],
    ['Deer Creek', true],
    ['Feather River', true],
    ['Yuba River', true],
  ])('matches the core program with stream_name %s', (streamName, expected) => {
    expect(isCoreLegacyProgram({ streamName })).toBe(expected)
  })

  it.each([
    ['Toe Drain', false], // Yolo Bypass
    ['FlowWest Test', false],
    ['Clear Creek', false],
    ['Battle Creek', false],
    ['Butte Creek', false],
  ])('does not match other programs (%s)', (streamName, expected) => {
    expect(isCoreLegacyProgram({ streamName })).toBe(expected)
  })

  it('is case-insensitive', () => {
    expect(isCoreLegacyProgram({ streamName: 'MILL CREEK' })).toBe(true)
    expect(isCoreLegacyProgram({ streamName: 'yuba river' })).toBe(true)
  })

  it('does not false-positive on partial overlaps', () => {
    // "Butte Creek" must not match "yuba"/"mill"/"deer"/"feather" substrings.
    expect(isCoreLegacyProgram({ streamName: 'Butte Creek' })).toBe(false)
  })

  it('handles a missing/null program safely', () => {
    expect(isCoreLegacyProgram(null)).toBe(false)
    expect(isCoreLegacyProgram(undefined)).toBe(false)
    expect(isCoreLegacyProgram({})).toBe(false)
    expect(isCoreLegacyProgram({ streamName: null })).toBe(false)
  })
})

/**
 * Validates a parsed `submission_*.json` envelope (see
 * buildSubmissionPayloads.ts for how it's produced) before it's ever queued
 * for network submission. The server validates almost nothing on these
 * create routes, so this is the only thing standing between a corrupted or
 * hand-edited import file and a confusing raw Postgres error - or worse,
 * silently-wrong data landing on the server.
 *
 * Leaf module on purpose - no React/redux imports, plain-node testable.
 */

export interface ImportValidationResult {
  valid: boolean
  errors: string[]
}

const SUPPORTED_SCHEMA_VERSIONS = [1]

export function validateImportedSubmission(
  envelope: any
): ImportValidationResult {
  const errors: string[] = []

  if (!envelope || typeof envelope !== 'object') {
    return { valid: false, errors: ['File is not a valid submission JSON.'] }
  }

  if (!SUPPORTED_SCHEMA_VERSIONS.includes(envelope.schemaVersion)) {
    errors.push(
      `Unsupported schema version "${envelope.schemaVersion}" - this app only understands version(s) ${SUPPORTED_SCHEMA_VERSIONS.join(
        ', '
      )}. The file may have been exported by a newer or much older app version.`
    )
    // Nothing else here is trustworthy once the schema itself is unrecognized.
    return { valid: false, errors }
  }

  const trapVisit = envelope.trapVisit
  if (!trapVisit || typeof trapVisit !== 'object') {
    errors.push('Missing or invalid "trapVisit" in the submission file.')
  } else {
    if (typeof trapVisit.trapVisitUid !== 'string' || !trapVisit.trapVisitUid) {
      errors.push('Trap visit is missing its trapVisitUid.')
    }
    if (typeof trapVisit.programId !== 'number') {
      errors.push('Trap visit is missing a valid programId.')
    }
    if (typeof trapVisit.trapLocationId !== 'number') {
      errors.push('Trap visit is missing a valid trapLocationId.')
    }
    const start = trapVisit.trapVisitTimeStart
      ? new Date(trapVisit.trapVisitTimeStart)
      : null
    const end = trapVisit.trapVisitTimeEnd
      ? new Date(trapVisit.trapVisitTimeEnd)
      : null
    const hasValidStart = start && !isNaN(start.getTime())
    const hasValidEnd = end && !isNaN(end.getTime())
    if (!hasValidStart && !hasValidEnd) {
      errors.push(
        'Trap visit has no valid trapVisitTimeStart or trapVisitTimeEnd.'
      )
    }
    if (!Array.isArray(trapVisit.crew)) {
      // The server dereferences `crew` unconditionally with no null guard -
      // sending it without this key throws server-side instead of a clean
      // 400, so this must always be present (an empty array is fine).
      errors.push(
        'Trap visit is missing a crew array (can be empty, but must be present).'
      )
    }
    if (
      trapVisit.trapVisitEnvironmental !== undefined &&
      trapVisit.trapVisitEnvironmental !== null &&
      !Array.isArray(trapVisit.trapVisitEnvironmental)
    ) {
      errors.push('trapVisitEnvironmental must be an array when present.')
    }
  }

  const catchRaw = envelope.catchRaw
  if (catchRaw !== undefined && !Array.isArray(catchRaw)) {
    errors.push('"catchRaw" must be an array when present.')
  } else if (Array.isArray(catchRaw)) {
    const expectedUid = trapVisit?.trapVisitUid
    catchRaw.forEach((record: any, index: number) => {
      if (!record || typeof record !== 'object') {
        errors.push(`catchRaw[${index}] is not a valid object.`)
        return
      }
      if (expectedUid && record.uid !== expectedUid) {
        errors.push(
          `catchRaw[${index}] has uid "${record.uid}" which doesn't match this file's trap visit (${expectedUid}) - the file may be corrupted or hand-edited.`
        )
      }
      if (record.taxonCode === undefined || record.taxonCode === null) {
        errors.push(`catchRaw[${index}] is missing taxonCode.`)
      }
      ;['forkLength', 'weight', 'numFishCaught'].forEach(field => {
        const value = record[field]
        if (
          value !== undefined &&
          value !== null &&
          typeof value !== 'number'
        ) {
          errors.push(
            `catchRaw[${index}].${field} must be a number or null, got "${typeof value}".`
          )
        }
      })
    })
  }

  return { valid: errors.length === 0, errors }
}

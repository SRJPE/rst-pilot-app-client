import { find } from 'lodash'
import { useEffect, useRef, useState } from 'react'

/**
 * Counter Start, Counter End, and Total Revolutions are admin-configurable
 * fields whose `formSection` (Trap Operations vs Trap Post-Processing) is set
 * per program, not fixed in code. These hooks are shared by both screens so
 * the pre-fill/auto-calc behavior works identically no matter which screen a
 * program has configured each field onto.
 */

/** Most recent previously-submitted trap visit at the given trap location. */
export const useMostRecentTrapVisitForLocation = (
  previousTrapVisits: any,
  trapLocationId: number | null | undefined
) => {
  const [mostRecentTrapVisit, setMostRecentTrapVisit] = useState<any>(null)

  useEffect(() => {
    const visitsForLocation = (previousTrapVisits ?? [])
      .filter(
        (visit: any) =>
          visit.createdTrapVisitResponse.trapLocationId === trapLocationId
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.createdTrapVisitResponse.trapVisitTimeStart).getTime() -
          new Date(a.createdTrapVisitResponse.trapVisitTimeStart).getTime()
      )

    setMostRecentTrapVisit(visitsForLocation[0] ?? null)
  }, [previousTrapVisits, trapLocationId])

  return mostRecentTrapVisit
}

/**
 * Pre-fills `fieldName` with `sourceMeasureName`'s value from the previous
 * visit's recorded environmental readings, once, when `fieldName` is both
 * configured for the current screen and still blank. Never overwrites a
 * value the user has already entered — Counter Start at trap drop is not
 * guaranteed to match the previous visit's Counter End (the trap may have
 * been checked, bumped, or reset in between), so this is a starting default
 * the crew can freely correct, not an enforced value.
 */
export const usePrefillFieldFromPreviousVisit = ({
  fieldName,
  sourceMeasureName,
  sectionFields,
  activePage,
  values,
  setFieldValue,
  mostRecentTrapVisit,
}: {
  fieldName: string
  sourceMeasureName: string
  sectionFields: any
  activePage: string | undefined
  values: any
  setFieldValue: (field: string, value: any) => void
  mostRecentTrapVisit: any
}) => {
  useEffect(() => {
    if (
      !find(sectionFields, { fieldName, formSection: activePage }) ||
      values[fieldName] ||
      !mostRecentTrapVisit?.createdTrapVisitEnvironmentalResponse?.length
    ) {
      return
    }

    const environmentalValuesObj =
      mostRecentTrapVisit.createdTrapVisitEnvironmentalResponse.reduce(
        (acc: { [x: string]: any }, { measureName, measureValueText }: any) => {
          acc[measureName] = measureValueText
          return acc
        },
        {}
      )

    if (environmentalValuesObj?.[sourceMeasureName]) {
      setFieldValue(fieldName, environmentalValuesObj[sourceMeasureName])
    }
  }, [mostRecentTrapVisit, sectionFields, activePage])
}

/**
 * Auto-calculates Total Revolutions as counterEnd - counterStart whenever
 * both are present, only when `totalRevolutions` is configured for the
 * current screen. Counter Start/End may live on this screen's own `values`
 * or, if configured on the other screen, in that screen's already-saved
 * redux slice (`otherScreenValues`) — safe to read since it's only written
 * when the user submits/leaves that screen, which always happens before
 * reaching a later step.
 *
 * Negative results (e.g. the mechanical counter was reset mid-visit) are
 * surfaced as-is rather than hidden, so they're visibly wrong and get
 * caught. Keeps recalculating on counter changes, but backs off the moment
 * the user types their own value directly into Total Revolutions.
 */
export const useTotalRevolutionsAutoCalc = ({
  sectionFields,
  activePage,
  values,
  setFieldValue,
  otherScreenValues,
}: {
  sectionFields: any
  activePage: string | undefined
  values: any
  setFieldValue: (field: string, value: any) => void
  otherScreenValues: any
}) => {
  const lastAutoValue = useRef<string | null>(null)

  useEffect(() => {
    if (!find(sectionFields, { fieldName: 'totalRevolutions', formSection: activePage })) {
      return
    }

    const counterStartRaw =
      values.counterStart !== undefined && values.counterStart !== ''
        ? values.counterStart
        : otherScreenValues?.counterStart
    const counterEndRaw =
      values.counterEnd !== undefined && values.counterEnd !== ''
        ? values.counterEnd
        : otherScreenValues?.counterEnd

    if (
      counterStartRaw === undefined ||
      counterStartRaw === null ||
      counterStartRaw === '' ||
      counterEndRaw === undefined ||
      counterEndRaw === null ||
      counterEndRaw === ''
    ) {
      return
    }

    const counterStart = Number(counterStartRaw)
    const counterEnd = Number(counterEndRaw)
    if (Number.isNaN(counterStart) || Number.isNaN(counterEnd)) return

    const computed = counterEnd - counterStart
    const currentValue = values.totalRevolutions

    const isBlank =
      currentValue === undefined || currentValue === null || currentValue === ''
    const matchesLastAutoValue = String(currentValue) === lastAutoValue.current

    if (isBlank || matchesLastAutoValue) {
      // Every other field in this form sets its Formik value as a string
      // (onChangeText always emits one) — the underlying FastField/Input
      // doesn't render a raw number, so a bare `computed` here silently
      // updates Formik's state while the input stays visually blank.
      setFieldValue('totalRevolutions', String(computed))
      lastAutoValue.current = String(computed)
    }
  }, [
    values.counterStart,
    values.counterEnd,
    otherScreenValues?.counterStart,
    otherScreenValues?.counterEnd,
    sectionFields,
    activePage,
  ])
}

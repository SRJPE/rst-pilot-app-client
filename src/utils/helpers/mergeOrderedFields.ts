/**
 * Merges a screen's hardcoded fields ("slots") with its admin-configured
 * fields into one ordered list, so dashboard reordering actually controls what
 * crews see.
 *
 * Background: each form screen used to render hardcoded JSX in fixed source
 * order and then append the configured fields in a separate block at the
 * bottom. ConditionalTrapVisitFields additionally discarded any configured row
 * whose fieldName matched a hardcoded one, so dragging e.g. waterTemperature
 * to the top of Trap Operations in the dashboard had no effect at all. This
 * module is what lets a hardcoded field take its configured position instead.
 *
 * Leaf module on purpose - no React/navigation imports, so it stays plain-node
 * testable (same rationale as coreLegacyProgram.ts).
 */

/** The subset of a program_fields row this module needs. */
export interface ConfiguredField {
  fieldName: string
  orderIndex?: number | null
  [key: string]: any
}

/**
 * A field the screen renders itself (its own bespoke widget), declared so it
 * can participate in ordering instead of being pinned to source position.
 */
export interface FieldSlot {
  fieldName: string
  /**
   * Drives keyboard "next input" traversal. Composite widgets that expand into
   * several inputs (rpmBefore -> rpm1..3) use 'composite' so they're skipped
   * as focus targets, matching existing behavior.
   */
  fieldType: 'input' | 'select' | 'radio' | 'composite'
  /** flexBasis for the grid wrapper, e.g. '28%' | '30%' | '100%'. */
  width: string
  /** Result of the screen's existing visibility gate, evaluated by the caller. */
  visible: boolean
  render: () => any
}

export interface OrderedEntry {
  /** Dense 0-based position in the final list. */
  position: number
  fieldName: string
  fieldType: string
  kind: 'slot' | 'config'
  slot?: FieldSlot
  field?: ConfiguredField
}

/**
 * Prefix rule: visible slots WITHOUT a configured row come first, in slot
 * declaration order, followed by the configured fields in their configured
 * order. A slot that IS configured drops out of the prefix and renders at its
 * configured rank - that is the whole feature.
 *
 * Why not interleave slots numerically among the configured fields: there is
 * no shared coordinate space to interleave in. Live order_index values are
 * gapped (16 rows spanning 0-31) and duplicated (23 rows spanning 0-19), so
 * any numeric position invented for an unconfigured slot would be arbitrary
 * and would shift as soon as an admin renumbered a section.
 *
 * The prefix rule also degrades to exactly today's layout whenever none of a
 * screen's slots are configured - which is every program with zero
 * program_fields rows (Mill, Deer, Feather, Yuba). That equivalence is the
 * safety property this whole change rests on.
 */
export function mergeOrderedFields({
  configured,
  slots,
}: {
  configured: ConfiguredField[]
  slots: FieldSlot[]
}): OrderedEntry[] {
  const visibleSlots = slots.filter(s => s.visible)
  const configuredNames = new Set(configured.map(f => f.fieldName))

  const prefix = visibleSlots.filter(s => !configuredNames.has(s.fieldName))

  // Stable sort: Array.prototype.sort is stable in every JS engine the app
  // targets, so equal orderIndex values keep the order the API returned them
  // in (which the backend now makes deterministic via `ORDER BY order_index,
  // id`). Unset sorts last, matching the backend's NULLS LAST.
  const sortedConfigured = [...configured].sort(
    (a, b) =>
      (a.orderIndex ?? Number.MAX_SAFE_INTEGER) -
      (b.orderIndex ?? Number.MAX_SAFE_INTEGER)
  )

  const slotByName = new Map(visibleSlots.map(s => [s.fieldName, s]))

  const entries: Array<Omit<OrderedEntry, 'position'>> = [
    ...prefix.map(slot => ({
      fieldName: slot.fieldName,
      fieldType: slot.fieldType,
      kind: 'slot' as const,
      slot,
    })),
    ...sortedConfigured.map(field => {
      const slot = slotByName.get(field.fieldName)
      return slot
        ? {
            fieldName: field.fieldName,
            fieldType: slot.fieldType,
            kind: 'slot' as const,
            slot,
            field,
          }
        : {
            fieldName: field.fieldName,
            fieldType: String(field.fieldType ?? 'input'),
            kind: 'config' as const,
            field,
          }
    }),
  ]

  // Dense positions are assigned AFTER invisible slots are dropped, so
  // keyboard traversal and isLast never point at something that isn't on
  // screen.
  return entries.map((e, position) => ({ ...e, position }))
}

/**
 * Safety net for slot visibility: true when the crew has already entered
 * something for this field (or, for a composite field like rpmAfter ->
 * rpm1/rpm2/rpm3, any of its sub-fields).
 *
 * Background: a slot's `visible` is normally computed from program-field
 * config (shouldRenderField / isCoreLegacyProgram), which depends on local
 * screen state (programFormFields/sectionFields) populated by a useEffect.
 * That effect has its own timing bugs (see TrapOperations.tsx /
 * TrapPostProcessing.tsx for one already found and fixed - a missing
 * selectedProgramId dependency that could leave it permanently stale after an
 * app reload). Whatever the cause, a field the crew already filled in must
 * NEVER disappear because config hasn't resolved yet or resolved wrong - that
 * would silently orphan real data, which is a correctness bug, not just a
 * cosmetic one. Combine this with the config-driven `visible` check via OR at
 * every call site; it only ever makes a field MORE visible, never hides one
 * config says to show.
 *
 * CRITICAL - must be called with the screen's stable `initialValues` (the
 * Formik render-prop field, sourced from the persisted redux slice), NEVER
 * with live `values`. Both TrapOperations.tsx and TrapPostProcessing.tsx only
 * write `values` back into that redux slice on navigation/save, not on every
 * keystroke, so `initialValues` stays constant for the whole time the crew is
 * actively editing a field this render. Passing live `values` instead creates
 * a feedback loop: backspacing a field to empty makes THIS check go false on
 * that very keystroke, which flips `visible` false and unmounts the input the
 * crew is mid-edit on. (This shipped once already - see the regression test
 * below named for it. Don't reintroduce it.)
 */
export function fieldHasSavedValue(
  savedValues: Record<string, any> | null | undefined,
  fieldNames: string | string[]
): boolean {
  if (!savedValues) return false
  const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames]
  return names.some(name => {
    const v = savedValues[name]
    return v !== undefined && v !== null && v !== ''
  })
}

/**
 * True when no later entry is a focusable text input - i.e. the keyboard
 * should dismiss rather than advance. Replaces the old
 * `index === formFields.length - 1`, which compared against the unsorted array
 * and counted entries that rendered nothing.
 */
export function isLastInput(merged: OrderedEntry[], position: number): boolean {
  return !merged.slice(position + 1).some(e => e.fieldType === 'input')
}

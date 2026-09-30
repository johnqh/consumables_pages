/**
 * The classes this package's controls wear, read from the design system.
 *
 * Functions rather than constants, and called while rendering: the host
 * configures its theme at start-up, and a class string computed when this
 * module is first imported can be computed before that — and would hold the
 * un-themed palette for the life of the page.
 *
 * Nothing here names a colour. A button written in palette classes is one
 * the host's theme cannot reach, and one the host's Tailwind may never have
 * generated a rule for: the Redeem button shipped as white text on no
 * background at all. `design-system.test.ts` holds the package to that.
 */
import { variants } from '@sudobility/design';

/** The one action a form or a card exists for. */
export const primaryButtonClass = (): string =>
  variants.button.primary.default();

/** A primary action that fills the width of what holds it. */
export const primaryButtonFullWidthClass = (): string =>
  variants.button.primary.fullWidth();

/** An action that is not the point of the page: load more, go back. */
export const quietButtonClass = (): string => variants.button.ghost.default();

/** A text field. */
export const inputClass = (): string => variants.input.default();

/**
 * One height for a field and the button beside it. Each sizes itself from its
 * own padding and font otherwise, and a row of the two comes out ragged.
 */
export const FIELD_HEIGHT_CLASS = 'h-11';

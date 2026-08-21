/**
 * @fileoverview Modal shown when an action is refused for want of credits.
 * Wraps CreditStorePage in a dialog so a product can sell credits at the
 * moment of refusal rather than sending the user away to a store page and
 * losing whatever they were doing. Purely presentational -- all data,
 * callbacks and copy are passed via props.
 */

import { useEffect, useRef } from 'react';
import { colors, ui } from '@sudobility/design';
import { CreditStorePage } from './CreditStorePage';
import type { CreditPaywallDialogProps } from './types';

/**
 * Renders a centred modal containing the credit store, with the heading
 * saying why it appeared.
 *
 * The shell is hand-rolled rather than taken from a component library,
 * matching the rest of this package: it depends on `@sudobility/design` alone,
 * so it drops into any consumer without dragging a UI framework behind it.
 * That means it owns the behaviours a dialog is expected to have -- Escape to
 * dismiss, a click on the backdrop to dismiss, focus moved in on open and
 * returned on close, and a labelled `role="dialog"`.
 *
 * @param props - See {@link CreditPaywallDialogProps} for full prop documentation.
 */
export function CreditPaywallDialog({
  isOpen,
  onClose,
  isAuthenticated,
  balance,
  packages,
  isLoading,
  isPurchasing,
  error,
  onPurchase,
  onLoginClick,
  labels,
  formatters,
  className,
}: CreditPaywallDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Whatever was focused when the refusal happened -- typically the button
    // that started the job -- gets focus back when the dialog closes.
    returnFocusRef.current = document.activeElement;
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const target = returnFocusRef.current;
      if (target instanceof HTMLElement) target.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      // The backdrop dismisses, but only when the backdrop itself is the
      // target: a pointer-up that began inside the panel and drifted out --
      // selecting text, dragging off a button -- must not close the dialog.
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className='absolute inset-0 bg-black/50' aria-hidden='true' />

      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='credit-paywall-title'
        tabIndex={-1}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border p-6 shadow-lg outline-none ${colors.component.card.default.base} ${colors.component.card.default.dark} ${ui.border.default} ${className ?? ''}`}
      >
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div>
            <h2
              id='credit-paywall-title'
              className='text-2xl font-bold text-foreground'
            >
              {labels.paywallTitle}
            </h2>
            {labels.paywallMessage && (
              <p className={`mt-2 text-sm ${ui.text.muted}`}>
                {labels.paywallMessage}
              </p>
            )}
          </div>

          <button
            type='button'
            onClick={onClose}
            aria-label={labels.closeLabel}
            className={`shrink-0 rounded-lg px-2 py-1 text-xl leading-none transition-colors ${ui.text.muted} hover:text-foreground`}
          >
            ×
          </button>
        </div>

        {/*
          The store, with its own heading suppressed: the dialog's heading
          already says what this is, and two would read as two sections.
        */}
        <CreditStorePage
          isAuthenticated={isAuthenticated}
          balance={balance}
          packages={packages}
          isLoading={isLoading}
          isPurchasing={isPurchasing}
          error={error}
          onPurchase={onPurchase}
          onLoginClick={onLoginClick}
          labels={{ ...labels, title: '' }}
          formatters={formatters}
        />
      </div>
    </div>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import type {
  ConsumablesApiClient,
  CreditCoupon,
} from '@sudobility/consumables_client';

const inputClass =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2';
const buttonClass =
  'rounded-md bg-neutral-900 px-4 py-2 font-medium text-white disabled:opacity-50';

export interface RedeemCreditCouponPageProps {
  client: ConsumablesApiClient;
  entityId?: string;
  entityName: string;
  onRedeemed?: () => void | Promise<void>;
}

/** Shared coupon redemption UI. The API operation is owned by consumables_client. */
export function RedeemCreditCouponPage({
  client,
  entityId,
  entityName,
  onRedeemed,
}: RedeemCreditCouponPageProps) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const result = await client.redeemCreditCoupon(code, entityId);
      setCode('');
      await onRedeemed?.();
      setMessage(
        `Added ${result.credits} credits to ${entityName}. New balance: ${result.balance}.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Coupon redemption failed.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className='mx-auto max-w-4xl space-y-6'>
      <header>
        <h1 className='text-2xl font-semibold'>Redeem a credit coupon</h1>
        <p className='mt-1 text-neutral-600'>
          Credits are added to {entityName}.
        </p>
      </header>
      <form
        onSubmit={event => void submit(event)}
        className='flex flex-col gap-3 rounded-lg border p-5 sm:flex-row'
      >
        <input
          className={`${inputClass} min-w-0 flex-1 font-mono uppercase`}
          value={code}
          onChange={event =>
            setCode(
              event.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .slice(0, 8)
            )
          }
          placeholder='8-character code'
          minLength={8}
          maxLength={8}
          pattern='[A-Z0-9]{8}'
          required
        />
        <button className={buttonClass} disabled={busy || code.length !== 8}>
          {busy ? 'Redeeming…' : 'Redeem'}
        </button>
      </form>
      {message && <p role='status'>{message}</p>}
    </main>
  );
}

export interface ManageCreditCouponsPageProps {
  client: ConsumablesApiClient;
  isAdmin: boolean;
}

/** Shared site-admin coupon creation, listing, detail, and redemption history. */
export function ManageCreditCouponsPage({
  client,
  isAdmin,
}: ManageCreditCouponsPageProps) {
  const [coupons, setCoupons] = useState<CreditCoupon[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [credits, setCredits] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    setCoupons(await client.listCreditCoupons());
  }
  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    void client
      .listCreditCoupons()
      .then(items => {
        if (active) setCoupons(items);
      })
      .catch(cause => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : 'Could not load coupons.'
          );
      });
    return () => {
      active = false;
    };
  }, [isAdmin, client]);

  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const coupon = await client.createCreditCoupon({
        credits: Number(credits),
        expires_at: new Date(expiresAt).toISOString(),
        email: email.trim() || null,
      });
      setSelectedCode(coupon.code);
      setCredits('');
      setExpiresAt('');
      setEmail('');
      await reload();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Coupon creation failed.'
      );
    } finally {
      setBusy(false);
    }
  }

  if (!isAdmin) return null;
  const selected = coupons.find(coupon => coupon.code === selectedCode);
  return (
    <main className='mx-auto max-w-4xl space-y-6'>
      <header>
        <h1 className='text-2xl font-semibold'>Manage Coupons</h1>
        <p className='mt-1 text-neutral-600'>
          Create credit coupons and review redemption history.
        </p>
      </header>
      {error && (
        <p role='alert' className='text-sm text-red-700'>
          {error}
        </p>
      )}
      <section className='rounded-lg border p-5'>
        <h2 className='text-lg font-semibold'>Create a coupon</h2>
        <form
          onSubmit={event => void create(event)}
          className='mt-3 grid gap-3 sm:grid-cols-2'
        >
          <label className='text-sm'>
            Credits
            <input
              className={inputClass}
              type='number'
              min='1'
              step='1'
              required
              value={credits}
              onChange={event => setCredits(event.target.value)}
            />
          </label>
          <label className='text-sm'>
            Expires at
            <input
              className={inputClass}
              type='datetime-local'
              required
              value={expiresAt}
              onChange={event => setExpiresAt(event.target.value)}
            />
          </label>
          <label className='text-sm sm:col-span-2'>
            Restrict to user email (optional)
            <input
              className={inputClass}
              type='email'
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </label>
          <button className={buttonClass} disabled={busy}>
            {busy ? 'Creating…' : 'Create 8-character coupon'}
          </button>
        </form>
      </section>
      <section className='rounded-lg border p-5'>
        <h2 className='text-lg font-semibold'>Coupons</h2>
        {coupons.length ? (
          <ul className='mt-3 divide-y'>
            {coupons.map(coupon => (
              <li key={coupon.code}>
                <button
                  type='button'
                  className='flex w-full items-center justify-between gap-3 py-3 text-left hover:text-blue-700'
                  onClick={() => setSelectedCode(coupon.code)}
                >
                  <span className='font-mono font-medium'>{coupon.code}</span>
                  <span className='text-sm text-neutral-600'>
                    {coupon.credits} credits ·{' '}
                    {new Date(coupon.createdAt).toLocaleString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='mt-3 text-sm text-neutral-600'>
            No coupons created yet.
          </p>
        )}
      </section>
      {selected && (
        <section className='rounded-lg border p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <h2 className='font-mono text-xl font-semibold'>
                {selected.code}
              </h2>
              <p className='text-sm text-neutral-600'>Coupon details</p>
            </div>
            <button
              type='button'
              className='text-sm underline'
              onClick={() => setSelectedCode(null)}
            >
              Back to coupons
            </button>
          </div>
          <dl className='mt-4 grid gap-3 sm:grid-cols-2'>
            <Detail label='Credits' value={String(selected.credits)} />
            <Detail
              label='Created'
              value={new Date(selected.createdAt).toLocaleString()}
            />
            <Detail
              label='Expires'
              value={new Date(selected.expiresAt).toLocaleString()}
            />
            <Detail label='Target email' value={selected.email || 'Any user'} />
          </dl>
          <h3 className='mt-6 text-lg font-semibold'>Redemption history</h3>
          {selected.history.length ? (
            <ul className='mt-2 divide-y'>
              {selected.history.map((item, index) => (
                <li
                  key={`${item.entityId ?? 'scope'}-${item.redeemedAt}-${index}`}
                  className='flex flex-wrap justify-between gap-2 py-2 text-sm'
                >
                  <span>
                    {item.entityId ? `Workspace ${item.entityId}` : ''}
                    {item.userId ? ` · ${item.userId}` : ''} · {item.credits}{' '}
                    credits
                  </span>
                  <time>{new Date(item.redeemedAt).toLocaleString()}</time>
                </li>
              ))}
            </ul>
          ) : (
            <p className='mt-2 text-sm text-neutral-600'>No redemptions yet.</p>
          )}
        </section>
      )}
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className='text-sm text-neutral-600'>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

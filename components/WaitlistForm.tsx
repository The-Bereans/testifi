'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type State = 'idle' | 'submitting' | 'success' | 'error';

export default function WaitlistForm() {
  const [email, setEmail]   = useState('');
  const [state, setState]   = useState<State>('idle');
  const [errMsg, setErrMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrMsg('Enter a valid email address.');
      return;
    }
    setErrMsg('');
    setState('submitting');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? 'Something went wrong.');
      }
      setState('success');
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setState('error');
    }
  }

  return (
    <section
      style={{
        padding: 'var(--section-padding-y) var(--section-padding-x)',
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Divider line */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: 'var(--brand-ivory-deeper)',
          marginBottom: 'clamp(2.5rem, 6vw, 4rem)',
        }}
      />

      <div style={{ maxWidth: '28rem', margin: '0 auto', textAlign: 'center' }}>
        {/* Overline */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--brand-sienna-light)',
            marginBottom: '0.75rem',
          }}
        >
          Coming soon
        </p>

        {/* Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 700,
            color: 'var(--brand-near-black)',
            lineHeight: 1.2,
            marginBottom: '0.75rem',
          }}
        >
          Stay in the loop.
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--brand-near-black-muted)',
            lineHeight: 1.65,
            marginBottom: '2rem',
          }}
        >
          We&rsquo;re building more. Be the first to know when it&rsquo;s ready.
        </p>

        {/* Form / success swap */}
        <AnimatePresence mode="wait">
          {state === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: '1.5rem',
                background: 'var(--brand-ivory-dark)',
                border: '1.5px solid var(--brand-ivory-deeper)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--brand-near-black)',
                  marginBottom: '0.35rem',
                }}
              >
                You&rsquo;re in.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--brand-near-black-muted)',
                  lineHeight: 1.6,
                }}
              >
                We&rsquo;ll let you know when it&rsquo;s ready.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              noValidate
            >
              {/* Email row */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.625rem',
                  flexWrap: 'wrap',
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errMsg) setErrMsg('');
                    if (state === 'error') setState('idle');
                  }}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  style={{
                    flex: 1,
                    minWidth: '0',
                    padding: '0.8rem 1rem',
                    background: 'var(--brand-ivory-dark)',
                    border: `1.5px solid ${errMsg ? '#c0392b' : 'var(--brand-ivory-deeper)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    color: 'var(--brand-near-black)',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => {
                    if (!errMsg) e.currentTarget.style.borderColor = 'var(--brand-sienna-light)';
                  }}
                  onBlur={(e) => {
                    if (!errMsg) e.currentTarget.style.borderColor = 'var(--brand-ivory-deeper)';
                  }}
                />

                <button
                  type="submit"
                  disabled={state === 'submitting'}
                  style={{
                    padding: '0.8rem 1.4rem',
                    background: state === 'submitting' ? 'var(--brand-sienna-pale)' : 'var(--brand-sienna-light)',
                    color: 'var(--brand-near-black)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: state === 'submitting' ? 'wait' : 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={(e) => {
                    if (state !== 'submitting')
                      e.currentTarget.style.background = 'var(--brand-sienna-dark)';
                  }}
                  onMouseLeave={(e) => {
                    if (state !== 'submitting')
                      e.currentTarget.style.background = 'var(--brand-sienna-light)';
                  }}
                >
                  {state === 'submitting' ? 'Joining…' : 'Join Waitlist'}
                </button>
              </div>

              {/* Inline error */}
              <AnimatePresence>
                {errMsg && (
                  <motion.p
                    key="err"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    role="alert"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      color: '#c0392b',
                      marginTop: '0.5rem',
                      textAlign: 'left',
                      overflow: 'hidden',
                    }}
                  >
                    {errMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Trust line */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'var(--brand-near-black-muted)',
                  marginTop: '0.75rem',
                  letterSpacing: '0.02em',
                }}
              >
                No spam. Just updates.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom padding spacer */}
      <div style={{ height: 'clamp(2rem, 5vw, 3.5rem)' }} />
    </section>
  );
}

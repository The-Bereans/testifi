'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CategoryData } from '@/lib/sanitize';
import ShareCard from './ShareCard';
import ShareButton from './ShareButton';

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.22, 1, 0.36, 1];
const EASE_IN:  CubicBezier = [0.4,  0,  1,   1];

const sectionVariants = {
  enter:   { opacity: 0, y: 32,  transition: { duration: 0.45, ease: EASE_OUT } },
  visible: { opacity: 1, y: 0,   transition: { duration: 0.45, ease: EASE_OUT } },
  exit:    { opacity: 0, y: -24, transition: { duration: 0.3,  ease: EASE_IN  } },
};

type Step = 'input' | 'loading' | 'done';

export default function TestimonySection() {
  const [step, setStep] = useState<Step>('input');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [consented, setConsented] = useState(false);
  const [isIdentityHidden, setIsIdentityHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const CARD_W = isMobile ? 900  : 1200;
  const CARD_H = isMobile ? 1200 : 900;
  const [previewScale, setPreviewScale] = useState(500 / 1200);
  const [isCapturing, setIsCapturing] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0) setCategoryId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (step === 'input') inputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  useEffect(() => {
    if (step !== 'done' || !previewWrapRef.current) return;
    const el = previewWrapRef.current;
    const update = () => setPreviewScale(el.offsetWidth / CARD_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [step, CARD_W]);

  async function handleSubmit() {
    const trimmed = body.trim();
    if (trimmed.length < 20) {
      setError('Please share at least a few sentences (20 characters).');
      return;
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setError('You appear to be offline. Please check your connection and try again.');
      return;
    }

    setError(null);
    setStep('loading');

    const payload = {
      title: title.trim() || undefined,
      body: trimmed,
      consented,
      categoryId: categoryId || undefined,
      isIdentityHidden,
    };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit.');
      const data = await res.json();
      setSubmittedId(data.id);
      setStep('done');
    } catch {
      setError('Something went wrong. Please try again.');
      setStep('input');
    }
  }

  function handleReset() {
    setTitle('');
    setBody('');
    setCategoryId(categories[0]?.id ?? '');
    setConsented(false);
    setIsIdentityHidden(false);
    setSubmittedId(null);
    setError(null);
    setStep('input');
  }

  async function handleDownloadPNG() {
    if (!shareCardRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2, useCORS: true, logging: false, backgroundColor: '#2E2418',
      });
      const link = document.createElement('a');
      link.download = `testimony-${submittedId ?? 'mine'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsCapturing(false);
    }
  }

  function handleTwitterShare() {
    const text = ` ${body.slice(0, 120)}... He still saves. #Testifi`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: title || 'My testimony',
        text: body.slice(0, 200),
        url: window.location.href,
      });
    } catch {
      // user cancelled
    }
  }

  async function handleWhatsAppShare() {
    const shareText = `${body.slice(0, 200)}...\n\nhttps://testifi.vercel.app`;

    if (navigator.canShare && shareCardRef.current) {
      try {
        const { default: html2canvas } = await import('html2canvas');
        const canvas = await html2canvas(shareCardRef.current, {
          scale: 1, useCORS: true, logging: false, backgroundColor: '#2E2418',
        });
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          const file = new File([blob], `testimony-${submittedId}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], text: shareText });
            return;
          }
        }
      } catch {
        // fall through
      }
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  }

  async function handleInstagramShare() {
    await handleDownloadPNG();
    window.open('https://www.instagram.com', '_blank');
  }

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.section
            key="input"
            variants={sectionVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            className="flex flex-col flex-1 items-center justify-center relative overflow-hidden"
            style={{ paddingTop: 'clamp(3rem, 10vw, 6rem)', paddingBottom: 'clamp(3rem, 10vw, 6rem)' }}
          >
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
                width: '900px', height: '700px',
                background: 'radial-gradient(ellipse at 50% 0%, rgba(181,103,61,0.10) 0%, rgba(248,244,236,0) 65%)',
                filter: 'blur(30px)',
              }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '54rem', padding: '0 1.5rem', textAlign: 'center' }}>
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.5, ease: EASE_OUT }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--brand-sienna)',
                  marginBottom: '1.5rem',
                }}
              >
                They overcame by the blood of the Lamb and the word of their testimony &mdash; Rev. 12:11
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.75, ease: EASE_OUT }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.6rem, 9vw, 6rem)',
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                  color: 'var(--brand-near-black)',
                  marginBottom: '2.75rem',
                }}
              >
                What has Jesus{' '}
                <span style={{ color: 'var(--brand-sienna)', fontStyle: 'italic' }}>saved you</span>{' '}
                from?
              </motion.h1>

              <motion.div
                style={{ maxWidth: '36rem', marginInline: 'auto', width: '100%' }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.65, ease: EASE_OUT }}
              >
                <div style={{
                  background: 'rgba(255,252,247,0.85)',
                  borderRadius: '1.25rem',
                  padding: 'clamp(1.25rem, 3.5vw, 1.75rem)',
                  boxShadow: '0 8px 40px rgba(28,22,17,0.10)',
                  border: `1px solid ${error ? '#b94040' : 'var(--brand-ivory-deeper)'}`,
                  transition: 'border-color 0.15s',
                  position: 'relative',
                  textAlign: 'left',
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title (optional)"
                      maxLength={120}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1.5px solid var(--brand-ivory-deeper)',
                        outline: 'none',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                        fontWeight: 600,
                        color: 'var(--brand-near-black)',
                      }}
                    />
                  </div>

                  <textarea
                    ref={inputRef}
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                      if (error) setError(null);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    placeholder="Share your testimony..."
                    maxLength={10000}
                    rows={5}
                    style={{
                      display: 'block',
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                      fontWeight: 500,
                      color: 'var(--brand-near-black-soft)',
                      lineHeight: 1.7,
                      minHeight: isMobile ? '10rem' : '8rem',
                    }}
                  />

                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.7rem',
                    color: 'var(--brand-near-black-muted)',
                    textAlign: 'right',
                    marginTop: '0.25rem',
                  }}>
                    {body.length}/10000
                  </p>

                  {categories.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.78rem',
                        color: 'var(--brand-near-black-muted)',
                        display: 'block',
                        marginBottom: '0.35rem',
                      }}>
                        Category (optional)
                      </label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          background: 'var(--brand-ivory-dark)',
                          border: '1.5px solid var(--brand-ivory-deeper)',
                          borderRadius: 'var(--radius-md)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.85rem',
                          color: 'var(--brand-near-black)',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                      color: 'var(--brand-near-black-muted)', cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={consented}
                        onChange={(e) => setConsented(e.target.checked)}
                        style={{ accentColor: 'var(--brand-sienna-light)' }}
                      />
                      I consent to sharing my testimony
                    </label>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                      color: 'var(--brand-near-black-muted)', cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={isIdentityHidden}
                        onChange={(e) => setIsIdentityHidden(e.target.checked)}
                        style={{ accentColor: 'var(--brand-sienna-light)' }}
                      />
                      Hide my identity
                    </label>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={body.trim().length < 20}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: body.trim().length >= 20 ? 'var(--brand-sienna)' : 'var(--brand-ivory-deeper)',
                      color: body.trim().length >= 20 ? 'var(--brand-ivory)' : 'var(--brand-near-black-muted)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: body.trim().length >= 20 ? 'pointer' : 'not-allowed',
                      transition: 'background 0.15s',
                      opacity: body.trim().length >= 20 ? 1 : 0.5,
                    }}
                  >
                    Share your testimony
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      role="alert"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        color: '#b94040',
                        marginTop: '0.6rem',
                        textAlign: 'left',
                        paddingLeft: '0.25rem',
                      }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.section>
        )}

        {step === 'loading' && (
          <motion.section
            key="loading"
            variants={sectionVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            className="flex flex-col flex-1 items-center justify-center px-6 text-center"
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  style={{
                    width: '0.55rem', height: '0.55rem',
                    borderRadius: '50%', background: 'var(--brand-sienna-light)',
                    display: 'block',
                  }}
                  animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1.125rem',
              color: 'var(--brand-near-black-muted)', marginTop: '1.5rem',
            }}>
              Recording your story...
            </p>
          </motion.section>
        )}

        {step === 'done' && (
          <motion.section
            key="done"
            variants={sectionVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            className="flex flex-col flex-1 items-center px-6 pb-16"
            style={{ paddingTop: 'clamp(4rem, 12vw, 7rem)', position: 'relative' }}
          >
            {submittedId && (
              <>
                <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                  <ShareCard
                    ref={shareCardRef}
                    word={body}
                    cardW={CARD_W}
                    cardH={CARD_H}
                  />
                </div>
                <div
                  ref={previewWrapRef}
                  style={{
                    width: '100%',
                    maxWidth: 500,
                    height: Math.round(CARD_H * previewScale),
                    overflow: 'hidden',
                    borderRadius: '0.75rem',
                    position: 'relative',
                    transform: 'translateZ(0)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    marginBottom: '1rem',
                    flexShrink: 0,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
                  >
                    <div style={{
                      position: 'absolute', top: 0, left: '50%',
                      width: CARD_W, height: CARD_H,
                      transform: `translateX(-50%) scale(${previewScale})`,
                      transformOrigin: 'top center',
                      pointerEvents: 'none',
                    }}>
                      <ShareCard
                        word={body}
                        preview={true}
                        cardW={CARD_W}
                        cardH={CARD_H}
                      />
                    </div>
                  </motion.div>
                </div>
              </>
            )}

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 }}
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-muted)',
                fontSize: '0.875rem',
                lineHeight: 1.65,
                textAlign: 'center',
                maxWidth: 320,
                marginBottom: '1rem',
              }}
            >
              Thank you. Your story matters. Share it with someone.
            </motion.p>

            {submittedId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.2 }}
                style={{
                  display: 'flex', justifyContent: 'center', gap: '0.75rem',
                  marginBottom: '2rem', width: '100%', maxWidth: 500,
                }}
              >
                <ShareButton onClick={handleDownloadPNG} disabled={isCapturing} title="Save image" size="lg">
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </ShareButton>

                <ShareButton onClick={handleTwitterShare} title="Share on X" size="lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.1 2.25h6.3l4.255 5.643L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                  </svg>
                </ShareButton>

                <ShareButton onClick={handleWhatsAppShare} title="Share on WhatsApp" size="lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </ShareButton>

                <ShareButton onClick={handleInstagramShare} disabled={isCapturing} title="Share on Instagram" size="lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </ShareButton>
              </motion.div>
            )}

            {canNativeShare && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={handleNativeShare}
                style={{
                  padding: '0.6rem 1.5rem',
                  background: 'none',
                  border: '1.5px solid var(--brand-ivory-deeper)',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: 'var(--brand-near-black-muted)',
                  cursor: 'pointer',
                  marginBottom: '1.5rem',
                }}
              >
                Share natively
              </motion.button>
            )}

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              onClick={handleReset}
              style={{
                padding: '0.6rem 1.5rem',
                background: 'var(--brand-sienna-light)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--brand-near-black)',
                cursor: 'pointer',
              }}
            >
              Share another testimony
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

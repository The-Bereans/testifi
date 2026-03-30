'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { CATEGORIES, type Category } from '@/lib/sanitize';
import CommunityShareCard from '@/components/CommunityShareCard';
import { relativeTime } from '@/lib/relativeTime';

interface DbTestimony {
  id: string;
  word: string;
  body: string;
  category: string | null;
  excerpt: string | null;
  created_at: string;
}

const CATEGORY_LABEL: Record<Category, string> = {
  addiction:       'Addiction',
  anxiety:         'Anxiety',
  depression:      'Depression',
  anger:           'Anger',
  shame:           'Shame',
  identity:        'Identity',
  relationships:   'Relationships',
  'sexual sin':    'Sexual Sin',
  'mental health': 'Mental Health',
  other:           'Other',
};

type FilterTab = 'All' | Category;
const ALL_CATEGORIES: FilterTab[] = ['All', ...CATEGORIES];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  addiction:       { bg: 'rgba(139,74,42,0.12)',  text: '#8B4A2A', border: 'rgba(139,74,42,0.3)'  },
  anxiety:         { bg: 'rgba(181,103,61,0.12)', text: '#B5673D', border: 'rgba(181,103,61,0.35)' },
  depression:      { bg: 'rgba(74,61,48,0.10)',   text: '#4A3D30', border: 'rgba(74,61,48,0.25)'  },
  anger:           { bg: 'rgba(139,74,42,0.12)',  text: '#8B4A2A', border: 'rgba(139,74,42,0.3)'  },
  shame:           { bg: 'rgba(181,103,61,0.12)', text: '#B5673D', border: 'rgba(181,103,61,0.3)' },
  identity:        { bg: 'rgba(181,103,61,0.12)', text: '#B5673D', border: 'rgba(181,103,61,0.3)' },
  relationships:   { bg: 'rgba(74,61,48,0.10)',   text: '#4A3D30', border: 'rgba(74,61,48,0.25)'  },
  'sexual sin':    { bg: 'rgba(139,74,42,0.12)',  text: '#8B4A2A', border: 'rgba(139,74,42,0.3)'  },
  'mental health': { bg: 'rgba(181,103,61,0.12)', text: '#B5673D', border: 'rgba(181,103,61,0.35)' },
  other:           { bg: 'rgba(74,61,48,0.10)',   text: '#4A3D30', border: 'rgba(74,61,48,0.25)'  },
};

const DEFAULT_COLORS = { bg: 'rgba(74,61,48,0.10)', text: '#4A3D30', border: 'rgba(74,61,48,0.25)' };

const POOL_SIZE            = 50;
const SLIDE_DURATION_MS    = 5000;
const PAUSE_AFTER_NAV_MS   = 10000;
const MAX_DOTS             = 10;

const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

const arrowBtnStyle: React.CSSProperties = {
  width: '2.5rem',
  height: '2.5rem',
  border: '1px solid var(--brand-ivory-deeper)',
  borderRadius: '50%',
  background: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--brand-near-black-muted)',
  flexShrink: 0,
  transition: 'border-color 0.15s, color 0.15s',
};

// ─── TestimonyCard ────────────────────────────────────────────────────────────

function TestimonyCard({ testimony }: { testimony: DbTestimony }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const colors  = CATEGORY_COLORS[testimony.category ?? ''] ?? DEFAULT_COLORS;
  const displayText = testimony.excerpt ?? testimony.body;

  async function handleDownloadPNG() {
    if (!cardRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        scale: 1, useCORS: true, logging: false, backgroundColor: '#1C1611',
      });
      const link = document.createElement('a');
      link.download = `testimony-${testimony.word}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsCapturing(false);
    }
  }

  function handleXShare() {
    const text = encodeURIComponent(
      `Jesus saved me from ${testimony.word}. "${displayText.slice(0, 120)}"  testifi.vercel.app`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }

  function handleWhatsAppShare() {
    const text = encodeURIComponent(
      `Jesus saved me from ${testimony.word}.\n\n"${displayText.slice(0, 160)}"\n\ntestifi.vercel.app`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  async function handleInstagramShare() {
    await handleDownloadPNG();
    window.open('https://www.instagram.com', '_blank');
  }

  const circleBtn: React.CSSProperties = {
    width: '3rem',
    height: '3rem',
    border: '1.5px solid #6B3520',
    borderRadius: '50%',
    background: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-accent)',
    padding: 0,
    lineHeight: 0,
    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
  };

  return (
    <>
      <article
        style={{
          background: 'var(--brand-ivory-dark)',
          border: '1px solid var(--brand-ivory-deeper)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1.1rem, 3vw, 1.5rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-near-black-soft)',
            fontSize: 'clamp(0.875rem, 2vw, 0.975rem)',
            lineHeight: 1.72,
            letterSpacing: '0.01em',
            margin: 0,
          }}
        >
          {displayText}
        </p>

        <div style={{ paddingTop: '0.25rem', borderTop: '1px solid var(--brand-ivory-deeper)' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-near-black-muted)',
              fontSize: '0.75rem',
              letterSpacing: '0.03em',
            }}
          >
            Anonymous · {relativeTime(testimony.created_at)}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <button
            className="share-btn"
            onClick={handleDownloadPNG}
            disabled={isCapturing}
            title={isCapturing ? 'Saving…' : 'Save image'}
            style={{ ...circleBtn, opacity: isCapturing ? 0.4 : 1, cursor: isCapturing ? 'default' : 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button className="share-btn" onClick={handleXShare} title="Share on X" style={circleBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.1 2.25h6.3l4.255 5.643L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </button>

          <button className="share-btn" onClick={handleWhatsAppShare} title="Share on WhatsApp" style={circleBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>

          <button
            className="share-btn"
            onClick={handleInstagramShare}
            disabled={isCapturing}
            title="Share on Instagram"
            style={{ ...circleBtn, opacity: isCapturing ? 0.4 : 1, cursor: isCapturing ? 'default' : 'pointer' }}
          >
            <InstagramIcon size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: 'var(--radius-full)',
              padding: '0.2rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
            }}
          >
            {testimony.word}
          </span>
          {testimony.category && (
            <span
              style={{
                color: 'var(--brand-near-black-muted)',
                fontSize: '0.7rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
              }}
            >
              {CATEGORY_LABEL[testimony.category as Category] ?? testimony.category}
            </span>
          )}
        </div>
      </article>

      <CommunityShareCard
        ref={cardRef}
        word={testimony.word}
        excerpt={displayText}
        category={(CATEGORY_LABEL[testimony.category as Category] ?? testimony.category ?? '') as never}
      />
    </>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

// ─── FeaturedFeed ─────────────────────────────────────────────────────────────

export default function FeaturedFeed() {
  const [activeTab,     setActiveTab]     = useState<FilterTab>('All');
  const [showFilters,   setShowFilters]   = useState(false);
  const [testimonies,   setTestimonies]   = useState<DbTestimony[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [direction,     setDirection]     = useState<1 | -1>(1);
  const [isPaused,      setIsPaused]      = useState(false);

  const sectionRef    = useRef<HTMLElement>(null);
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });

  // ── Fetch pool ──────────────────────────────────────────────────────────────

  const fetchPool = useCallback(async (tab: FilterTab) => {
    setLoading(true);
    setError(null);
    setCurrentIndex(0);
    setDirection(1);
    setIsPaused(false);
    try {
      const params = new URLSearchParams({ page: '1', limit: String(POOL_SIZE) });
      if (tab !== 'All') params.set('category', tab);
      const res = await fetch(`/api/testimonies?${params}`);
      if (!res.ok) throw new Error('Failed to load.');
      const json = await res.json();
      setTestimonies(json.data ?? []);
    } catch {
      setError('Could not load testimonies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPool(activeTab); }, [activeTab, fetchPool]);

  // ── Auto-advance interval ───────────────────────────────────────────────────

  useEffect(() => {
    if (isPaused || loading || testimonies.length <= 1) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % testimonies.length);
    }, SLIDE_DURATION_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, loading, testimonies.length]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (intervalRef.current)  clearInterval(intervalRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleNav(dir: 1 | -1) {
    if (testimonies.length <= 1) return;
    setDirection(dir);
    setCurrentIndex(prev => (prev + dir + testimonies.length) % testimonies.length);
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsPaused(false), PAUSE_AFTER_NAV_MS);
  }

  function handleTabChange(tab: FilterTab) {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setActiveTab(tab);
  }

  // ── Derived ─────────────────────────────────────────────────────────────────

  const total    = testimonies.length;
  const dotCount = Math.min(total, MAX_DOTS);
  const activeDot = total <= MAX_DOTS
    ? currentIndex
    : Math.min(Math.round((currentIndex / total) * MAX_DOTS), MAX_DOTS - 1);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: 'var(--section-padding-y) var(--section-padding-x)',
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}
    >
      {/* ── Section heading ── */}
      <div style={{ marginBottom: showFilters ? '0.75rem' : 'clamp(1.25rem, 3vw, 2rem)' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-sienna-light)',
          fontSize: '0.72rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: '0.5rem',
        }}>
          Community
        </p>
        <h2 style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-near-black)',
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: '0.6rem',
        }}>
          Others who were set free.
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-near-black-muted)',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            lineHeight: 1.65,
            maxWidth: '38ch',
            margin: 0,
          }}>
            Real people. Real struggles. Shared with consent, anonymously.
          </p>
          <button
            onClick={() => setShowFilters(v => !v)}
            style={{
              flexShrink: 0,
              background: 'none',
              border: '1px solid var(--brand-ivory-deeper)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 0.85rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'var(--brand-near-black-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--brand-sienna-pale)';
              e.currentTarget.style.color = 'var(--brand-near-black-soft)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--brand-ivory-deeper)';
              e.currentTarget.style.color = 'var(--brand-near-black-muted)';
            }}
          >
            <span style={{ fontSize: '0.65rem' }}>{showFilters ? '▲' : '▼'}</span>
            Filter by topic
          </button>
        </div>
      </div>

      {/* ── Category filter tabs ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            key="filter-tabs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              role="tablist"
              aria-label="Filter testimonies by category"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingBottom: 'clamp(1.25rem, 3vw, 2rem)' }}
            >
              {ALL_CATEGORIES.map(tab => {
                const isActive = activeTab === tab;
                const label = tab === 'All' ? 'All' : (CATEGORY_LABEL[tab as Category] ?? tab);
                return (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleTabChange(tab)}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.03em',
                      padding: '0.4rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      border: isActive ? '1px solid var(--brand-sienna-light)' : '1px solid var(--brand-ivory-deeper)',
                      background: isActive ? 'var(--brand-sienna-light)' : 'var(--brand-ivory-dark)',
                      color: isActive ? 'var(--brand-near-black)' : 'var(--brand-near-black-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--brand-sienna-pale)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--brand-ivory-deeper)'; }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div style={{
          minHeight: 'clamp(240px, 35vh, 380px)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--brand-ivory-dark)',
          border: '1px solid var(--brand-ivory-deeper)',
          animation: 'pulse 1.5s ease-in-out infinite',
          opacity: 0.55,
        }} />
      )}

      {/* ── Error state ── */}
      {error && !loading && (
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-near-black-muted)',
          fontSize: '0.9rem',
          paddingTop: '2rem',
        }}>
          {error}
        </p>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && total === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-near-black-muted)',
            fontSize: '0.9rem',
            paddingTop: '2rem',
          }}
        >
          No testimonies in this category yet.
        </motion.p>
      )}

      {/* ── Slideshow ── */}
      {!loading && !error && total > 0 && (
        <div>
          {/* Card viewport */}
          <div style={{ overflow: 'hidden', position: 'relative', minHeight: 'clamp(240px, 35vh, 380px)' }}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <TestimonyCard testimony={testimonies[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div style={{
            height: '2px',
            background: 'var(--brand-ivory-deeper)',
            borderRadius: '999px',
            marginTop: '1.25rem',
            overflow: 'hidden',
          }}>
            {!isPaused && total > 1 && (
              <div
                key={currentIndex}
                style={{
                  height: '100%',
                  background: 'var(--brand-sienna-light)',
                  borderRadius: '999px',
                  animation: `slideshow-progress ${SLIDE_DURATION_MS}ms linear forwards`,
                }}
              />
            )}
          </div>

          {/* Navigation row */}
          {total > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              gap: '0.75rem',
            }}>
              {/* Prev */}
              <button
                onClick={() => handleNav(-1)}
                aria-label="Previous testimony"
                style={arrowBtnStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--brand-sienna-pale)';
                  e.currentTarget.style.color = 'var(--brand-near-black-soft)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--brand-ivory-deeper)';
                  e.currentTarget.style.color = 'var(--brand-near-black-muted)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dots + counter */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                  {Array.from({ length: dotCount }, (_, i) => {
                    const isActive = i === activeDot;
                    return (
                      <div
                        key={i}
                        style={{
                          width: isActive ? '1.25rem' : '0.4rem',
                          height: '0.4rem',
                          borderRadius: '999px',
                          background: isActive ? 'var(--brand-sienna-light)' : 'var(--brand-ivory-deeper)',
                          transition: 'width 0.25s ease, background 0.25s ease',
                          flexShrink: 0,
                        }}
                      />
                    );
                  })}
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.7rem',
                  color: 'var(--brand-near-black-muted)',
                  letterSpacing: '0.04em',
                }}>
                  {currentIndex + 1} / {total}
                </span>
              </div>

              {/* Next */}
              <button
                onClick={() => handleNav(1)}
                aria-label="Next testimony"
                style={arrowBtnStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--brand-sienna-pale)';
                  e.currentTarget.style.color = 'var(--brand-near-black-soft)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--brand-ivory-deeper)';
                  e.currentTarget.style.color = 'var(--brand-near-black-muted)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}

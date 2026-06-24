'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { relativeTime } from '@/lib/relativeTime';
import type { TestimonyData, CategoryData } from '@/lib/sanitize';
import ShareButton from '@/components/ShareButton';

const POOL_SIZE = 20;
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

function TestimonyCard({
  testimony,
  categories,
}: {
  testimony: TestimonyData;
  categories: CategoryData[];
}) {
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const category = categories.find((c) => c.id === testimony.categories?.id);
  const colors = CATEGORY_COLORS[category?.slug ?? ''] ?? DEFAULT_COLORS;
  const displayText = testimony.excerpt ?? testimony.body;

  async function handleDownloadPNG() {
    if (!cardRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        scale: 1, useCORS: true, logging: false, backgroundColor: '#EDE6D6',
      });
      const link = document.createElement('a');
      link.download = `testimony-${testimony.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsCapturing(false);
    }
  }

  function handleXShare() {
    const text = encodeURIComponent(
      `"${displayText.slice(0, 120)}"  https://testifi.vercel.app`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }

  async function handleWhatsAppShare() {
    const shareText = `${displayText}\n\nhttps://testifi.vercel.app`;

    if (navigator.canShare && cardRef.current) {
      try {
        const { default: html2canvas } = await import('html2canvas');
        const canvas = await html2canvas(cardRef.current, {
          scale: 1, useCORS: true, logging: false, backgroundColor: '#EDE6D6',
        });
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          const file = new File([blob], `testimony-${testimony.id}.png`, { type: 'image/png' });
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

  return (
    <article
      ref={cardRef}
      style={{
        background: 'var(--brand-ivory-dark)',
        border: '1px solid var(--brand-ivory-deeper)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {testimony.title && (
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)',
          fontWeight: 600,
          color: 'var(--brand-sienna)',
          lineHeight: 1.3,
          margin: 0,
        }}>
          {testimony.title}
        </h3>
      )}

      <p style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--brand-near-black-soft)',
        fontSize: 'clamp(0.875rem, 2vw, 0.975rem)',
        lineHeight: 1.72,
        letterSpacing: '0.01em',
        margin: 0,
      }}>
        {displayText}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginTop: '0.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {category && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}>
              {category.name}
            </span>
          )}

          <span style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-near-black-muted)',
            fontSize: '0.7rem',
            letterSpacing: '0.03em',
          }}>
            Anonymous · {relativeTime(testimony.created_at ?? '')}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.55rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--brand-near-black-muted)',
            marginRight: '0.15rem',
          }}>
            Share
          </span>
          <ShareButton onClick={handleDownloadPNG} disabled={isCapturing} title="Save image">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ShareButton>

          <ShareButton onClick={handleXShare} title="Share on X">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.1 2.25h6.3l4.255 5.643L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </ShareButton>

          <ShareButton onClick={handleWhatsAppShare} title="Share on WhatsApp">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </ShareButton>

          <ShareButton onClick={handleInstagramShare} disabled={isCapturing} title="Share on Instagram">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </ShareButton>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedFeed() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [testimonies, setTestimonies] = useState<TestimonyData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  const fetchTestimonies = useCallback(async (pageNum: number, tab: string | null, append: boolean) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setError('You appear to be offline. Check your connection.');
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    if (!append) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(POOL_SIZE),
      });
      if (tab) params.set('category', tab);

      const res = await fetch(`/api/testimonies?${params}`);
      if (!res.ok) throw new Error('Failed to load.');
      const json = await res.json();

      setTestimonies((prev) => (append ? [...prev, ...json.data] : json.data));
      setHasMore(json.data.length === POOL_SIZE);
    } catch {
      setError('Could not load testimonies. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setTestimonies([]);
    fetchTestimonies(1, activeTab, false);
  }, [activeTab, fetchTestimonies]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchTestimonies(nextPage, activeTab, true);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadingMore, hasMore, loading, page, activeTab, fetchTestimonies]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: 'var(--section-padding-y) var(--section-padding-x)',
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: 'clamp(1.25rem, 3vw, 2rem)' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-sienna-light)',
          fontSize: '0.72rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: '0.5rem',
        }}>
          Testifi-ers
        </p>
        <h2 style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-near-black)',
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: '0.6rem',
        }}>
          Dozens of people have been sharing
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-near-black-muted)',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          lineHeight: 1.65,
          maxWidth: '38ch',
          margin: '0 0 1.25rem 0',
        }}>
          See the evidences of God in their lives.
        </p>

        {categories.length === 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                width: '70px', height: '30px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--brand-ivory-dark)',
                border: '1px solid var(--brand-ivory-deeper)',
                animation: 'pulse 1.5s ease-in-out infinite',
                opacity: 0.5,
              }} />
            ))}
          </div>
        )}

        {categories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab(null)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: activeTab === null ? 700 : 500,
                letterSpacing: '0.03em',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: activeTab === null ? '1px solid var(--brand-sienna-light)' : '1px solid var(--brand-ivory-deeper)',
                background: activeTab === null ? 'var(--brand-sienna-light)' : 'var(--brand-ivory-dark)',
                color: activeTab === null ? 'var(--brand-near-black)' : 'var(--brand-near-black-muted)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              All
            </button>
            {categories.map((cat) => {
              const isActive = activeTab === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.slug)}
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
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              minHeight: '120px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--brand-ivory-dark)',
              border: '1px solid var(--brand-ivory-deeper)',
              animation: 'pulse 1.5s ease-in-out infinite',
              opacity: 0.55,
            }} />
          ))}
        </div>
      )}

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

      {!loading && !error && testimonies.length === 0 && (
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-near-black-muted)',
          fontSize: '0.9rem',
          paddingTop: '2rem',
        }}>
          {activeTab ? 'No testimonies in this category yet.' : 'No testimonies yet.'}
        </p>
      )}

      {!loading && !error && testimonies.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {testimonies.map((testimony) => (
            <TestimonyCard
              key={testimony.id}
              testimony={testimony}
              categories={categories}
            />
          ))}

          {loadingMore && (
            <div style={{
              minHeight: '80px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--brand-ivory-dark)',
              border: '1px solid var(--brand-ivory-deeper)',
              animation: 'pulse 1.5s ease-in-out infinite',
              opacity: 0.55,
            }} />
          )}

          <div ref={sentinelRef} style={{ height: 1 }} />
        </div>
      )}
    </motion.section>
  );
}

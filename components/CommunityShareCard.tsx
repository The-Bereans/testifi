'use client';

import { forwardRef } from 'react';
import { TESTIMONY_TYPE_CONFIG, type TestimonyType } from '@/lib/testimonyTypes';
import { abbreviate } from '@/lib/abbreviate';

interface CommunityShareCardProps {
  word: string;
  excerpt: string | null;
  category: string;
  testimonyType?: TestimonyType;
}

/**
 * Off-screen 1200×630 px branded share card for community testimonies.
 * Rendered at left:-9999px so html2canvas can capture it.
 * All colors are hardcoded hex (no CSS vars) for html2canvas stability.
 */
const CommunityShareCard = forwardRef<HTMLDivElement, CommunityShareCardProps>(
  ({ word, excerpt, category, testimonyType = 'salvation' }, ref) => {
    const config = TESTIMONY_TYPE_CONFIG[testimonyType];
    const wordFontSize =
      word.length > 18 ? '58px' : word.length > 12 ? '76px' : '96px';

    const text = excerpt ?? `${config.label} ${word}`;
    const truncated = abbreviate(text, 200);
    const showBlockquote = excerpt !== null && excerpt !== word;

    return (
      /* Zero-size clipping shell — prevents the 1200×630 card from bleeding
         out of any overflow:hidden parent even when inside a CSS transform. */
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1200px',
          height: '630px',
          background: '#1C1611',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 80px',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {/* Watermark cross */}
        <div
          style={{
            position: 'absolute',
            right: '-56px',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.05,
            pointerEvents: 'none',
          }}
        >
          <svg width="480" height="600" viewBox="0 0 480 600" fill="none">
            <rect x="196" y="0" width="88" height="600" rx="12" fill="#F8F4EC" />
            <rect x="0" y="176" width="480" height="88" rx="12" fill="#F8F4EC" />
          </svg>
        </div>

        {/* Top bar  cross + wordmark + category */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
              <rect x="7.5" y="0" width="3" height="22" rx="1.5" fill="#B5673D" />
              <rect x="0" y="6.5" width="18" height="3" rx="1.5" fill="#B5673D" />
            </svg>
            <span
              style={{
                color: '#B5673D',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
              }}
            >
              Testifi
            </span>
          </div>
          <span
            style={{
              color: 'rgba(181,103,61,0.6)',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
            }}
          >
            {category}
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: '16px',
          }}
        >
          {/* <p
            style={{
              color: 'rgba(248,244,236,0.5)',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '22px',
              fontWeight: 400,
              marginBottom: '10px',
              lineHeight: 1,
            }}
          >
            {config.label}:
          </p> */}

          <h2
            style={{
              color: '#B5673D',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: wordFontSize,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '40px',
            }}
          >
            {word}
          </h2>

          {showBlockquote && <div
            style={{
              borderLeft: '3px solid #B5673D',
              paddingLeft: '24px',
              maxWidth: '740px',
            }}
          >
            {/* <p
              style={{
                color: 'rgba(248,244,236,0.82)',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: '20px',
                fontWeight: 400,
                lineHeight: 1.65,
                fontStyle: 'italic',
              }}
            >
              &ldquo;{truncated}&rdquo;
            </p> */}
          </div>}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <p
            style={{
              color: 'rgba(248,244,236,0.88)',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '26px',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1,
            }}
          >
            {config.suffix}.
          </p>
          <p
            style={{
              color: 'rgba(181,103,61,0.5)',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}
          >
            https://testifi.vercel.app
          </p>
        </div>
      </div>
      </div>
    );
  }
);

CommunityShareCard.displayName = 'CommunityShareCard';
export default CommunityShareCard;

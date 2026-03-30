'use client';

import { forwardRef } from 'react';

interface CommunityShareCardProps {
  word: string;
  excerpt: string;
  category: string;
}

/**
 * Off-screen 1200×630 px branded share card for community testimonies.
 * Rendered at left:-9999px so html2canvas can capture it.
 * All colors are hardcoded hex (no CSS vars) for html2canvas stability.
 */
const CommunityShareCard = forwardRef<HTMLDivElement, CommunityShareCardProps>(
  ({ word, excerpt, category }, ref) => {
    const wordFontSize =
      word.length > 18 ? '58px' : word.length > 12 ? '76px' : '96px';

    const truncated =
      excerpt.length > 200 ? excerpt.slice(0, 197) + '…' : excerpt;

    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
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
          zIndex: -1,
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

        {/* Top bar — cross + wordmark + category */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
              <rect x="7.5" y="0" width="3" height="22" rx="1.5" fill="#B5673D" />
              <rect x="0" y="6.5" width="18" height="3" rx="1.5" fill="#B5673D" />
            </svg>
            <span
              style={{
                color: '#B5673D',
                fontFamily: 'Georgia, "Times New Roman", serif',
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
              fontFamily: 'Georgia, "Times New Roman", serif',
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
          <p
            style={{
              color: 'rgba(248,244,236,0.5)',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '22px',
              fontWeight: 400,
              marginBottom: '10px',
              lineHeight: 1,
            }}
          >
            Jesus saved me from:
          </p>

          <h2
            style={{
              color: '#B5673D',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: wordFontSize,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '40px',
            }}
          >
            {word}
          </h2>

          <div
            style={{
              borderLeft: '3px solid #B5673D',
              paddingLeft: '24px',
              maxWidth: '740px',
            }}
          >
            <p
              style={{
                color: 'rgba(248,244,236,0.82)',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '20px',
                fontWeight: 400,
                lineHeight: 1.65,
                fontStyle: 'italic',
              }}
            >
              &ldquo;{truncated}&rdquo;
            </p>
          </div>
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
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '26px',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1,
            }}
          >
            He still saves.
          </p>
          <p
            style={{
              color: 'rgba(181,103,61,0.5)',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '15px',
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}
          >
            testifi.vercel.app
          </p>
        </div>
      </div>
    );
  }
);

CommunityShareCard.displayName = 'CommunityShareCard';
export default CommunityShareCard;

'use client';

import { forwardRef } from 'react';
import { abbreviate } from '@/lib/abbreviate';

interface ShareCardProps {
  word: string;
  preview?: boolean;
  cardW?: number;
  cardH?: number;
}

function heroFontSize(word: string): string {
  const len = word.length;
  if (len <= 6)  return '140px';
  if (len <= 10) return '120px';
  if (len <= 14) return '100px';
  if (len <= 18) return '80px';
  if (len <= 24) return '64px';
  if (len <= 32) return '52px';
  if (len <= 42) return '42px';
  return '32px';
}

function sentenceFontSize(word: string): string {
  const len = word.length;
  if (len <= 60)  return '48px';
  if (len <= 100) return '38px';
  if (len <= 150) return '30px';
  if (len <= 200) return '26px';
  return '22px';
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ word, preview = false, cardW = 1200, cardH = 900 }, ref) => {
    const isSentence = word.trim().split(/\s+/).length > 2 && !word.includes('-');
    const fontSize = isSentence ? sentenceFontSize(word) : heroFontSize(word);
    const contentTop   = Math.round(cardH * 0.38);
    const contentWidth = cardW - 192;

    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          position: preview ? 'relative' : 'absolute',
          top: 0,
          left: 0,
          width: `${cardW}px`,
          height: `${cardH}px`,
          background: '#2E2418',
          overflow: 'hidden',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 52% 72% at 32% 50%, rgba(46,36,24,0) 0%, rgba(46,36,24,0.55) 60%, rgba(46,36,24,0.80) 100%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: 40,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.07,
          }}
        >
          <svg width="620" height="780" viewBox="0 0 480 600" fill="none">
            <rect x="196" y="0"   width="88"  height="600" rx="12" fill="#F8F4EC" />
            <rect x="0"   y="176" width="480" height="88"  rx="12" fill="#F8F4EC" />
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            top: contentTop,
            left: 96,
            width: contentWidth,
            overflow: 'hidden',
          }}
        >
          {isSentence ? (
            <>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '96px',
                lineHeight: 0.8,
                color: '#B5673D',
                opacity: 0.7,
                marginBottom: '12px',
              }}>
                &ldquo;
              </div>

              <h2 style={{
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: fontSize,
                fontWeight: 600,
                lineHeight: 1.35,
                letterSpacing: '-0.01em',
                color: '#F8F4EC',
                margin: '0 0 20px 0',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                width: '100%',
              }}>
                {abbreviate(word, 220)}
              </h2>

              <p style={{
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: '28px',
                fontWeight: 500,
                fontStyle: 'italic',
                color: '#B5673D',
                margin: 0,
                opacity: 0.9,
              }}>
                My testimony.
              </p>
            </>
          ) : (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: '26px',
                fontWeight: 600,
                lineHeight: 1,
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                <span style={{ color: 'rgba(248,244,236,0.7)' }}>I,</span>
                <span style={{ color: '#B5673D' }}>Testifi</span>
                <span style={{ color: 'rgba(248,244,236,0.7)' }}>That</span>
              </div>

              <h2 style={{
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: fontSize,
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: '-0.025em',
                color: '#B5673D',
                margin: 0,
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                width: '100%',
              }}>
                {word}
              </h2>
            </>
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 72,
            left: 96,
            right: 96,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <p
            style={{
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '26px',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'rgba(248,244,236,0.88)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            My testimony.
          </p>
          <p
            style={{
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '0.03em',
              color: 'rgba(181,103,61,0.5)',
              margin: 0,
            }}
          >
            https://testifi.vercel.app
          </p>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;

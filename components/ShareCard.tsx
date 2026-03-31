'use client';

import { forwardRef } from 'react';

export interface CloudWord { text: string; count: number; }

interface ShareCardProps {
  word: string;
  cloudWords?: CloudWord[];
  preview?: boolean;
}

// ─── Cross geometry constants ───────────────────────────────────────────────

const CROSS = {
  RIGHT_OFFSET: 60,
  SVG_W: 480, SVG_H: 600,
  BEAM_X: 196, BEAM_W: 88,      // vertical beam rect
} as const;
// Derived card-pixel coords
const CROSS_ANCHOR_X = 1200 - CROSS.RIGHT_OFFSET - CROSS.SVG_W + CROSS.BEAM_X + CROSS.BEAM_W / 2; // 900
const CROSS_ANCHOR_Y = 450 - CROSS.SVG_H / 2 + CROSS.SVG_H;  // 750  base of vertical beam

// ─── Deterministic golden-angle spiral positions ────────────────────────────
// No Math.random, no Date, no state  same output every render (html2canvas-safe).
// Caller must pass cloudWords sorted descending by count so index 0 (innermost
// spiral position) is the highest-frequency word  closest to the cross anchor.

const GOLDEN_ANGLE = 2.39996322972865332; // radians
const MAX_R = 220; // px  caps outer spiral ring so words past index ~15 don't drift

interface WordPosition {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

function getClusterPosition(index: number, count: number, maxCount: number): WordPosition {
  const angle = index * GOLDEN_ANGLE;
  const r = Math.min(55 * Math.sqrt(index + 0.5), MAX_R); // capped  D.2

  const x = Math.min(900 + r * Math.cos(angle), 1150);
  const y = Math.min(750 + r * Math.sin(angle), 870);

  const ratio = maxCount > 1 ? (count - 1) / (maxCount - 1) : 0;
  const size = Math.round(12 + ratio * 16);    // 12 – 28 px
  const opacity = 0.08 + ratio * 0.10;          // 0.08 – 0.18 (C.2)

  return { x, y, size, opacity };
}

// ─── Hero word font size (responsive tiers) ──────────────────────────────────

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
  if (len <= 60)  return '52px';
  if (len <= 100) return '42px';
  if (len <= 150) return '34px';
  return '28px';
}

// ─── ShareCard ──────────────────────────────────────────────────────────────
/**
 * Full-bleed layered poster share card  1200×900 px.
 * Layer 1: background word-cloud scatter (golden-angle spiral, deterministic)
 * Layer 2: radial vignette (spotlight on content area)
 * Layer 3: watermark cross (centered-right, opacity 0.05)
 * Layer 4: foreground content (left-aligned, optically centered)
 *
 * Uses only inline styles / system fonts  no CSS vars  html2canvas-safe.
 */
const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ word, cloudWords = [], preview = false }, ref) => {
    const maxCount = cloudWords.reduce((m, w) => Math.max(m, w.count), 0);
    const isSentence = word.trim().split(/\s+/).length > 4;
    const fontSize = isSentence ? sentenceFontSize(word) : heroFontSize(word);

    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          position: preview ? 'relative' : 'fixed',
          left: preview ? 0 : '-9999px',
          top: 0,
          width: '1200px',
          height: '900px',
          background: '#1C1611',
          overflow: 'hidden',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: preview ? 0 : -1,
        }}
      >

        {/* ── Layer 1 · Background word cloud ─────────────────────────────── */}
        {cloudWords.map(({ text, count }, i) => {
          const { x, y, size, opacity } = getClusterPosition(i, count, maxCount);
          return (
            <span
              key={text}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: `${size}px`,
                color: '#F8F4EC',
                opacity,
                fontWeight: count === maxCount ? 700 : 400,
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              {text}
            </span>
          );
        })}

        {/* ── Layer 2 · Radial vignette ────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 52% 72% at 32% 50%, rgba(28,22,17,0) 0%, rgba(28,22,17,0.55) 60%, rgba(28,22,17,0.80) 100%)',
          }}
        />

        {/* ── Layer 3 · Watermark cross (centered-right) ───────────────────── */}
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

        {/* ── Layer 4 · Foreground content ─────────────────────────────────── */}

        {/* Hero content block  starts at optical center (~38% from top = 342px) */}
        <div
          style={{
            position: 'absolute',
            top: 342,
            left: 96,
            right: 96,
          }}
        >
          {isSentence ? (
            /* Sentence layout: skip redundant prefix, show as testimony quote */
            <>
              <div
                style={{
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  fontSize: '72px',
                  fontWeight: 700,
                  lineHeight: 0.9,
                  color: '#B5673D',
                  marginBottom: '16px',
                  opacity: 0.6,
                }}
              >
                &ldquo;
              </div>
              <h2
                style={{
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  fontSize: fontSize,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                  color: '#F8F4EC',
                  margin: 0,
                }}
              >
                {word}
              </h2>
            </>
          ) : (
            /* Short concept layout: "I, Testifi That Jesus Saved Me From [word]" */
            <>
              {/* "I, ✝ testifi that Jesus saved me from"  label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  fontSize: '26px',
                  fontWeight: 600,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: 'rgba(248,244,236,0.7)' }}>I,</span>
                <span style={{ color: '#B5673D' }}>Testifi</span>
                <span style={{ color: 'rgba(248,244,236,0.7)' }}>That Jesus Saved Me From</span>
              </div>

              {/* Hero word */}
              <h2
                style={{
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  fontSize: fontSize,
                  fontWeight: 700,
                  lineHeight: 1.0,
                  letterSpacing: '-0.025em',
                  color: '#B5673D',
                  margin: 0,
                }}
              >
                {word}
              </h2>
            </>
          )}
        </div>

        {/* Bottom bar  "He still saves." + URL */}
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
            Jesus can save you too
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

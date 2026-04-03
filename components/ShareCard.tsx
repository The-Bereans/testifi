'use client';

import { forwardRef } from 'react';
import { TESTIMONY_TYPE_CONFIG, type TestimonyType } from '@/lib/testimonyTypes';
import { abbreviate } from '@/lib/abbreviate';

export interface CloudWord { text: string; count: number; }

interface ShareCardProps {
  word: string;
  cloudWords?: CloudWord[];
  preview?: boolean;
  testimonyType?: TestimonyType;
  cardW?: number;
  cardH?: number;
}

// ─── Cross geometry constants ───────────────────────────────────────────────

const CROSS = {
  RIGHT_OFFSET: 60,
  SVG_W: 480, SVG_H: 600,
  BEAM_X: 196, BEAM_W: 88,      // vertical beam rect
} as const;

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

function getClusterPosition(
  index: number, count: number, maxCount: number,
  anchorX: number, anchorY: number, boundX: number, boundY: number,
): WordPosition {
  const angle = index * GOLDEN_ANGLE;
  const r = Math.min(55 * Math.sqrt(index + 0.5), MAX_R); // capped  D.2

  const x = Math.min(anchorX + r * Math.cos(angle), boundX);
  const y = Math.min(anchorY + r * Math.sin(angle), boundY);

  const ratio = maxCount > 1 ? (count - 1) / (maxCount - 1) : 0;
  const size = Math.round(12 + ratio * 16);    // 12 – 28 px
  const opacity = 0.08 + ratio * 0.10;          // 0.08 – 0.18 (C.2)

  return { x, y, size, opacity };
}

// ─── Hero word font size (responsive tiers) ──────────────────────────────────

// For short concepts (single word / short phrase)
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

// For full sentences — scales down so it always fits in the card
function sentenceFontSize(word: string): string {
  const len = word.length;
  if (len <= 60)  return '48px';
  if (len <= 100) return '38px';
  if (len <= 150) return '30px';
  if (len <= 200) return '26px';
  return '22px';
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
  ({ word, cloudWords = [], preview = false, testimonyType = 'salvation', cardW = 1200, cardH = 900 }, ref) => {
    const config = TESTIMONY_TYPE_CONFIG[testimonyType];
    const maxCount = cloudWords.reduce((m, w) => Math.max(m, w.count), 0);
    // Hero layout for: single word, two words, or any hyphenated compound (e.g. "self-hatred")
    // Quote layout for: three or more non-hyphenated words (a full sentence/story)
    const isSentence = word.trim().split(/\s+/).length > 2 && !word.includes('-');
    const fontSize = isSentence ? sentenceFontSize(word) : heroFontSize(word);

    // Derived layout values — adapt to card orientation
    const crossAnchorX = cardW - CROSS.RIGHT_OFFSET - CROSS.SVG_W + CROSS.BEAM_X + CROSS.BEAM_W / 2;
    const crossAnchorY = cardH / 2 + CROSS.SVG_H / 2; // base of vertical beam
    const contentTop   = Math.round(cardH * 0.38);
    const contentWidth = cardW - 192;                  // 96px margin each side

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
          background: '#1C1611',
          overflow: 'hidden',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >

        {/* ── Layer 1 · Background word cloud ─────────────────────────────── */}
        {cloudWords.map(({ text, count }, i) => {
          const { x, y, size, opacity } = getClusterPosition(
            i, count, maxCount,
            crossAnchorX, crossAnchorY, cardW - 50, cardH - 30,
          );
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

        {/* Hero content block  starts at optical center (~38% from top) */}
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
            /* ── Sentence layout: quoted testimony ─────────────────────────── */
            <>
              {/* Opening quote */}
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

              {/* The testimony sentence */}
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

              {/* Closing attribution */}
              <p style={{
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: '28px',
                fontWeight: 500,
                fontStyle: 'italic',
                color: '#B5673D',
                margin: 0,
                opacity: 0.9,
              }}>
                {config.suffix}.
              </p>
            </>
          ) : (
            /* ── Short concept layout ──────────────────────────────────────── */
            <>
              {/* "I, Testifi That [label]"  label */}
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
                <span style={{ color: 'rgba(248,244,236,0.7)' }}>That {config.label}</span>
              </div>

              {/* Hero word */}
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
            {config.suffix}
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

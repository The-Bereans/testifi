'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wordFontSize(count: number): string {
  if (count >= 40) return '3.25rem';
  if (count >= 25) return '2.5rem';
  if (count >= 15) return '1.875rem';
  if (count >= 10) return '1.5rem';
  if (count >= 6)  return '1.25rem';
  if (count >= 3)  return '1.05rem';
  return '0.9rem';
}

function wordColor(count: number, isNew: boolean): string {
  if (isNew)        return 'var(--brand-sienna-light)';
  if (count >= 25)  return 'var(--brand-sienna-warm)';
  if (count >= 10)  return 'var(--brand-sienna)';
  return 'var(--brand-near-black-muted)';
}

// ─── WordChip ─────────────────────────────────────────────────────────────────

function WordChip({
  word,
  count,
  isNew,
  onClick,
}: {
  word: string;
  count: number;
  isNew: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      layout
      initial={isNew ? { opacity: 0, scale: 0.5 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        isNew
          ? { type: 'spring', stiffness: 380, damping: 22, delay: 0.05 }
          : undefined
      }
      onClick={onClick}
      whileHover={{ opacity: 0.72, scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{
        fontSize: wordFontSize(count),
        color: wordColor(count, isNew),
        fontFamily: 'var(--font-body)',
        fontWeight: isNew ? 700 : 500,
        lineHeight: 1.15,
        cursor: 'pointer',
        display: 'inline-block',
        padding: '0.15em 0.3em',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        // Horizontal only  no transform rotations
        writingMode: 'horizontal-tb',
        textOrientation: 'mixed',
      }}
      aria-label={`${word}  ${count} people`}
    >
      {word}
    </motion.button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function WordModal({
  word,
  count,
  onClose,
}: {
  word: string;
  count: number;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(28, 22, 17, 0.55)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.86, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--brand-ivory)',
          border: '1.5px solid var(--brand-ivory-deeper)',
          borderRadius: '1rem',
          padding: '2.5rem 2rem 2rem',
          maxWidth: '22rem',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 24px 64px rgba(28, 22, 17, 0.22)',
        }}
      >
        {/* Word */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(2rem, 10vw, 3rem)',
            color: 'var(--brand-sienna-light)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
          }}
        >
          {word}
        </p>

        {/* Count line */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--brand-near-black-muted)',
            marginBottom: '0.25rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--brand-sienna)',
              display: 'block',
              lineHeight: 1,
              marginBottom: '0.3rem',
            }}
          >
            {count}
          </span>
          people were saved from this
        </p>

        {/* Reassurance */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--brand-near-black-muted)',
            marginTop: '0.5rem',
            marginBottom: '1.75rem',
            fontStyle: 'italic',
          }}
        >
          You are not alone.
        </p>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            padding: '0.625rem 1.75rem',
            background: 'var(--brand-sienna-light)',
            color: 'var(--brand-near-black)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              'var(--brand-sienna-dark)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              'var(--brand-sienna-light)')
          }
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── WordCloud ────────────────────────────────────────────────────────────────

export interface WordCloudProps {
  words: Record<string, number>;
  newWord: string | null;
}

export default function WordCloud({ words, newWord }: WordCloudProps) {
  const [selected, setSelected] = useState<{ word: string; count: number } | null>(
    null
  );

  const sortedWords = Object.entries(words).sort(
    ([aW, aC], [bW, bC]) => bC - aC || aW.localeCompare(bW)
  );

  return (
    <>
      <motion.div
        layout
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 max-w-2xl mx-auto w-full"
        style={{ lineHeight: 1.4 }}
      >
        {sortedWords.map(([word, count]) => (
          <WordChip
            key={word}
            word={word}
            count={count}
            isNew={word === newWord}
            onClick={() => setSelected({ word, count })}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <WordModal
            word={selected.word}
            count={selected.count}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

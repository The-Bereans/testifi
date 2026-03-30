'use client';

import { motion } from 'framer-motion';

interface AppIntroProps {
  onBegin: () => void;
}

export default function AppIntro({ onBegin }: AppIntroProps) {
  return (
    <section
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1C1611',
        padding: 'clamp(2rem, 6vw, 4rem)',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Radial warm glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(181,103,61,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 700,
          color: '#F5F0E8',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          maxWidth: '16ch',
          position: 'relative',
        }}
      >
        He still saves.
      </motion.h1>

      {/* Subline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6, ease: 'easeOut' }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'rgba(245,240,232,0.65)',
          marginBottom: '2.5rem',
          maxWidth: '32ch',
          lineHeight: 1.55,
          position: 'relative',
        }}
      >
        What did Jesus save you from?
      </motion.p>

      {/* Gold divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '2.5rem',
          height: '2px',
          background: 'var(--brand-sienna-light)',
          borderRadius: '999px',
          margin: '0 auto 2.5rem',
          transformOrigin: 'center',
          position: 'relative',
        }}
      />

      {/* CTA button */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={onBegin}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          color: '#1C1611',
          background: 'var(--brand-sienna-light)',
          border: 'none',
          borderRadius: '999px',
          padding: '0.85rem 2.25rem',
          cursor: 'pointer',
          position: 'relative',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        I want to share
      </motion.button>
    </section>
  );
}

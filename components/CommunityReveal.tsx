'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import FeaturedFeed from '@/components/FeaturedFeed';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CommunityReveal() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const feedRef     = useRef<HTMLDivElement>(null);
  const [feedVisible, setFeedVisible] = useState(false);

  const pastSection = useInView(sentinelRef, { once: false, margin: '0px 0px -40px 0px' });

  const showButton = pastSection && !feedVisible;

  function handleReveal() {
    setFeedVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  return (
    <>
      {/* Sentinel sits between TestimonySection and FeaturedFeed */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Stage 1 + 2 — Inline section anchor CTA */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            key="reveal-cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            style={{
              width:      '100%',
              padding:    '3rem 1.5rem',
              display:    'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap:        '1.5rem',
            }}
          >
            {/* Top divider */}
            <div style={{
              width:           '100%',
              maxWidth:        '480px',
              height:          '1px',
              background:      'linear-gradient(to right, transparent, rgba(181,103,61,0.35), transparent)',
            }} />

            {/* Copy + button */}
            <div style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '0.6rem',
              textAlign:      'center',
            }}>
              <p style={{
                color:          '#C9A87C',
                fontSize:       '0.8125rem',
                letterSpacing:  '0.12em',
                textTransform:  'uppercase',
                fontWeight:     500,
                opacity:        0.7,
                margin:         0,
              }}>
                You are not alone
              </p>

              <button
                onClick={handleReveal}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '0.75rem',
                  background:     'none',
                  border:         'none',
                  cursor:         'pointer',
                  padding:        '0.25rem 0',
                  color:          '#F5ECD7',
                  fontSize:       '1.25rem',
                  fontWeight:     600,
                  letterSpacing:  '-0.01em',
                  lineHeight:     1.25,
                }}
              >
                Others have been set free too. Read their stories.
                <span style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  width:          '2rem',
                  height:         '2rem',
                  borderRadius:   '9999px',
                  border:         '1px solid rgba(181,103,61,0.5)',
                  color:          '#C9A87C',
                  fontSize:       '1rem',
                  flexShrink:     0,
                  transition:     'background 0.2s',
                }}>
                  ↓
                </span>
              </button>
            </div>

            {/* Bottom divider */}
            <div style={{
              width:      '100%',
              maxWidth:   '480px',
              height:     '1px',
              background: 'linear-gradient(to right, transparent, rgba(181,103,61,0.35), transparent)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3 — Persistent in-page marker after reveal */}
      <AnimatePresence>
        {feedVisible && (
          <motion.div
            key="feed-marker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            style={{
              width:          '100%',
              padding:        '2rem 1.5rem 0.75rem',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '0.75rem',
            }}
          >
            <div style={{
              width:      '100%',
              maxWidth:   '480px',
              height:     '1px',
              background: 'linear-gradient(to right, transparent, rgba(181,103,61,0.3), transparent)',
            }} />
            <p style={{
              color:          '#C9A87C',
              fontSize:       '0.75rem',
              letterSpacing:  '0.12em',
              textTransform:  'uppercase',
              fontWeight:     500,
              opacity:        0.5,
              margin:         0,
            }}>
              Community feed
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FeaturedFeed hidden until revealed */}
      <AnimatePresence>
        {feedVisible && (
          <motion.div
            ref={feedRef}
            key="feed"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <FeaturedFeed />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import FeaturedFeed from '@/components/FeaturedFeed';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CommunityReveal() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const feedRef     = useRef<HTMLDivElement>(null);
  const [feedVisible, setFeedVisible] = useState(false);

  // Sentinel sits at the top of this section.
  // When it scrolls into the viewport the user has cleared TestimonySection.
  const pastSection = useInView(sentinelRef, { once: false, margin: '0px 0px -40px 0px' });

  const showButton = pastSection && !feedVisible;

  function handleReveal() {
    setFeedVisible(true);
    // Give React one frame to mount FeaturedFeed, then scroll to it.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  return (
    <>
      {/* Sentinel — sits between TestimonySection and FeaturedFeed */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Sticky reveal button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            key="reveal-btn"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            style={{
              position:       'fixed',
              bottom:         '2rem',
              left:           '50%',
              transform:      'translateX(-50%)',
              zIndex:         50,
              pointerEvents:  'auto',
            }}
          >
            <button
              onClick={handleReveal}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             '0.5rem',
                padding:         '0.75rem 1.5rem',
                borderRadius:    '9999px',
                background:      'rgba(28, 22, 17, 0.92)',
                backdropFilter:  'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border:          '1px solid rgba(181, 103, 61, 0.45)',
                color:           '#F5ECD7',
                fontSize:        '0.9375rem',
                fontWeight:      500,
                letterSpacing:   '0.01em',
                cursor:          'pointer',
                boxShadow:       '0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(181,103,61,0.15)',
                whiteSpace:      'nowrap',
              }}
            >
              Read others&#39; testimonies
              <span style={{ fontSize: '1.05em', opacity: 0.8 }}>→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FeaturedFeed — hidden until revealed */}
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

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeaturedFeed from '@/components/FeaturedFeed';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CommunityReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
    >
      <FeaturedFeed />
    </motion.div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export interface TickerTestimony {
  excerpt: string;
  label: string;
}

interface Props {
  testimonies: TickerTestimony[];
}

export default function TestimonyTicker({ testimonies }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (testimonies.length <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % testimonies.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(id);
  }, [testimonies.length]);

  if (!testimonies.length) return null;

  const current = testimonies[activeIndex];

  return (
    <div
      style={{
        maxWidth: '560px',
        marginInline: 'auto',
        marginTop: '2rem',
        minHeight: '4.5rem',
        paddingLeft: '1rem',
        textAlign: 'left',
        opacity: visible ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.0625rem, 2.5vw, 1.1875rem)',
          color: 'var(--brand-near-black)',
          lineHeight: 1.65,
          margin: 0,
          marginBottom: '0.45rem',
        }}
      >
        &ldquo;{current.excerpt}&rdquo;
      </p>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          color: 'var(--brand-near-black-muted)',
          letterSpacing: '0.03em',
          margin: 0,
        }}
      >
        &mdash; {current.label}
      </p>
    </div>
  );
}
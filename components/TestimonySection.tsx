'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Easter / salvation icons ──────────────────────────────────────────────────
const ICON_STYLE = { width: 26, height: 26, color: 'rgba(139,74,42,0.28)', display: 'block' } as const;

function IconSVG({ name }: { name: string }) {
  switch (name) {
    case 'cross':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M5.25 8.625H18.75M12 21V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'crownofthorns':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M19.2724 12C19.2724 16.0164 16.0164 19.2724 12 19.2724M19.2724 12C19.2724 7.98357 16.0164 4.7276 12 4.7276M19.2724 12L21.3502 12M12 19.2724C7.98357 19.2724 4.7276 16.0164 4.7276 12M12 19.2724L12 21.3503M4.7276 12C4.7276 7.98357 7.98357 4.7276 12 4.7276M4.7276 12L2.64978 12M12 4.7276L12 2.64978M15.1168 8.93216L19.3213 4.72761M4.7276 19.3213L8.93214 15.1168M8.93216 8.93216L4.72761 4.72761M19.3213 19.3213L15.1167 15.1168" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'heart':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M16.0906 3.81891C19.3323 3.81891 21.2038 6.3755 21.2038 9.70931C21.2038 15.4668 12.1636 20.1811 12 20.1811C11.8364 20.1811 2.79626 15.4668 2.79626 9.70931C2.79626 6.3755 4.66769 3.81891 7.90946 3.81891C9.77066 3.81891 11.2944 5.55739 12 6.3755C12.7056 5.55739 14.2294 3.81891 16.0906 3.81891Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'chalice':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M5 5H19M6 5C4 10 5 14 9 15M18 5C20 10 19 14 15 15M9 15C10 17 14 17 15 15M12 17V20M7 20H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'dove':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M4 10L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11C6 9 8 7 11 8C16 9 20 11 19 15C18 19 13 18 10 17C7 16 6 14 7 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 10C10 5 18 4 18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 14L22 12M19 15L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'flame':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M12 2C8 5 6 10 7 14C8 18 10 21 12 21C14 21 16 18 17 14C18 10 16 5 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'anchor':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M10 4C10 2 14 2 14 4C14 6 10 6 10 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 6V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 9H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20C8 20 5 18 5 15M12 20C16 20 19 18 19 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'fish':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M6 12C6 8 10 7 15 12C10 17 6 16 6 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12L19 9M15 12L19 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'nail':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M9 3H15V7L13 7L12 21L11 7H9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'palmleaf':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M4 20C8 15 14 9 20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 17C5 15 4 13 6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 14C13 12 15 13 14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 10C12 8 12 6 14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 7C19 5 20 7 18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'risingsun':
      return <svg viewBox="0 0 24 24" fill="none" style={ICON_STYLE}><path d="M2 16H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 16A7 7 0 0 1 19 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 9V4M8 10L6 6M6 13L3 11M16 10L18 6M18 13L21 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default: return null;
  }
}

const LEFT_ICONS  = [
  { top: '10%', left: '5%', delay: 0.15, icon: 'cross' },
  { top: '28%', left: '5%', delay: 0.25, icon: 'palmleaf' },
  { top: '46%', left: '5%', delay: 0.38, icon: 'crownofthorns' },
  { top: '64%', left: '5%', delay: 0.2,  icon: 'dove' },
  { top: '80%', left: '5%', delay: 0.45, icon: 'anchor' },
];
const RIGHT_ICONS = [
  { top: '10%', right: '5%', delay: 0.18, icon: 'nail' },
  { top: '28%', right: '5%', delay: 0.3,  icon: 'chalice' },
  { top: '46%', right: '5%', delay: 0.42, icon: 'flame' },
  { top: '64%', right: '5%', delay: 0.22, icon: 'heart' },
  { top: '80%', right: '5%', delay: 0.48, icon: 'fish' },
];

// Mobile snowfall: pre-generated particles (no Math.random — fixed for SSR safety)
const ICON_NAMES = ['cross','palmleaf','crownofthorns','dove','anchor','nail','chalice','flame','heart','fish'];
const SNOW_PARTICLES = [
  { left:  '4%', delay: 0.0,  duration: 5.2, icon: ICON_NAMES[0] },
  { left: '11%', delay: 0.8,  duration: 6.1, icon: ICON_NAMES[1] },
  { left: '18%', delay: 1.9,  duration: 4.8, icon: ICON_NAMES[2] },
  { left: '25%', delay: 0.4,  duration: 5.7, icon: ICON_NAMES[3] },
  { left: '32%', delay: 2.3,  duration: 6.4, icon: ICON_NAMES[4] },
  { left: '39%', delay: 1.1,  duration: 5.0, icon: ICON_NAMES[5] },
  { left: '46%', delay: 3.0,  duration: 4.6, icon: ICON_NAMES[6] },
  { left: '53%', delay: 0.6,  duration: 6.8, icon: ICON_NAMES[7] },
  { left: '60%', delay: 2.7,  duration: 5.3, icon: ICON_NAMES[8] },
  { left: '67%', delay: 1.4,  duration: 4.9, icon: ICON_NAMES[9] },
  { left: '74%', delay: 3.5,  duration: 6.2, icon: ICON_NAMES[0] },
  { left: '81%', delay: 0.2,  duration: 5.8, icon: ICON_NAMES[1] },
  { left: '88%', delay: 2.1,  duration: 4.7, icon: ICON_NAMES[2] },
  { left: '94%', delay: 1.6,  duration: 6.5, icon: ICON_NAMES[3] },
  { left:  '7%', delay: 4.0,  duration: 5.1, icon: ICON_NAMES[4] },
  { left: '15%', delay: 3.2,  duration: 6.0, icon: ICON_NAMES[5] },
  { left: '22%', delay: 0.9,  duration: 4.5, icon: ICON_NAMES[6] },
  { left: '29%', delay: 4.4,  duration: 5.6, icon: ICON_NAMES[7] },
  { left: '36%', delay: 1.7,  duration: 6.3, icon: ICON_NAMES[8] },
  { left: '43%', delay: 3.8,  duration: 4.4, icon: ICON_NAMES[9] },
  { left: '50%', delay: 0.3,  duration: 5.9, icon: ICON_NAMES[0] },
  { left: '57%', delay: 2.6,  duration: 4.3, icon: ICON_NAMES[1] },
  { left: '64%', delay: 4.2,  duration: 6.6, icon: ICON_NAMES[2] },
  { left: '71%', delay: 1.0,  duration: 5.4, icon: ICON_NAMES[3] },
  { left: '78%', delay: 3.6,  duration: 4.1, icon: ICON_NAMES[4] },
  { left: '85%', delay: 0.7,  duration: 6.9, icon: ICON_NAMES[5] },
  { left: '92%', delay: 2.9,  duration: 5.5, icon: ICON_NAMES[6] },
  { left:  '2%', delay: 4.8,  duration: 4.2, icon: ICON_NAMES[7] },
  { left: '13%', delay: 1.3,  duration: 6.7, icon: ICON_NAMES[8] },
  { left: '20%', delay: 3.1,  duration: 5.0, icon: ICON_NAMES[9] },
  { left: '27%', delay: 0.5,  duration: 4.8, icon: ICON_NAMES[0] },
  { left: '34%', delay: 4.6,  duration: 6.1, icon: ICON_NAMES[1] },
  { left: '41%', delay: 2.2,  duration: 5.2, icon: ICON_NAMES[2] },
  { left: '48%', delay: 3.9,  duration: 4.6, icon: ICON_NAMES[3] },
  { left: '55%', delay: 1.5,  duration: 6.4, icon: ICON_NAMES[4] },
  { left: '62%', delay: 4.3,  duration: 5.7, icon: ICON_NAMES[5] },
  { left: '69%', delay: 0.1,  duration: 4.0, icon: ICON_NAMES[6] },
  { left: '76%', delay: 2.4,  duration: 6.2, icon: ICON_NAMES[7] },
  { left: '83%', delay: 3.7,  duration: 5.3, icon: ICON_NAMES[8] },
  { left: '90%', delay: 1.8,  duration: 4.9, icon: ICON_NAMES[9] },
  { left:  '9%', delay: 4.5,  duration: 6.8, icon: ICON_NAMES[0] },
  { left: '16%', delay: 2.8,  duration: 5.1, icon: ICON_NAMES[1] },
  { left: '23%', delay: 0.0,  duration: 6.3, icon: ICON_NAMES[2] },
  { left: '30%', delay: 4.1,  duration: 4.7, icon: ICON_NAMES[3] },
  { left: '37%', delay: 1.2,  duration: 5.8, icon: ICON_NAMES[4] },
];
// ─────────────────────────────────────────────────────────────────────────────
import { normalize } from '@/lib/normalizer';
import { CATEGORIES, CATEGORY_LABELS, type Category } from '@/lib/sanitize';
import { useWordCloud } from '@/lib/hooks/useWordCloud';
import WordCloud from '@/components/WordCloud';
import ShareCard from '@/components/ShareCard';

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.22, 1, 0.36, 1];
const EASE_IN:  CubicBezier = [0.4,  0,  1,   1];

const sectionVariants = {
  enter:   { opacity: 0, y: 32,  transition: { duration: 0.45, ease: EASE_OUT } },
  visible: { opacity: 1, y: 0,   transition: { duration: 0.45, ease: EASE_OUT } },
  exit:    { opacity: 0, y: -24, transition: { duration: 0.3,  ease: EASE_IN  } },
};

const PLACEHOLDERS = [
  'pornography',
  'betting. I once bet my school fees',
  'a chronic football addiction',
  'homosexuality',
  'alcohol',
  'anger. I almost destroyed my marriage',
  'drugs',
  'shame',
  'loneliness',
  'suicidal thoughts',
];

// Best-effort mapping from canonical word → category
const WORD_TO_CATEGORY: Partial<Record<string, Category>> = {
  // addiction
  alcohol: 'addiction', weed: 'addiction', drugs: 'addiction',
  cocaine: 'addiction', heroin: 'addiction', smoking: 'addiction',
  nicotine: 'addiction', gambling: 'addiction',
  // anxiety
  anxiety: 'anxiety', worry: 'anxiety', fear: 'anxiety',
  'panic attacks': 'anxiety', paranoia: 'anxiety',
  // depression
  depression: 'depression', sadness: 'depression', grief: 'depression',
  despair: 'depression', hopelessness: 'depression',
  // anger
  anger: 'anger', rage: 'anger', wrath: 'anger',
  bitterness: 'anger', resentment: 'anger', unforgiveness: 'anger',
  // shame
  shame: 'shame', guilt: 'shame', regret: 'shame', remorse: 'shame',
  // identity
  insecurity: 'identity', pride: 'identity', 'self-hatred': 'identity',
  'low self-esteem': 'identity', worthlessness: 'identity', 'self-doubt': 'identity',
  // relationships
  loneliness: 'relationships', isolation: 'relationships', rejection: 'relationships',
  abandonment: 'relationships', betrayal: 'relationships', heartbreak: 'relationships',
  // sexual sin
  pornography: 'sexual sin', masturbation: 'sexual sin', lust: 'sexual sin',
  'sexual immorality': 'sexual sin', adultery: 'sexual sin', infidelity: 'sexual sin',
  // mental health
  'suicidal thoughts': 'mental health', 'self-harm': 'mental health',
  'eating disorder': 'mental health', OCD: 'mental health',
  trauma: 'mental health', abuse: 'mental health',
};

type Step = 'input' | 'loading' | 'cloud';

export default function TestimonySection() {
  const [step, setStep]                     = useState<Step>('input');
  const [input, setInput]                   = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [error, setError]                   = useState<'empty' | 'filtered' | null>(null);
  const [newWord, setNewWord]               = useState<string | null>(null);
  const inputRef                            = useRef<HTMLTextAreaElement>(null);

  const shareCardRef                        = useRef<HTMLDivElement>(null);
  const previewWrapRef                      = useRef<HTMLDivElement>(null);
  const CARD_W = 1200;
  const CARD_H = 900;
  const [previewScale, setPreviewScale]     = useState(500 / CARD_W);
  const [testimonyText, setTestimonyText]   = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [depthSubmitted, setDepthSubmitted] = useState(false);
  const [category, setCategory]             = useState<Category | ''>('');
  const [showThankYou, setShowThankYou]     = useState(false);
  const [isCapturing, setIsCapturing]       = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const { words, addWord } = useWordCloud();

  // Sorted descending by count  ShareCard relies on index 0 being the
  // highest-frequency word so it lands innermost on the spiral (D.1).
  const cloudWords = Object.entries(words)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 25)
    .map(([text, count]) => ({ text, count }));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (step === 'input') inputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (step !== 'cloud' || !previewWrapRef.current) return;
    const el = previewWrapRef.current;
    const update = () => setPreviewScale(el.offsetWidth / CARD_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [step]);

  async function handleSubmit() {
    const result = normalize(input);
    if (result.type === 'empty')    { setError('empty');    return; }
    if (result.type === 'filtered') { setError('filtered'); return; }
    setError(null);
    setStep('loading');
    const word = result.canonical;
    // Best-effort pre-fill category from the canonical word
    setCategory(WORD_TO_CATEGORY[word] ?? '');
    setTimeout(async () => {
      await addWord(word);
      setNewWord(word);
      setStep('cloud');
    }, 1400);
  }

  function handleReset() {
    setInput('');
    setNewWord(null);
    setError(null);
    setTestimonyText('');
    setConsentChecked(false);
    setDepthSubmitted(false);
    setShowThankYou(false);
    setCategory('');
    setStep('input');
  }

  async function handleDepthSubmit() {
    setDepthSubmitted(true);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 1500);
    setTestimonyText('');

    // Persist testimony with optional category (fire-and-forget)
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: newWord,
          body: testimonyText,
          consented: consentChecked,
          ...(category ? { category } : {}),
        }),
      });
    } catch {
      // Network error  thank-you already shown; no UX disruption
    }
  }

  async function handleDownloadPNG() {
    if (!shareCardRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1C1611',
      });
      const link = document.createElement('a');
      link.download = `testimony-${newWord ?? 'mine'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsCapturing(false);
    }
  }

  function handleTwitterShare() {
    const text = `Jesus saved me from ${newWord}. He still saves. #Testifi`;
    const url  = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: 'Jesus saved me',
        text: `Jesus saved me from ${newWord}. He still saves.`,
        url: window.location.href,
      });
    } catch {
      // user cancelled or share failed
    }
  }

  async function handleWhatsAppShare() {
    const shareText = `Heyyy, I want you to know something very important. Jesus saved me. \n Yessss, He can also save you. \n\n https://testifi.vercel.app`;
    //const shareText = `Hey, I want you to know something very important. Jesus saved me. This is is my testimony. ${newWord}. \n He still saves.\n\nhttps://testifi.vercel.app`;
    // Try native share with image (works on mobile)
    if (navigator.canShare && shareCardRef.current) {
      try {
        const { default: html2canvas } = await import('html2canvas');
        const canvas = await html2canvas(shareCardRef.current, {
          scale: 1, useCORS: true, logging: false, backgroundColor: '#1C1611',
        });
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          const file = new File([blob], `testimony-${newWord}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], text: shareText });
            return;
          }
        }
      } catch {
        // Fall through to text-only fallback
      }
    }

    // Fallback: text-only wa.me link (desktop / unsupported browsers)
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  }

  async function handleInstagramShare() {
    await handleDownloadPNG();
    window.open('https://www.instagram.com', '_blank');
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">

      {/* Stage C: full-screen thank-you flash */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            key="thankyou-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'var(--brand-ivory)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: EASE_OUT }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                fontWeight: 700,
                color: 'var(--brand-near-black)',
                lineHeight: 1.2,
              }}
            >
              Thank you. Your story matters.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* INPUT STEP */}
        {step === 'input' && (
          <motion.section
            key="input"
            variants={sectionVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            className="flex flex-col flex-1 items-center justify-center relative overflow-hidden"
            style={{ paddingTop: 'clamp(3rem, 10vw, 6rem)', paddingBottom: 'clamp(3rem, 10vw, 6rem)' }}
          >
            {/* Background: warm sunburst rays + soft glow */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
              }}
            >
              {/* Central radial warmth */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '900px',
                height: '700px',
                background: 'radial-gradient(ellipse at 50% 0%, rgba(181,103,61,0.10) 0%, rgba(248,244,236,0) 65%)',
                filter: 'blur(30px)',
              }} />
            </div>

            {/* Mobile: continuous snowfall particles — CSS keyframes, negative delays = immediate mid-fall */}
            {isMobile && (
              <>
                <style>{`
                  @keyframes snowfall {
                    0%   { transform: translateY(-50px); opacity: 0; }
                    8%   { opacity: 0.45; }
                    85%  { opacity: 0.45; }
                    100% { transform: translateY(62vh);  opacity: 0; }
                  }
                `}</style>
                {SNOW_PARTICLES.map((item, i) => (
                  <div
                    key={`snow-${i}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: item.left,
                      pointerEvents: 'none',
                      zIndex: 0,
                      animation: `snowfall ${item.duration}s linear -${item.delay}s infinite`,
                    }}
                  >
                    <IconSVG name={item.icon} />
                  </div>
                ))}
              </>
            )}

            {/* Desktop: left column icons */}
            {!isMobile && LEFT_ICONS.map((item, i) => (
              <motion.div
                key={`left-${i}`}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', top: item.top, left: item.left, pointerEvents: 'none', zIndex: 0 }}
              >
                <IconSVG name={item.icon} />
              </motion.div>
            ))}

            {/* Desktop: right column icons */}
            {!isMobile && RIGHT_ICONS.map((item, i) => (
              <motion.div
                key={`right-${i}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', top: item.top, right: item.right, pointerEvents: 'none', zIndex: 0 }}
              >
                <IconSVG name={item.icon} />
              </motion.div>
            ))}

            {/* Content wrapper */}
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '54rem', padding: '0 1.5rem', textAlign: 'center' }}>

              {/* Intro overline */}
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--brand-sienna)',
                  marginBottom: '1.5rem',
                }}
              >
                They overcame by the blood of the Lamb and the word of their testimony &mdash; Rev. 12:11
              </motion.p>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.6rem, 9vw, 6rem)',
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                  color: 'var(--brand-near-black)',
                  marginBottom: '2.75rem',
                }}
              >
                What has Jesus{' '}
                <span style={{ color: 'var(--brand-sienna)', fontStyle: 'italic' }}>saved you</span>{' '}
                from?
              </motion.h1>

              {/* Testimony input card */}
              <motion.div
                style={{ maxWidth: '36rem', marginInline: 'auto', width: '100%' }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  style={{
                    background: 'rgba(255,252,247,0.85)',
                    borderRadius: '1.25rem',
                    padding: 'clamp(1.25rem, 3.5vw, 1.75rem)',
                    boxShadow: '0 8px 40px rgba(28,22,17,0.10)',
                    border: `1px solid ${error ? '#b94040' : 'var(--brand-ivory-deeper)'}`,
                    transition: 'border-color 0.15s',
                    position: 'relative',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.textarea
                      key="testimony-input"
                      ref={inputRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        if (error) setError(null);
                        // auto-grow
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      onKeyDown={(e) => {
                        if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                      placeholder={PLACEHOLDERS[placeholderIdx]}
                      maxLength={400}
                      autoComplete="off"
                      spellCheck={false}
                      aria-label="Share your testimony"
                      rows={3}
                      style={{
                        display: 'block',
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
                        fontWeight: 500,
                        color: 'var(--brand-sienna)',
                        letterSpacing: '-0.01em',
                        caretColor: 'var(--brand-sienna-light)',
                        lineHeight: 1.6,
                        minHeight: isMobile ? '8rem' : '5rem',
                        paddingRight: '3.5rem',
                      }}
                    />
                  </AnimatePresence>

                  {/* Arrow send button  bottom-right corner */}
                  <button
                    onClick={handleSubmit}
                    aria-label="Share testimony"
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      background: 'transparent',
                      color: 'var(--brand-sienna)',
                      border: '1.5px solid var(--brand-sienna-light)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      boxShadow: 'none',
                      transition: 'background 0.18s, transform 0.1s, border-color 0.18s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,74,42,0.10)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand-sienna)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand-sienna-light)';
                    }}
                    onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)')}
                    onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
                  >
                    ↑
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      role="alert"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        color: '#b94040',
                        marginTop: '0.6rem',
                        textAlign: 'left',
                        paddingLeft: '0.25rem',
                      }}
                    >
                      {error === 'empty' ? 'Please share something.' : 'Please try again.'}
                    </motion.p>
                  )}
                </AnimatePresence>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  color: 'var(--brand-near-black-muted)',
                  marginTop: '0.85rem',
                  letterSpacing: '0.02em',
                }}>
                  {isMobile
                    ? 'Click ↑ to share'
                    : 'Press Enter or ↑ to share \u00a0·\u00a0 Shift+Enter for new line'
                  }
                </p>
              </motion.div>

            </div>
          </motion.section>
        )}

        {/* LOADING STEP */}
        {step === 'loading' && (
          <motion.section
            key="loading"
            variants={sectionVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            className="flex flex-col flex-1 items-center justify-center px-6 text-center"
          >
            <LoadingDots />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                color: 'var(--brand-near-black-muted)',
                marginTop: '1.5rem',
              }}
            >
              Recording your story...
            </p>
          </motion.section>
        )}

        {/* CLOUD STEP (Phase 3 - WITNESS) */}
        {step === 'cloud' && (
          <motion.section
            key="cloud"
            variants={sectionVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            className="flex flex-col flex-1 items-center px-6 pb-16"
            style={{ position: 'relative', paddingTop: 'clamp(4rem, 12vw, 7rem)' }}
          >
            {/* Share card preview */}
            {newWord && (
              <motion.div
                ref={previewWrapRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: isMobile ? 'calc(100% - 24px)' : '100%',
                  maxWidth: 500,
                  height: Math.round(CARD_H * previewScale),
                  overflow: 'hidden',
                  borderRadius: '0.75rem',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  marginBottom: '1rem',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  <ShareCard
                    word={newWord}
                    cloudWords={cloudWords}
                    preview
                  />
                </div>
              </motion.div>
            )}

            {/* Share nudge */}
            {newWord && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-muted)',
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  textAlign: 'center',
                  maxWidth: 320,
                  marginBottom: '1rem',
                }}
              >
                Someone in your circle needs to be set free. Share it.
              </motion.p>
            )}

            {/* Share buttons  4 circular icons under the card */}
            {newWord && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '2rem',
                  width: '100%',
                  maxWidth: 500,
                }}
              >
                {/* Download */}
                <button
                  className="share-btn"
                  onClick={handleDownloadPNG}
                  disabled={isCapturing}
                  title={isCapturing ? 'Saving…' : 'Save image'}
                  style={{
                    width: '3rem', height: '3rem',
                    border: '1.5px solid #6B3520', borderRadius: '50%',
                    background: 'none', cursor: isCapturing ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-accent)', padding: 0, lineHeight: 0,
                    opacity: isCapturing ? 0.4 : 1,
                    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* X / Twitter */}
                <button
                  className="share-btn"
                  onClick={handleTwitterShare}
                  title="Share on X"
                  style={{
                    width: '3rem', height: '3rem',
                    border: '1.5px solid #6B3520', borderRadius: '50%',
                    background: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-accent)', padding: 0, lineHeight: 0,
                    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.1 2.25h6.3l4.255 5.643L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                  </svg>
                </button>

                {/* WhatsApp */}
                <button
                  className="share-btn"
                  onClick={handleWhatsAppShare}
                  title="Share on WhatsApp"
                  style={{
                    width: '3rem', height: '3rem',
                    border: '1.5px solid #6B3520', borderRadius: '50%',
                    background: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-accent)', padding: 0, lineHeight: 0,
                    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>

                {/* Instagram */}
                <button
                  className="share-btn"
                  onClick={handleInstagramShare}
                  disabled={isCapturing}
                  title="Share on Instagram"
                  style={{
                    width: '3rem', height: '3rem',
                    border: '1.5px solid #6B3520', borderRadius: '50%',
                    background: 'none', cursor: isCapturing ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-accent)', padding: 0, lineHeight: 0,
                    opacity: isCapturing ? 0.4 : 1,
                    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                  }}
                >
                  <InstagramIcon size={18} />
                </button>
              </motion.div>
            )}

            {/* Stage A: community subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--brand-near-black-muted)',
                textAlign: 'center',
                marginTop: '0.5rem',
                letterSpacing: '0.01em',
              }}
            >
              Thousands set free  tap any word to explore
            </motion.p>

            {/* Compact interactive cloud in a modal-launching row */}
            <WordCloud words={words} newWord={newWord} />

            {/* Stage B: depth nudge / story form */}
            <div style={{ maxWidth: '28rem', margin: '0 auto', width: '100%', paddingLeft: 'clamp(1rem, 5vw, 1.5rem)', paddingRight: 'clamp(1rem, 5vw, 1.5rem)' }}>
              <div style={{ marginTop: '2.5rem' }}>
                <p
                  style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--brand-near-black-muted)',
                    marginBottom: '1.25rem',
                  }}
                >
                  Your testimony in details would shift someone's life
                </p>

                <textarea
                  value={testimonyText}
                  onChange={(e) => setTestimonyText(e.target.value)}
                  placeholder="Tell your story in your own words..."
                  maxLength={1000}
                  rows={5}
                  style={{
                    width: '100%',
                    resize: 'vertical',
                    background: '#FFFFFF',
                    border: '1.5px solid var(--brand-ivory-deeper)',
                    borderRadius: '0.5rem',
                    padding: '0.875rem 1rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--brand-near-black)',
                    lineHeight: 1.6,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => ((e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--brand-sienna-light)')}
                  onBlur={(e)  => ((e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--brand-ivory-deeper)')}
                />
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--brand-near-black-muted)',
                    textAlign: 'right',
                    marginTop: '0.25rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  {testimonyText.length}/1000
                </p>

                {/* Category picker  optional, shown once typing starts */}
                <AnimatePresence>
                  {testimonyText.length > 0 && (
                    <motion.div
                      key="category-picker"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden', marginBottom: '1rem' }}
                    >
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        color: 'var(--brand-near-black-muted)',
                        marginBottom: '0.5rem',
                      }}>
                        Tag it (optional)
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {CATEGORIES.map((cat) => {
                          const active = category === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setCategory(active ? '' : cat)}
                              style={{
                                padding: '0.3rem 0.75rem',
                                borderRadius: '999px',
                                border: `1.5px solid ${active ? 'var(--brand-sienna)' : 'var(--brand-ivory-deeper)'}`,
                                background: active ? 'var(--brand-sienna)' : 'transparent',
                                color: active ? '#fff' : 'var(--brand-near-black)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.78rem',
                                fontWeight: active ? 600 : 400,
                                cursor: 'pointer',
                                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                              }}
                            >
                              {CATEGORY_LABELS[cat]}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleDepthSubmit}
                  disabled={!testimonyText.trim()}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: testimonyText.trim() ? 'var(--brand-sienna)' : 'var(--brand-ivory-deeper)',
                    color: testimonyText.trim() ? '#fff' : 'var(--brand-near-black-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: testimonyText.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background 0.15s, opacity 0.15s',
                    opacity: testimonyText.trim() ? 1 : 0.5,
                  }}
                >
                  Share testimony
                </button>
              </div>
            </div>

          </motion.section>
        )}

      </AnimatePresence>

      {/* Off-screen share card for html2canvas capture */}
      {step === 'cloud' && newWord && (
        <ShareCard
          ref={shareCardRef}
          word={newWord}
          cloudWords={cloudWords}
        />
      )}
    </div>
  );
}

// Loading dots

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            width: '0.55rem',
            height: '0.55rem',
            borderRadius: '50%',
            background: 'var(--brand-sienna-light)',
            display: 'block',
          }}
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.15, 0.85] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Inline icons

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1v8M4 6l3 3 3-3M2 11h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M0.5 0.5L5.3 5.9M5.3 5.9L0.5 12.5H4L6.9 8.7M5.3 5.9L12.5 0.5H9L6.9 3.6M6.9 3.6L6.9 5.9M6.9 3.6L9.5 0.5M6.9 5.9L12.5 12.5H9L6.9 8.7M6.9 8.7L4 12.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

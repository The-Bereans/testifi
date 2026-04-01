'use client';

import { motion } from 'framer-motion';

interface AppIntroProps {
  onBegin: () => void;
}

// Each entry: position, which side it enters from, and which icon to render
const LEFT_ICONS: Array<{ top: string; left: string; delay: number; icon: string }> = [
  { top: '8%',  left: '5%',  delay: 0.2,  icon: 'cross' },
  { top: '26%', left: '9%',  delay: 0.35, icon: 'palmleaf' },
  { top: '50%', left: '3%',  delay: 0.5,  icon: 'crownofthorns' },
  { top: '70%', left: '8%',  delay: 0.3,  icon: 'dove' },
  { top: '87%', left: '5%',  delay: 0.45, icon: 'anchor' },
];

const RIGHT_ICONS: Array<{ top: string; right: string; delay: number; icon: string }> = [
  { top: '11%', right: '6%', delay: 0.25, icon: 'chalice' },
  { top: '30%', right: '4%', delay: 0.4,  icon: 'sacredheart' },
  { top: '53%', right: '7%', delay: 0.55, icon: 'flame' },
  { top: '72%', right: '4%', delay: 0.32, icon: 'crown' },
  { top: '88%', right: '7%', delay: 0.48, icon: 'fish' },
];

function IconSVG({ name }: { name: string }) {
  const style = { width: 28, height: 28, color: 'rgba(245,240,232,0.18)', display: 'block' };

  switch (name) {
    case 'cross':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M5.25 8.625H18.75M12 21V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'bible':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M12 6.5L12 12.5M10 8.5H14M6.5 21H18.5C19.3284 21 20 20.3284 20 19.5V4.5C20 3.67157 19.3284 3 18.5 3H6.5C5.11929 3 4 4.11929 4 5.5V18.5M6.5 21C5.11929 21 4 19.8807 4 18.5M6.5 21C6.1717 21 5.84661 20.9353 5.54329 20.8097C5.23998 20.6841 4.96438 20.4999 4.73223 20.2678C4.50009 20.0356 4.31594 19.76 4.1903 19.4567C4.06466 19.1534 4 18.8283 4 18.5M4 18.5C4 18.1717 4.06466 17.8466 4.1903 17.5433C4.31594 17.24 4.50009 16.9644 4.73223 16.7322C4.96438 16.5001 5.23998 16.3159 5.54329 16.1903C5.84661 16.0647 6.1717 16 6.5 16L20 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'crownofthorns':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M19.2724 12C19.2724 16.0164 16.0164 19.2724 12 19.2724M19.2724 12C19.2724 7.98357 16.0164 4.7276 12 4.7276M19.2724 12L21.3502 12M12 19.2724C7.98357 19.2724 4.7276 16.0164 4.7276 12M12 19.2724L12 21.3503M4.7276 12C4.7276 7.98357 7.98357 4.7276 12 4.7276M4.7276 12L2.64978 12M12 4.7276L12 2.64978M15.1168 8.93216L19.3213 4.72761M4.7276 19.3213L8.93214 15.1168M8.93216 8.93216L4.72761 4.72761M19.3213 19.3213L15.1167 15.1168" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M8.61881 21.0548H15.4236M20.2752 13.2503L16.6809 20.2146M3.72476 13.2503L7.31901 20.2146M18.8011 11.8941L15.6757 14.0044M5.1988 11.8941L8.32422 14.0044M12 7.22501L11.9787 2.94513M9.92624 4.69901L14.0658 4.67582M16.7211 20.133C16.5879 20.4326 16.3634 20.6823 16.0795 20.8464C15.7957 21.0105 15.4673 21.0805 15.1412 21.0464M7.27885 20.133C7.41201 20.4326 7.63659 20.6823 7.9204 20.8464C8.20421 21.0105 8.53268 21.0805 8.85872 21.0464M20.2835 13.2345C20.4028 13.0319 20.4485 12.7943 20.4127 12.5619C20.3769 12.3295 20.2619 12.1167 20.0872 11.9594C19.9124 11.802 19.6887 11.71 19.4538 11.6987C19.219 11.6875 18.9874 11.7577 18.7985 11.8976M3.71991 13.2403C3.59892 13.038 3.55178 12.8 3.5865 12.5669C3.62122 12.3337 3.73566 12.1198 3.91035 11.9615C4.08503 11.8033 4.30917 11.7104 4.5446 11.6988C4.78004 11.6872 5.01223 11.7575 5.20166 11.8978M14.0877 13.6257C12.7208 11.3028 12 8.6566 12 5.96137C12 8.6566 11.2792 11.3028 9.91223 13.6257M14.0696 13.5901C14.1447 13.7257 14.2467 13.8447 14.3692 13.9396C14.4918 14.0346 14.6324 14.1036 14.7825 14.1424C14.9326 14.1813 15.089 14.1892 15.2423 14.1657C15.3955 14.1422 15.5424 14.0877 15.6739 14.0056M9.93038 13.5901C9.85524 13.7257 9.75329 13.8447 9.63072 13.9396C9.50816 14.0346 9.36755 14.1036 9.21745 14.1424C9.06736 14.1813 8.91092 14.1892 8.75767 14.1657C8.60442 14.1422 8.45757 14.0877 8.32605 14.0056" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M16.0906 3.81891C19.3323 3.81891 21.2038 6.3755 21.2038 9.70931C21.2038 15.4668 12.1636 20.1811 12 20.1811C11.8364 20.1811 2.79626 15.4668 2.79626 9.70931C2.79626 6.3755 4.66769 3.81891 7.90946 3.81891C9.77066 3.81891 11.2944 5.55739 12 6.3755C12.7056 5.55739 14.2294 3.81891 16.0906 3.81891Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'sacredheart':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
          <path d="M12 12.994L11.448 13.5018C11.5901 13.6561 11.7902 13.744 12 13.744C12.2097 13.744 12.4099 13.6561 12.5519 13.5018L12 12.994ZM14.4328 7.31216C14.5153 6.90624 14.2531 6.51032 13.8472 6.42785C13.4412 6.34538 13.0453 6.60759 12.9629 7.01351L14.4328 7.31216ZM11.0524 7.02158C10.9665 6.61637 10.5684 6.35751 10.1631 6.4434C9.75794 6.52929 9.49908 6.9274 9.58497 7.33261L11.0524 7.02158ZM12.4653 2.12699C12.1395 1.87121 11.6681 1.92798 11.4123 2.25379C11.1565 2.5796 11.2133 3.05107 11.5391 3.30685L12.4653 2.12699ZM12.9624 7.02998C12.8903 7.43787 13.1625 7.82698 13.5704 7.89908C13.9783 7.97117 14.3674 7.69896 14.4395 7.29107L12.9624 7.02998ZM12.4704 3.31003C12.7959 3.05382 12.852 2.58228 12.5958 2.25681C12.3396 1.93135 11.8681 1.8752 11.5426 2.13142L12.4704 3.31003ZM9.58162 7.33279C9.65693 7.74009 10.0482 8.00923 10.4555 7.93392C10.8628 7.85861 11.1319 7.46737 11.0566 7.06006L9.58162 7.33279ZM14.8679 10.9811V11.7311C15.7549 11.7311 16.3647 12.0503 16.7657 12.5296C17.1813 13.0263 17.4312 13.7677 17.4312 14.6898H18.1812H18.9312C18.9312 13.513 18.613 12.3999 17.9162 11.5671C17.2048 10.7168 16.158 10.2311 14.8679 10.2311V10.9811ZM18.1812 14.6898H17.4312C17.4312 15.3835 17.1398 16.0966 16.6235 16.8093C16.1085 17.5201 15.4046 18.1817 14.6704 18.7546C13.9396 19.3248 13.2018 19.7897 12.6394 20.1119C12.3587 20.2727 12.125 20.396 11.9618 20.4776C11.8796 20.5187 11.8188 20.5475 11.7809 20.5644C11.761 20.5734 11.7535 20.5763 11.7553 20.5756C11.7553 20.5756 11.7666 20.5711 11.7845 20.5655C11.7932 20.5627 11.8119 20.5571 11.8365 20.5514C11.8505 20.5482 11.915 20.5331 12 20.5331V21.2831V22.0331C12.0867 22.0331 12.1537 22.0176 12.1708 22.0137C12.1986 22.0073 12.2211 22.0006 12.2344 21.9964C12.2615 21.9879 12.2847 21.9791 12.2995 21.9734C12.3307 21.9612 12.3635 21.9471 12.3941 21.9333C12.4572 21.9051 12.5381 21.8665 12.6325 21.8193C12.8223 21.7244 13.081 21.5876 13.385 21.4135C13.9918 21.0658 14.7924 20.562 15.5932 19.9371C16.3906 19.3149 17.2113 18.5546 17.8382 17.6893C18.4637 16.826 18.9312 15.8087 18.9312 14.6898H18.1812ZM12 21.2831V20.5331C12.0849 20.5331 12.1495 20.5482 12.1634 20.5514C12.1881 20.5571 12.2067 20.5627 12.2155 20.5655C12.2334 20.5711 12.2447 20.5756 12.2447 20.5756C12.2465 20.5763 12.239 20.5734 12.2191 20.5644C12.1812 20.5475 12.1204 20.5187 12.0382 20.4776C11.875 20.396 11.6413 20.2727 11.3606 20.1119C10.7982 19.7897 10.0604 19.3248 9.32959 18.7546C8.59542 18.1817 7.89145 17.5201 7.37651 16.8093C6.86017 16.0966 6.56879 15.3835 6.56879 14.6898H5.81879H5.06879C5.06879 15.8087 5.53632 16.826 6.16178 17.6893C6.78864 18.5546 7.60938 19.3149 8.40677 19.9371C9.20757 20.562 10.0082 21.0658 10.615 21.4135C10.919 21.5876 11.1777 21.7244 11.3675 21.8193C11.4618 21.8665 11.5427 21.9051 11.6058 21.9333C11.6364 21.9471 11.6693 21.9612 11.7005 21.9734C11.7152 21.9791 11.7385 21.9879 11.7656 21.9964C11.7789 22.0006 11.8014 22.0073 11.8292 22.0137C11.8463 22.0176 11.9133 22.0331 12 22.0331V21.2831ZM5.81879 14.6898H6.56879C6.56879 13.7678 6.81886 13.0265 7.2347 12.5297C7.63603 12.0503 8.2462 11.7311 9.13327 11.7311V10.9811V10.2311C7.84317 10.2311 6.79611 10.7168 6.08448 11.5669C5.38738 12.3997 5.06879 13.5128 5.06879 14.6898H5.81879ZM9.13327 10.9811V11.7311C9.47407 11.7311 9.89474 11.9481 10.3636 12.3586C10.8245 12.7622 11.1656 13.1947 11.448 13.5018L12 12.994L12.5519 12.4862C12.3605 12.2781 11.8933 11.7042 11.3517 11.2301C10.8182 10.763 10.0424 10.2311 9.13327 10.2311V10.9811ZM12 12.994L12.5519 13.5018C12.8341 13.1951 13.1758 12.7622 13.6368 12.3588C14.106 11.9482 14.527 11.7311 14.8679 11.7311V10.9811V10.2311C13.9588 10.2311 13.1828 10.7629 12.649 11.23C12.107 11.7042 11.6398 12.2778 11.448 12.4862L12 12.994ZM13.6978 7.16284L12.9629 7.01351C12.9182 7.23335 12.7991 7.43107 12.6258 7.57339L13.1016 8.15312L13.5774 8.73285C14.0174 8.37171 14.3195 7.86998 14.4328 7.31216L13.6978 7.16284ZM13.1016 8.15312L12.6258 7.57339C12.4524 7.71571 12.2352 7.79394 12.0109 7.79488L12.0141 8.54488L12.0172 9.29487C12.5864 9.29247 13.1374 9.09398 13.5774 8.73285L13.1016 8.15312ZM12.0141 8.54488L12.0109 7.79488C11.7866 7.79583 11.5688 7.71944 11.3942 7.57859L10.9233 8.16231L10.4523 8.74603C10.8954 9.10344 11.448 9.29727 12.0172 9.29487L12.0141 8.54488ZM10.9233 8.16231L11.3942 7.57859C11.2196 7.43774 11.0989 7.24102 11.0524 7.02158L10.3187 7.1771L9.58497 7.33261C9.703 7.88946 10.0093 8.38862 10.4523 8.74603L10.9233 8.16231ZM12.0022 2.71692L11.5391 3.30685C12.0913 3.74035 12.5153 4.31569 12.766 4.97142L13.4666 4.70361L14.1671 4.4358C13.8194 3.52628 13.2312 2.72827 12.4653 2.12699L12.0022 2.71692ZM13.4666 4.70361L12.766 4.97142C13.0167 5.62716 13.0846 6.33868 12.9624 7.02998L13.7009 7.16053L14.4395 7.29107C14.609 6.33221 14.5148 5.34533 14.1671 4.4358L13.4666 4.70361ZM12.0065 2.72072L11.5426 2.13142C10.7728 2.73741 10.1832 3.54225 9.83763 4.45896L10.5394 4.72354L11.2412 4.98812C11.4904 4.3272 11.9154 3.74694 12.4704 3.31003L12.0065 2.72072ZM10.5394 4.72354L9.83763 4.45896C9.49202 5.37568 9.40349 6.36941 9.58162 7.33279L10.3191 7.19642L11.0566 7.06006C10.9282 6.3655 10.992 5.64905 11.2412 4.98812L10.5394 4.72354Z" />
        </svg>
      );
    case 'palmleaf':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M4 20C8 15 14 9 20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 17C5 15 4 13 6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 14C13 12 15 13 14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 10C12 8 12 6 14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 7C19 5 20 7 18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'chalice':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M5 5H19M6 5C4 10 5 14 9 15M18 5C20 10 19 14 15 15M9 15C10 17 14 17 15 15M12 17V20M7 20H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'nail':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M9 3H15V7L13 7L12 21L11 7H9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'dove':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M4 10L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 11C6 9 8 7 11 8C16 9 20 11 19 15C18 19 13 18 10 17C7 16 6 14 7 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 10C10 5 18 4 18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 14L22 12M19 15L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'flame':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M12 2C8 5 6 10 7 14C8 18 10 21 12 21C14 21 16 18 17 14C18 10 16 5 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 21V23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'risingsun':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M2 16H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 16A7 7 0 0 1 19 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 9V4M8 10L6 6M6 13L3 11M16 10L18 6M18 13L21 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'fish':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M6 12C6 8 10 7 15 12C10 17 6 16 6 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 12L19 9M15 12L19 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'anchor':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M10 4C10 2 14 2 14 4C14 6 10 6 10 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 6V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 9H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 20C8 20 5 18 5 15M12 20C16 20 19 18 19 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'brokenchain':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={style}>
          <path d="M2 14C2 11 5 8 8 9C11 10 13 12 13 15C13 18 10 20 7 19C4 18 2 17 2 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12C12 9 14 7 17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 7C22 8 23 11 22 14C21 17 19 18 16 18C13 18 12 16 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
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

      {/* Left-side icons — fade in from the left */}
      {LEFT_ICONS.map((item, i) => (
        <motion.div
          key={`left-${i}`}
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: item.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            pointerEvents: 'none',
          }}
        >
          <IconSVG name={item.icon} />
        </motion.div>
      ))}

      {/* Right-side icons — fade in from the right */}
      {RIGHT_ICONS.map((item, i) => (
        <motion.div
          key={`right-${i}`}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: item.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            top: item.top,
            right: item.right,
            pointerEvents: 'none',
          }}
        >
          <IconSVG name={item.icon} />
        </motion.div>
      ))}

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

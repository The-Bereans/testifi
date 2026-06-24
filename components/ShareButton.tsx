'use client';

interface ShareButtonProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  size?: 'sm' | 'lg';
  children: React.ReactNode;
}

export default function ShareButton({
  onClick,
  title,
  disabled = false,
  size = 'sm',
  children,
}: ShareButtonProps) {
  const dim = size === 'lg' ? '3rem' : '2rem';

  return (
    <button
      className="share-btn"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? 'Saving\u2026' : title}
      style={{
        width: dim,
        height: dim,
        border: '1.5px solid #6B3520',
        borderRadius: '50%',
        background: 'var(--brand-ivory)',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-accent)',
        padding: 0,
        lineHeight: 0,
        opacity: disabled ? 0.4 : 1,
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
      }}
    >
      {children}
    </button>
  );
}

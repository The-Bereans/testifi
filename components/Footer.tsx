import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--brand-near-black-muted, rgba(0,0,0,0.08))',
        padding: '1.5rem 1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem 1.5rem',
        fontSize: '0.8rem',
        color: 'var(--brand-near-black-muted, #6b7280)',
        letterSpacing: '0.02em',
      }}
    >
      <span>&copy; {year} Testifi</span>

      <a
        href="https://twitter.com/testifi"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'none' }}
        aria-label="Testifi on X (Twitter)"
      >
        @testifi
      </a>

      <Link
        href="/privacy"
        style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}
      >
        Privacy Policy
      </Link>
    </footer>
  );
}

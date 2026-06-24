import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Testifi collects, uses, and protects your information.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: '2.5rem' }}>
    <h2
      style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        marginBottom: '0.75rem',
        color: 'var(--brand-near-black, #111)',
      }}
    >
      {title}
    </h2>
    <div style={{ lineHeight: 1.7, color: 'var(--brand-near-black-muted, #374151)' }}>
      {children}
    </div>
  </section>
);

export default function PrivacyPage() {
  return (
    <main
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: 'clamp(2rem, 6vw, 4rem) 1.25rem',
        fontFamily: 'var(--font-jakarta, sans-serif)',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'inline-block',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          color: 'var(--brand-near-black-muted, #6b7280)',
          textDecoration: 'none',
        }}
      >
        ← Back to Testifi
      </Link>

      <h1
        style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: 'var(--brand-near-black, #111)',
        }}
      >
        Privacy Policy
      </h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--brand-near-black-muted, #6b7280)', marginBottom: '2.5rem' }}>
        Last updated: April 7, 2026
      </p>

      <Section title="1. What we collect">
        <p>
          When you join our waitlist we collect only your <strong>email address</strong>. We do not
          ask for your name, phone number, or any other personal information at this stage.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          When you visit the site, our hosting provider (Vercel) may log standard server data such
          as your IP address, browser type, and the pages you visit. We do not store or process
          this data ourselves.
        </p>
      </Section>

      <Section title="2. Why we collect it">
        <p>
          Your email address is used for one purpose: to notify you when Testifi launches and to
          send occasional product updates you signed up to receive. We will not email you for any
          other reason without your explicit consent.
        </p>
      </Section>

      <Section title="3. Who we share it with">
        <p>
          We do not sell, rent, or trade your email address to anyone. We use{' '}
          <strong>a secure database</strong> to store waitlist data. Beyond that, your email is
          not shared with any third-party marketing, advertising, or analytics services.
        </p>
      </Section>

      <Section title="4. How we store and protect it">
        <p>
          Your email is stored in a password-protected database that encrypts data at rest and in transit. Access is limited to the Testifi founding team. We retain
          your email only as long as needed to fulfil the purpose above; once Testifi launches and
          onboarding is complete, waitlist-only records will be deleted or migrated to your account
          (with your consent).
        </p>
      </Section>

      <Section title="5. Your rights">
        <p>
          You can ask us to view, correct, or delete your data at any time. Just reach out{' '}
          <a
            href="mailto:thebereanjesusapp@gmail.com"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            via mail
          </a>{' '}
          and we will respond within 7 days. If you are in the EU or UK, you also have the right to
          lodge a complaint with your local data-protection authority.
        </p>
      </Section>

      <Section title="6. Changes to this policy">
        <p>
          If we make material changes to how we handle your data, we will update the date at the
          top of this page and, where appropriate, notify you by email. Continued use of the
          waitlist after changes are posted means you accept the updated policy.
        </p>
      </Section>

      <p
        style={{
          marginTop: '3rem',
          fontSize: '0.8rem',
          color: 'var(--brand-near-black-muted, #9ca3af)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          paddingTop: '1.5rem',
        }}
      >
        Questions? Reach us at{' '}
        <a href="mailto:thebereanjesusapp@gmail.com" style={{ color: 'inherit', textDecoration: 'underline' }}>
          via mail
        </a>
      </p>
    </main>
  );
}

import { z } from 'zod';
import { TESTIMONY_TYPES } from '@/lib/testimonyTypes';

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  'addiction',
  'anxiety',
  'depression',
  'anger',
  'shame',
  'identity',
  'relationships',
  'sexual sin',
  'mental health',
  'other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  addiction:       'Addiction',
  anxiety:         'Anxiety & Fear',
  depression:      'Depression & Grief',
  anger:           'Anger & Bitterness',
  shame:           'Shame & Guilt',
  identity:        'Identity & Self-Worth',
  relationships:   'Loneliness & Rejection',
  'sexual sin':    'Sexual Sin',
  'mental health': 'Mental Health',
  other:           'Other',
};

// ─── Submission (word + optional testimony) ───────────────────────────────────

export const submissionSchema = z.object({
  /** Testimony content — a keyword or a full story (1–2000 chars, no HTML) */
  word: z
    .string()
    .trim()
    .min(1, 'Word is required.')
    .max(2000, 'Testimony must be 2000 characters or fewer.')
    .refine(
      (v) =>
        !/<|>|&lt;|&gt;|javascript:|data:|vbscript:|on\w+\s*=|<script|<svg|<img|<iframe|<object|<embed/i.test(v),
      { message: 'Invalid characters in word.' }
    ),

  /** User explicitly consented to share their story publicly */
  consented: z.boolean().optional().default(false),

  /** Optional category tag for what the user was saved from */
  category: z.enum(CATEGORIES).optional(),

  /** Type of testimony — drives card label, suffix, and share text */
  testimonyType: z.enum(TESTIMONY_TYPES).optional().default('salvation'),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .max(254, 'Email address is too long.'),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

// ─── Testimony (API response shape) ──────────────────────────────────────────

export const TestimonySchema = z.object({
  id: z.string().uuid(),
  word: z.string(),

  category: z.string().nullable(),
  excerpt: z.string().nullable(),
  testimony_type: z.string().default('salvation'),
  created_at: z.string(),
});

export type Testimony = z.infer<typeof TestimonySchema>;

export const TestimoniesResponseSchema = z.object({
  data: z.array(TestimonySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
});

export type TestimoniesResponse = z.infer<typeof TestimoniesResponseSchema>;

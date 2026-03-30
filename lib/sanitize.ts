import { z } from 'zod';

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
  /** The canonical word from the normalizer (1–80 chars, no HTML) */
  word: z
    .string()
    .trim()
    .min(1, 'Word is required.')
    .max(80, 'Word is too long.')
    .refine((v) => !/<|>|&lt;|&gt;|javascript:/i.test(v), {
      message: 'Invalid characters in word.',
    }),

  /** Optional full testimony text */
  body: z
    .string()
    .trim()
    .max(1000, 'Story must be 1000 characters or fewer.')
    .optional(),

  /** User explicitly consented to share their story publicly */
  consented: z.boolean().optional().default(false),

  /** Optional category tag for what the user was saved from */
  category: z.enum(CATEGORIES).optional(),
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
  body: z.string().nullable(),
  category: z.string().nullable(),
  excerpt: z.string().nullable(),
  created_at: z.string(),
});

export type Testimony = z.infer<typeof TestimonySchema>;

export const TestimoniesResponseSchema = z.object({
  data: z.array(TestimonySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
});

export type TestimoniesResponse = z.infer<typeof TestimoniesResponseSchema>;

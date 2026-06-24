import { z } from "zod";

export const submissionSchema = z.object({
  title: z
    .string()
    .trim()
    .max(120, "Title cannot exceed 120 characters.")
    .optional(),

  body: z
    .string()
    .trim()
    .min(20, "Please share a little more of your testimony.")
    .max(10000, "Testimony is too long.")
    .refine(
      (v) =>
        !/javascript:|data:|vbscript:|on\w+\s*=|<\/?(script|svg|img|iframe|object|embed)/i.test(
          v
        ),
      {
        message: "Invalid content detected.",
      }
    ),

  categoryId: z.string().uuid().optional(),

  consented: z.boolean().optional().default(false),

  isIdentityHidden: z.boolean().optional().default(false),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email address is too long."),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface TestimonyData {
  id: string;
  title: string | null;
  body: string;
  excerpt: string | null;
  status: string;
  is_identity_hidden: boolean;
  consented: boolean;
  created_at: string | null;
  published_at: string | null;
  categories: CategoryData | null;
  user_id: string | null;
}

export interface TestimoniesResponse {
  data: TestimonyData[];
  total: number;
  page: number;
}

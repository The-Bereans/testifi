// ─── Testimony Types ──────────────────────────────────────────────────────────

export const TESTIMONY_TYPES = [
  'salvation',
  'healing',
  'deliverance',
  'provision',
  'restoration',
  'freedom',
  'other',
] as const;

export type TestimonyType = (typeof TESTIMONY_TYPES)[number];

export interface TestimonyTypeConfig {
  /** Card header text, e.g. "Jesus Saved Me From" */
  label: string;
  /** Preposition used between label and word, e.g. "from" | "my" | "" */
  preposition: string;
  /** Card bottom tagline */
  suffix: string;
  /** Past-tense verb for WhatsApp / share messages */
  whatsappVerb: string;
}

export const TESTIMONY_TYPE_CONFIG: Record<TestimonyType, TestimonyTypeConfig> = {
  salvation:   { label: 'Jesus Saved Me From',     preposition: 'from', suffix: 'Jesus can save you too',     whatsappVerb: 'saved'     },
  healing:     { label: 'Jesus Healed Me From',    preposition: 'from', suffix: 'Jesus can heal you too',     whatsappVerb: 'healed'    },
  deliverance: { label: 'Jesus Delivered Me From', preposition: 'from', suffix: 'Jesus can deliver you too',  whatsappVerb: 'delivered' },
  provision:   { label: 'Jesus Provided',           preposition: '',     suffix: 'Jesus can provide for you',  whatsappVerb: 'provided'  },
  restoration: { label: 'Jesus Restored My',       preposition: 'my',   suffix: 'Jesus can restore you too',  whatsappVerb: 'restored'  },
  freedom:     { label: 'Jesus Freed Me From',     preposition: 'from', suffix: 'Jesus can free you too',     whatsappVerb: 'freed'     },
  other:       { label: 'Jesus Did This For Me',   preposition: '',     suffix: 'He can do it for you too',   whatsappVerb: 'did this'  },
};

export const TESTIMONY_TYPE_LABELS: Record<TestimonyType, string> = {
  salvation:   'Salvation',
  healing:     'Healing',
  deliverance: 'Deliverance',
  provision:   'Provision',
  restoration: 'Restoration',
  freedom:     'Freedom',
  other:       'Other',
};

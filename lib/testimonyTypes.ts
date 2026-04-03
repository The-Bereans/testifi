// ─── Testimony Types ──────────────────────────────────────────────────────────

import { abbreviate } from '@/lib/abbreviate';

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
  /** Build the WhatsApp share message for this testimony type */
  buildWhatsAppMessage: (word: string, excerpt: string | null, url: string) => string;
}

export const TESTIMONY_TYPE_CONFIG: Record<TestimonyType, TestimonyTypeConfig> = {
  salvation: {
    label: 'This is my testimony', preposition: 'from',
    suffix: 'Jesus can save you too', whatsappVerb: 'saved',
    buildWhatsAppMessage: (word, excerpt, url) => {
      const q = excerpt ? `\n\n"${abbreviate(excerpt, 160)}"` : '';
      return `Heyyyy I have something to share with you. ${word}. God can save you too.${q}\n\n${url}`;
    },
  },
  healing: {
    label: 'Jesus healed me from', preposition: 'from',
    suffix: 'Jesus can heal you too', whatsappVerb: 'healed',
    buildWhatsAppMessage: (word, excerpt, url) => {
      const q = excerpt ? `\n\n"${abbreviate(excerpt, 160)}"` : '';
      return `Hey I have something to share with you. ${word}. God can heal you too.${q}\n\n${url}`;
    },
  },
  deliverance: {
    label: 'Jesus delivered me', preposition: 'from',
    suffix: 'Jesus can deliver you too', whatsappVerb: 'delivered',
    buildWhatsAppMessage: (word, excerpt, url) => {
      const q = excerpt ? `\n\n"${abbreviate(excerpt, 160)}"` : '';
      return `Heyyyy I have something to share with you. ${word}. He can deliver you too.${q}\n\n${url}`;
    },
  },
  provision: {
    label: 'God came through', preposition: '',
    suffix: 'Jesus can provide for you', whatsappVerb: 'provided',
    buildWhatsAppMessage: (word, excerpt, url) => {
      const q = excerpt ? `\n\n"${abbreviate(excerpt, 160)}"` : '';
      return `Heyyyy I have something to share with you. ${word} for me. He can do the same for you.${q}\n\n${url}`;
    },
  },
  restoration: {
    label: 'Jesus restored my', preposition: 'my',
    suffix: 'Jesus can restore you too', whatsappVerb: 'restored',
    buildWhatsAppMessage: (word, excerpt, url) => {
      const q = excerpt ? `\n\n"${abbreviate(excerpt, 160)}"` : '';
      return `Heyyyy I have something to share with you. ${word}. He can restore you too.${q}\n\n${url}`;
    },
  },
  freedom: {
    label: 'Jesus freed me from', preposition: 'from',
    suffix: 'Jesus can free you too', whatsappVerb: 'freed',
    buildWhatsAppMessage: (word, excerpt, url) => {
      const q = excerpt ? `\n\n"${abbreviate(excerpt, 160)}"` : '';
      return `Heyyyy I have something to share with you. ${word}. He can free you too.${q}\n\n${url}`;
    },
  },
  other: {
    label: 'Jesus did this for me', preposition: '',
    suffix: 'He can do it for you too', whatsappVerb: 'did this',
    buildWhatsAppMessage: (word, excerpt, url) => {
      const q = excerpt ? `\n\n"${abbreviate(excerpt, 160)}"` : '';
      return `Heyyyyy I have something to share with you.  ${word}. He can do it for you too.${q}\n\n${url}`;
    },
  },
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

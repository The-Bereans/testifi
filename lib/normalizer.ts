// Normalization map — ~100 entries.
// Rule: only collapse truly identical meanings; preserve specific struggles; no abstraction.

const normalizationMap: Record<string, string> = {
  // ── Anxiety / worry ───────────────────────────────────────────────────────
  anxious:        'anxiety',
  anxiety:        'anxiety',
  worried:        'worry',
  worrying:       'worry',
  worry:          'worry',
  nervousness:    'anxiety',
  nervous:        'anxiety',
  panic:          'panic attacks',
  panicking:      'panic attacks',
  'panic attack': 'panic attacks',
  'panic attacks':'panic attacks',

  // ── Fear ─────────────────────────────────────────────────────────────────
  afraid:         'fear',
  scared:         'fear',
  fear:           'fear',
  terrified:      'fear',
  paranoid:       'paranoia',
  paranoia:       'paranoia',
  phobia:         'fear',

  // ── Depression / sadness ──────────────────────────────────────────────────
  depressed:      'depression',
  depression:     'depression',
  sad:            'sadness',
  sadness:        'sadness',
  grief:          'grief',
  grieving:       'grief',
  mourning:       'grief',
  sorrow:         'grief',
  despair:        'despair',
  despairing:     'despair',
  hopeless:       'hopelessness',
  hopelessness:   'hopelessness',

  // ── Anger ─────────────────────────────────────────────────────────────────
  angry:          'anger',
  anger:          'anger',
  rage:           'rage',
  furious:        'rage',
  wrath:          'wrath',
  bitterness:     'bitterness',
  bitter:         'bitterness',
  resentment:     'resentment',
  resentful:      'resentment',

  // ── Shame / guilt ─────────────────────────────────────────────────────────
  ashamed:        'shame',
  shame:          'shame',
  embarrassed:    'shame',
  embarrassment:  'shame',
  guilty:         'guilt',
  guilt:          'guilt',
  regret:         'regret',
  remorse:        'remorse',

  // ── Inner identity ────────────────────────────────────────────────────────
  insecure:       'insecurity',
  insecurity:     'insecurity',
  proud:          'pride',
  pride:          'pride',
  arrogance:      'pride',
  arrogant:       'pride',
  'low self-esteem':  'low self-esteem',
  'self-hatred':  'self-hatred',
  'self-hate':    'self-hatred',
  'self-loathing':'self-hatred',
  worthless:      'worthlessness',
  worthlessness:  'worthlessness',
  'self-doubt':   'self-doubt',
  doubt:          'self-doubt',

  // ── Relational ───────────────────────────────────────────────────────────
  lonely:         'loneliness',
  loneliness:     'loneliness',
  isolated:       'isolation',
  isolation:      'isolation',
  rejected:       'rejection',
  rejection:      'rejection',
  abandoned:      'abandonment',
  abandonment:    'abandonment',
  betrayed:       'betrayal',
  betrayal:       'betrayal',
  unforgiveness:  'unforgiveness',
  unforgiving:    'unforgiveness',
  unforgiven:     'unforgiveness',
  brokenhearted:  'heartbreak',
  heartbreak:     'heartbreak',
  'heart break':  'heartbreak',

  // ── Sexual ───────────────────────────────────────────────────────────────
  porn:           'pornography',
  pornography:    'pornography',
  masturbation:   'masturbation',
  lust:           'lust',
  'sexual immorality': 'sexual immorality',
  fornication:    'sexual immorality',
  adultery:       'adultery',
  cheating:       'infidelity',
  infidelity:     'infidelity',

  // ── Substances ───────────────────────────────────────────────────────────
  alcohol:        'alcohol',
  alcoholism:     'alcohol',
  drinking:       'alcohol',
  weed:           'weed',
  marijuana:      'weed',
  cannabis:       'weed',
  drugs:          'drugs',
  'drug addiction':'drugs',
  cocaine:        'cocaine',
  heroin:         'heroin',
  smoking:        'smoking',
  cigarettes:     'smoking',
  nicotine:       'nicotine',
  gambling:       'gambling',

  // ── Mental health ────────────────────────────────────────────────────────
  'suicidal thoughts': 'suicidal thoughts',
  suicide:        'suicidal thoughts',
  suicidal:       'suicidal thoughts',
  'self-harm':    'self-harm',
  'self harm':    'self-harm',
  'cutting':      'self-harm',
  'eating disorder': 'eating disorder',
  anorexia:       'eating disorder',
  bulimia:        'eating disorder',
  'ocd':          'OCD',
  'obsessive thoughts': 'OCD',
  trauma:         'trauma',
  ptsd:           'trauma',
  abuse:          'abuse',
  'abuse trauma': 'abuse',

  // ── Pain / brokenness ────────────────────────────────────────────────────
  hurt:           'pain',
  pain:           'pain',
  broken:         'brokenness',
  brokenness:     'brokenness',
  lost:           'being lost',
  'being lost':   'being lost',
  emptiness:      'emptiness',
  empty:          'emptiness',
  confusion:      'confusion',
  confused:       'confusion',

  // ── Control / behaviour ──────────────────────────────────────────────────
  control:        'control',
  controlling:    'control',
  'people-pleasing':  'people-pleasing',
  'people pleasing':  'people-pleasing',
  perfectionism:  'perfectionism',
  perfectionist:  'perfectionism',
  envy:           'envy',
  jealousy:       'jealousy',
  jealous:        'jealousy',
  greed:          'greed',
  materialism:    'greed',
  covetousness:   'greed',
  laziness:       'laziness',
  procrastination:'procrastination',
  gluttony:       'gluttony',
  overeating:     'gluttony',
};

const filterSet = new Set([
  'nothing',
  'idk',
  'idc',
  'stuff',
  'things',
  'everything',
  'life',
  'omo',
  'ehn',
  'omoo',
  'omoooo',
  'ewo',
  'na wa o',
  'na wa',
  'lol',
  'test',
  'testing',
  'hi',
  'hello',
]);

export type NormalizeResult =
  | { type: 'ok'; canonical: string }
  | { type: 'filtered' }
  | { type: 'empty' };

export function normalize(raw: string): NormalizeResult {
  const trimmed = raw.trim();
  if (!trimmed) return { type: 'empty' };
  const lower = trimmed.toLowerCase();
  if (filterSet.has(lower)) return { type: 'filtered' };
  const canonical = normalizationMap[lower] ?? lower;
  return { type: 'ok', canonical };
}

/**
 * Returns the canonical form only when it differs from what the user typed.
 * Used for real-time preview — undefined means no preview needed.
 */
export function getCanonicalPreview(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const lower = trimmed.toLowerCase();
  if (filterSet.has(lower)) return undefined;
  const canonical = normalizationMap[lower];
  return canonical && canonical !== lower ? canonical : undefined;
}

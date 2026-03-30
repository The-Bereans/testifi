export const STOP_WORDS = new Set<string>([
  // Articles
  'a', 'an', 'the',
  // Conjunctions
  'and', 'but', 'or', 'nor', 'so', 'yet', 'for', 'because', 'since', 'while',
  'if', 'when', 'though', 'although', 'unless', 'until', 'after', 'before',
  'once', 'than', 'that', 'whether', 'both', 'either', 'neither',
  // Prepositions
  'of', 'in', 'on', 'at', 'by', 'with', 'from', 'to', 'into', 'onto',
  'through', 'during', 'within', 'without', 'between', 'among', 'against',
  'along', 'around', 'near', 'over', 'under', 'above', 'below', 'off',
  'out', 'up', 'down', 'about', 'per', 'via', 'upon',
  // Pronouns
  'i', 'me', 'my', 'myself', 'mine', 'we', 'us', 'our', 'ours', 'ourselves',
  'you', 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'this', 'that', 'these', 'those', 'who', 'whom', 'whose', 'which', 'what',
  // Auxiliary verbs
  'is', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'doing',
  'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can',
  'could', 'ought', 'used', 'am', 'are', 'got', 'get', 'gets',
  // Fillers / low-signal words
  'just', 'also', 'very', 'really', 'quite', 'lot', 'like', 'even',
  'much', 'more', 'most', 'some', 'many', 'any', 'all', 'own', 'same',
  'such', 'only', 'then', 'now', 'here', 'there', 'where', 'how', 'why',
  'not', 'no', 'yes', 'never', 'ever', 'always', 'often', 'still',
  'too', 'so', 'as', 'well', 'back', 'way', 'come', 'go', 'went', 'came',
  'know', 'knew', 'think', 'thought', 'feel', 'felt', 'make', 'made',
  'take', 'took', 'give', 'gave', 'put', 'say', 'said', 'tell', 'told',
  'see', 'saw', 'want', 'wanted', 'need', 'needed', 'let', 'lets',
  'keep', 'kept', 'show', 'showed', 'ask', 'asked', 'call', 'called',
  'one', 'two', 'first', 'last', 'new', 'old', 'big', 'good', 'great',
  'little', 'long', 'right', 'left', 'next', 'other', 'every', 'each',
]);
/**
 * Returns a human-readable relative timestamp.
 *
 * Rules:
 *   < 60 seconds         → "just now"
 *   < 60 minutes         → "Xm ago"
 *   Same calendar day    → "Xhr ago"  (e.g. "2hr ago")
 *   dayDiff === 1        → "Yesterday"
 *   dayDiff 2–6          → "X days ago"
 *   dayDiff 7–29         → "Xw ago"
 *   dayDiff 30+          → "Xmo ago"
 *
 * Today/Yesterday are resolved by midnight-boundary comparison so a post
 * made at 11 pm the previous calendar day always reads "Yesterday" even if
 * fewer than 24 hours have elapsed.
 */
export function relativeTime(dateStr: string): string {
  const now  = new Date();
  const then = new Date(dateStr);
  const diffSec = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffSec < 60)   return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;

  // Midnight-boundary calendar diff
  const nowDay  = new Date(now.getFullYear(),  now.getMonth(),  now.getDate());
  const thenDay = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  const dayDiff = Math.round((nowDay.getTime() - thenDay.getTime()) / 86_400_000);

  if (dayDiff === 0) return `${Math.floor(diffSec / 3600)}hr ago`;
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7)   return `${dayDiff} days ago`;
  if (dayDiff < 30)  return `${Math.floor(dayDiff / 7)}w ago`;
  return `${Math.floor(dayDiff / 30)}mo ago`;
}
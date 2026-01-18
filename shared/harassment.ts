export type Severity = 'Low' | 'Medium' | 'High';

const HIGH = [
  'rape', 'sexual assault', 'kill you', 'acid attack', 'nudes', 'leak pics',
  'suicide bait', 'slut', 'whore', 'disgusting pics', 'explicit', 'blackmail'
];

const MED = [
  'harass', 'stalk', 'bully', 'insult', 'abuse', 'touch', 'unwanted',
  'offend', 'threat', 'creep', 'pervert'
];

export function detectSeverity(text: string): { severity: Severity; hits: string[] } {
  const s = (text || '').toLowerCase();
  const hitsHigh = HIGH.filter(k => s.includes(k));
  if (hitsHigh.length) return { severity: 'High', hits: hitsHigh };
  const hitsMed = MED.filter(k => s.includes(k));
  if (hitsMed.length) return { severity: 'Medium', hits: hitsMed };
  return { severity: 'Low', hits: [] };
}

export const KEYWORDS = { HIGH, MED };



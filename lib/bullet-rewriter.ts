/**
 * Bullet Rewriter - Rule-based helper to strengthen resume bullets
 */

const WEAK_VERBS = [
  'worked', 'did', 'made', 'helped', 'assisted', 'was responsible for',
  'managed', 'handled', 'used', 'utilized'
]

const STRONG_VERBS: Record<string, string[]> = {
  'worked': ['developed', 'executed', 'delivered', 'produced'],
  'did': ['accomplished', 'achieved', 'completed', 'implemented'],
  'made': ['created', 'designed', 'built', 'established'],
  'helped': ['supported', 'facilitated', 'enabled', 'contributed'],
  'assisted': ['collaborated', 'partnered', 'coordinated'],
  'was responsible for': ['led', 'managed', 'oversaw', 'directed'],
  'managed': ['orchestrated', 'led', 'spearheaded', 'guided'],
  'handled': ['managed', 'coordinated', 'administered', 'supervised'],
  'used': ['leveraged', 'utilized', 'implemented', 'applied'],
  'utilized': ['leveraged', 'employed', 'implemented', 'applied']
}

/**
 * Strengthen a bullet point by replacing weak verbs
 */
export function strengthenBullet(bullet: string): string {
  let strengthened = bullet.trim()
  
  // Check if bullet starts with weak verb
  for (const [weak, strongs] of Object.entries(STRONG_VERBS)) {
    const regex = new RegExp(`^${weak}\\s+`, 'i')
    if (regex.test(strengthened)) {
      // Replace with random strong verb (in real app, could be smarter)
      strengthened = strengthened.replace(regex, `${strongs[0]} `)
      break
    }
  }
  
  // Add metrics if missing (simple check)
  if (!/\d+/.test(strengthened)) {
    // Suggest adding metrics (user would need to fill in)
    // This is just a placeholder - real implementation would be more sophisticated
  }
  
  return strengthened
}

/**
 * Check if bullet is weak and needs strengthening
 */
export function isWeakBullet(bullet: string): boolean {
  const lower = bullet.toLowerCase()
  return WEAK_VERBS.some(verb => lower.startsWith(verb))
}

/**
 * Generate bullet suggestions based on template
 */
export function generateBulletSuggestion(template: string, context: {
  jobTitle?: string
  company?: string
  jobFamily?: string
}): string {
  // In real app, this would use the phrase library more intelligently
  // For now, return a template with placeholders
  return template
    .replace('{metric}', '[metric]')
    .replace('{outcome}', '[outcome]')
    .replace('{impact}', '[impact]')
    .replace('{tool/model}', '[tool]')
    .replace('{action}', '[action]')
    .replace('{percentage}', '[X]%')
    .replace('{amount}', '[$X or X]')
    .replace('{time/money}', '[time or money saved]')
    .replace('{number}', '[number]')
    .replace('{budget}', '[$X budget]')
    .replace('{result}', '[result]')
    .replace('{process}', '[process]')
    .replace('{strategy}', '[strategy]')
    .replace('{deliverable}', '[deliverable]')
    .replace('{insight}', '[insight]')
    .replace('{decision}', '[decision]')
    .replace('{cost/risk}', '[cost or risk]')
}


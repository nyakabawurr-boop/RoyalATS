/**
 * Smart Suggestion Phrase Library
 * Organized by job families for context-aware suggestions
 */

export type JobFamily = 
  | 'data-analytics'
  | 'finance'
  | 'business'
  | 'software'
  | 'ops'
  | 'sales'
  | 'marketing'
  | 'customer-support'
  | 'education'
  | 'healthcare'

export interface PhraseLibrary {
  actionVerbs: string[]
  bulletTemplates: string[]
  atsKeywords: string[]
}

export const PHRASE_LIBRARY: Record<JobFamily, PhraseLibrary> = {
  'data-analytics': {
    actionVerbs: [
      'Analyzed', 'Modeled', 'Visualized', 'Predicted', 'Optimized',
      'Automated', 'Extracted', 'Transformed', 'Validated', 'Forecasted',
      'Correlated', 'Mined', 'Classified', 'Clustered', 'Segmented'
    ],
    bulletTemplates: [
      'Analyzed {metric} data to identify {outcome}, resulting in {impact}',
      'Built {tool/model} that {action}, increasing {metric} by {percentage}%',
      'Developed {system} to {action}, reducing {metric} by {amount}',
      'Created {deliverable} that {outcome}, saving {time/money}',
      'Identified {insight} leading to {action} and {impact}'
    ],
    atsKeywords: [
      'SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Machine Learning',
      'Data Visualization', 'Statistical Analysis', 'ETL', 'Data Warehouse',
      'Big Data', 'Hadoop', 'Spark', 'AWS', 'Azure', 'Google Cloud'
    ]
  },
  'finance': {
    actionVerbs: [
      'Forecasted', 'Budgeted', 'Analyzed', 'Reconciled', 'Audited',
      'Optimized', 'Managed', 'Reduced', 'Increased', 'Evaluated',
      'Modeled', 'Projected', 'Computed', 'Advised', 'Structured'
    ],
    bulletTemplates: [
      'Managed budget of ${amount}, achieving {percentage}% cost reduction',
      'Analyzed {metric} resulting in {outcome} worth ${amount}',
      'Forecasted {metric} with {percentage}% accuracy, informing {decision}',
      'Reduced {cost/risk} by {percentage}% through {action}',
      'Optimized {process} saving ${amount} annually'
    ],
    atsKeywords: [
      'Financial Analysis', 'Budgeting', 'Forecasting', 'Excel', 'SAP',
      'Oracle', 'GAAP', 'IFRS', 'CFA', 'CPA', 'Financial Modeling', 'Variance Analysis'
    ]
  },
  'business': {
    actionVerbs: [
      'Managed', 'Led', 'Strategized', 'Optimized', 'Streamlined',
      'Coordinated', 'Negotiated', 'Facilitated', 'Executed', 'Delivered',
      'Improved', 'Developed', 'Implemented', 'Collaborated', 'Directed'
    ],
    bulletTemplates: [
      'Led team of {number} to {outcome}, achieving {metric}',
      'Managed {project/initiative} with ${budget}, delivering {result}',
      'Optimized {process} reducing {metric} by {percentage}%',
      'Developed {strategy} that {outcome}, increasing {metric} by {amount}',
      'Collaborated with {stakeholders} to {action}, resulting in {impact}'
    ],
    atsKeywords: [
      'Project Management', 'Strategic Planning', 'Business Development',
      'Stakeholder Management', 'Process Improvement', 'Agile', 'Scrum'
    ]
  },
  'software': {
    actionVerbs: [
      'Developed', 'Architected', 'Implemented', 'Designed', 'Optimized',
      'Deployed', 'Debugged', 'Refactored', 'Integrated', 'Built',
      'Created', 'Maintained', 'Migrated', 'Automated', 'Scaled'
    ],
    bulletTemplates: [
      'Developed {feature/system} using {technology}, improving {metric} by {percentage}%',
      'Built {application} that {outcome}, serving {number} users',
      'Optimized {system} reducing {metric} by {amount}',
      'Architected {solution} that {action}, increasing {metric} by {percentage}%',
      'Implemented {feature} using {tech}, reducing {metric} by {time/percentage}'
    ],
    atsKeywords: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
      'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'REST API', 'GraphQL',
      'Database', 'SQL', 'NoSQL', 'Git', 'Agile', 'Scrum'
    ]
  },
  'ops': {
    actionVerbs: [
      'Managed', 'Maintained', 'Monitored', 'Optimized', 'Troubleshot',
      'Deployed', 'Configured', 'Automated', 'Scaled', 'Secured',
      'Upgraded', 'Migrated', 'Documented', 'Coordinated', 'Resolved'
    ],
    bulletTemplates: [
      'Managed {system} serving {number} users with {uptime}% uptime',
      'Automated {process} reducing {metric} by {percentage}%',
      'Optimized {system} improving {metric} by {amount}',
      'Resolved {number} incidents reducing MTTR by {time}',
      'Deployed {solution} that {outcome}, saving {time/money}'
    ],
    atsKeywords: [
      'DevOps', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD',
      'Monitoring', 'Linux', 'Networking', 'Security', 'Automation'
    ]
  },
  'sales': {
    actionVerbs: [
      'Exceeded', 'Generated', 'Closed', 'Negotiated', 'Developed',
      'Managed', 'Cultivated', 'Expanded', 'Achieved', 'Increased',
      'Maintained', 'Qualified', 'Presented', 'Demonstrated', 'Delivered'
    ],
    bulletTemplates: [
      'Exceeded quota by {percentage}%, generating ${amount} in revenue',
      'Closed {number} deals worth ${amount}, achieving {percentage}% quota',
      'Developed pipeline of ${amount}, closing {percentage}%',
      'Increased {metric} by {percentage}% through {action}',
      'Generated ${amount} in new business from {source}'
    ],
    atsKeywords: [
      'Sales', 'CRM', 'Salesforce', 'Lead Generation', 'Account Management',
      'Negotiation', 'B2B', 'B2C', 'Revenue', 'Pipeline Management'
    ]
  },
  'marketing': {
    actionVerbs: [
      'Launched', 'Developed', 'Executed', 'Analyzed', 'Optimized',
      'Created', 'Managed', 'Increased', 'Generated', 'Improved',
      'Designed', 'Coordinated', 'Campaign', 'Segmented', 'Targeted'
    ],
    bulletTemplates: [
      'Launched {campaign} that {outcome}, generating {metric}',
      'Increased {metric} by {percentage}% through {action}',
      'Developed {strategy} that {outcome}, achieving {metric}',
      'Managed {budget} budget, achieving {percentage}% ROI',
      'Created {content} that {outcome}, reaching {number} audience'
    ],
    atsKeywords: [
      'Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing',
      'Email Marketing', 'Analytics', 'Google Analytics', 'CRM', 'Campaign Management'
    ]
  },
  'customer-support': {
    actionVerbs: [
      'Resolved', 'Assisted', 'Improved', 'Managed', 'Maintained',
      'Responded', 'Escalated', 'Documented', 'Trained', 'Supported',
      'Reduced', 'Increased', 'Coordinated', 'Communicated', 'Delivered'
    ],
    bulletTemplates: [
      'Resolved {number} tickets with {percentage}% satisfaction rating',
      'Reduced {metric} by {percentage}% through {action}',
      'Improved {metric} by {amount}, increasing customer satisfaction',
      'Managed team handling {number} requests/month',
      'Developed {process} reducing {metric} by {time/percentage}'
    ],
    atsKeywords: [
      'Customer Service', 'Support', 'Zendesk', 'Help Desk', 'CRM',
      'Troubleshooting', 'Communication', 'Problem Solving'
    ]
  },
  'education': {
    actionVerbs: [
      'Taught', 'Developed', 'Designed', 'Managed', 'Coordinated',
      'Created', 'Implemented', 'Evaluated', 'Mentored', 'Facilitated',
      'Improved', 'Led', 'Collaborated', 'Assessed', 'Delivered'
    ],
    bulletTemplates: [
      'Taught {subject} to {number} students, achieving {metric}',
      'Developed {curriculum/program} that {outcome}',
      'Managed {program/initiative} serving {number} participants',
      'Improved {metric} by {percentage}% through {action}',
      'Created {resource} used by {number} students/teachers'
    ],
    atsKeywords: [
      'Curriculum Development', 'Teaching', 'Education', 'Learning',
      'Student Engagement', 'Assessment', 'Pedagogy'
    ]
  },
  'healthcare': {
    actionVerbs: [
      'Managed', 'Coordinated', 'Delivered', 'Improved', 'Maintained',
      'Documented', 'Assessed', 'Implemented', 'Monitored', 'Treated',
      'Collaborated', 'Educated', 'Developed', 'Optimized', 'Reduced'
    ],
    bulletTemplates: [
      'Managed care for {number} patients, achieving {metric}',
      'Improved {metric} by {percentage}% through {action}',
      'Reduced {metric} by {amount}, improving patient outcomes',
      'Coordinated {program/initiative} serving {number} patients',
      'Implemented {protocol} that {outcome}, reducing {risk/metric}'
    ],
    atsKeywords: [
      'Healthcare', 'Patient Care', 'HIPAA', 'EMR', 'EHR',
      'Clinical', 'Medical', 'Nursing', 'Treatment'
    ]
  }
}

/**
 * Infer job family from job title/keywords
 */
export function inferJobFamily(jobTitle: string, jobDescription?: string): JobFamily {
  const text = `${jobTitle} ${jobDescription || ''}`.toLowerCase()
  
  // Data/Analytics
  if (/\b(data|analyst|analytics|scientist|machine learning|ai|bi)\b/.test(text)) {
    return 'data-analytics'
  }
  
  // Finance
  if (/\b(finance|financial|accountant|cfo|audit|accounting|banking)\b/.test(text)) {
    return 'finance'
  }
  
  // Software
  if (/\b(software|developer|engineer|programmer|coding|full stack|backend|frontend)\b/.test(text)) {
    return 'software'
  }
  
  // Operations
  if (/\b(operations|ops|devops|infrastructure|sysadmin|system)\b/.test(text)) {
    return 'ops'
  }
  
  // Sales
  if (/\b(sales|account executive|business development|bd|revenue)\b/.test(text)) {
    return 'sales'
  }
  
  // Marketing
  if (/\b(marketing|digital marketing|seo|sem|content|social media)\b/.test(text)) {
    return 'marketing'
  }
  
  // Customer Support
  if (/\b(support|customer service|help desk|service|customer success)\b/.test(text)) {
    return 'customer-support'
  }
  
  // Education
  if (/\b(teacher|educator|education|teaching|curriculum|professor)\b/.test(text)) {
    return 'education'
  }
  
  // Healthcare
  if (/\b(healthcare|medical|nurse|doctor|clinical|patient care|hospital)\b/.test(text)) {
    return 'healthcare'
  }
  
  // Default to business
  return 'business'
}

/**
 * Get suggestions for a job family
 */
export function getSuggestions(family: JobFamily, count: number = 10): {
  bullets: string[]
  keywords: string[]
} {
  const library = PHRASE_LIBRARY[family]
  
  // Get random bullet templates (simplified - in real app, would be smarter)
  const bullets = library.bulletTemplates.slice(0, Math.min(count, library.bulletTemplates.length))
  
  return {
    bullets,
    keywords: library.atsKeywords.slice(0, Math.min(count * 2, library.atsKeywords.length))
  }
}


import type { UnsolvedProblem, Domain, ProblemSource } from '@/types';
import { getXPrizeChallenges, XPRIZE_CHALLENGES } from './xprize';
import { getSDGChallenges, SDG_CHALLENGES } from './sdgs';
import { getWEFRisks, WEF_RISKS } from './wef';
import { getYCRFSChallenges, YC_RFS_CHALLENGES } from './yc-rfs';

export { XPRIZE_CHALLENGES } from './xprize';
export { SDG_CHALLENGES } from './sdgs';
export { WEF_RISKS } from './wef';
export { YC_RFS_CHALLENGES } from './yc-rfs';

/**
 * Get all unsolved problems, optionally filtered by domain
 */
export function getAllProblems(domain?: Domain): UnsolvedProblem[] {
  const allProblems = [
    ...XPRIZE_CHALLENGES,
    ...SDG_CHALLENGES,
    ...WEF_RISKS,
    ...YC_RFS_CHALLENGES,
  ];

  if (!domain) return allProblems;
  return allProblems.filter(p => p.domain === domain);
}

/**
 * Get problems by source
 */
export function getProblemsBySource(source: ProblemSource): UnsolvedProblem[] {
  switch (source) {
    case 'xprize':
      return getXPrizeChallenges();
    case 'sdg':
      return getSDGChallenges();
    case 'wef':
      return getWEFRisks();
    case 'yc_rfs':
      return getYCRFSChallenges();
    default:
      return [];
  }
}

/**
 * Get a random problem from a specific domain
 */
export function getRandomProblem(domain?: Domain): UnsolvedProblem {
  const problems = getAllProblems(domain);
  const randomIndex = Math.floor(Math.random() * problems.length);
  return problems[randomIndex];
}

/**
 * Get problem by ID
 */
export function getProblemById(id: string): UnsolvedProblem | undefined {
  return getAllProblems().find(p => p.id === id);
}

/**
 * Get problems count by domain
 */
export function getProblemCountsByDomain(): Record<Domain, number> {
  const counts: Record<string, number> = {};
  const allProblems = getAllProblems();
  
  for (const problem of allProblems) {
    counts[problem.domain] = (counts[problem.domain] || 0) + 1;
  }
  
  return counts as Record<Domain, number>;
}

/**
 * Search problems by keyword
 */
export function searchProblems(query: string): UnsolvedProblem[] {
  const lowerQuery = query.toLowerCase();
  return getAllProblems().filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get source display name
 */
export function getSourceDisplayName(source: ProblemSource): string {
  const names: Record<ProblemSource, string> = {
    xprize: 'XPRIZE',
    sdg: 'UN SDGs',
    wef: 'WEF Global Risks',
    yc_rfs: 'YC Request for Startups',
    gates: 'Gates Foundation',
  };
  return names[source] || source;
}

/**
 * Get source color for UI
 */
export function getSourceColor(source: ProblemSource): string {
  const colors: Record<ProblemSource, string> = {
    xprize: '#00d4ff',
    sdg: '#00ff88',
    wef: '#ff6b6b',
    yc_rfs: '#ff9f43',
    gates: '#bf00ff',
  };
  return colors[source] || '#ffffff';
}

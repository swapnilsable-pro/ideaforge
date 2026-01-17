import { NextResponse } from 'next/server';
import { getAllProblems, getProblemsBySource } from '@/lib/problems';
import type { Domain, ProblemSource } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain') as Domain | null;
  const source = searchParams.get('source') as ProblemSource | null;

  let problems;

  if (source) {
    problems = getProblemsBySource(source);
    if (domain) {
      problems = problems.filter(p => p.domain === domain);
    }
  } else {
    problems = getAllProblems(domain || undefined);
  }

  return NextResponse.json({ 
    success: true, 
    problems,
    count: problems.length 
  });
}

'use client';

import type { UnsolvedProblem } from '@/types';
import { getSourceDisplayName } from '@/lib/problems';
import styles from './challenge-card.module.css';

interface ChallengeCardProps {
  problem: UnsolvedProblem;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ChallengeCard({ problem, isSelected, onSelect }: ChallengeCardProps) {
  return (
    <button
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
    >
      <div className={styles.header}>
        <span className={styles.source}>
          {getSourceDisplayName(problem.source)}
        </span>
        {problem.prize_amount && (
          <span className={styles.prize}>{problem.prize_amount}</span>
        )}
      </div>
      
      <h3 className={styles.title}>{problem.title}</h3>
      <p className={styles.description}>{problem.description}</p>
      
      <div className={styles.tags}>
        {problem.tags.slice(0, 3).map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </button>
  );
}

interface ChallengeListProps {
  problems: UnsolvedProblem[];
  selectedId?: string;
  onSelect: (problem: UnsolvedProblem) => void;
}

export function ChallengeList({ problems, selectedId, onSelect }: ChallengeListProps) {
  if (problems.length === 0) {
    return (
      <div className={styles.empty}>
        <p>NO CHALLENGES FOUND</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {problems.map((problem) => (
        <ChallengeCard
          key={problem.id}
          problem={problem}
          isSelected={selectedId === problem.id}
          onSelect={() => onSelect(problem)}
        />
      ))}
    </div>
  );
}

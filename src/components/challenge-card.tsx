'use client';

import type { UnsolvedProblem } from '@/types';
import { getSourceDisplayName, getSourceColor } from '@/lib/problems';
import styles from './challenge-card.module.css';

interface ChallengeCardProps {
  problem: UnsolvedProblem;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ChallengeCard({ problem, isSelected, onSelect }: ChallengeCardProps) {
  const sourceColor = getSourceColor(problem.source);
  
  return (
    <button
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
      style={{ '--source-color': sourceColor } as React.CSSProperties}
    >
      <div 
        className={styles.source}
        style={{ background: sourceColor }}
      >
        {getSourceDisplayName(problem.source)}
      </div>
      
      <h3 className={styles.title}>{problem.title}</h3>
      <p className={styles.description}>{problem.description}</p>
      
      {problem.prize_amount && (
        <div className={styles.prize}>
          <span className={styles.prizeLabel}>Prize</span>
          <span className={styles.prizeAmount}>{problem.prize_amount}</span>
        </div>
      )}
      
      <div className={styles.tags}>
        {problem.tags.slice(0, 3).map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
      
      {isSelected && <div className={styles.selectedGlow} />}
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
        <p>No challenges found for this domain yet.</p>
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

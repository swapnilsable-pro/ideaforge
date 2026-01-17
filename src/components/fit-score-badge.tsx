'use client';

import { IdeaFit } from '@/types';
import styles from './fit-score-badge.module.css';

interface FitScoreBadgeProps {
  fitAnalysis: IdeaFit;
}

export function FitScoreBadge({ fitAnalysis }: FitScoreBadgeProps) {
  const score = fitAnalysis.overall_fit;
  const getScoreColor = () => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

const getScoreLabel = () => {
    if (score >= 80) return 'Perfect Match!';
    if (score >= 60) return 'Good Fit';
    return 'Consider Pivot';
  };

  return (
    <div className={styles.container}>
      <div className={styles.badge} style={{ borderColor: getScoreColor() }}>
        <div className={styles.score} style={{ color: getScoreColor() }}>
          {score}%
        </div>
        <div className={styles.label}>{getScoreLabel()}</div>
      </div>
      
      <div className={styles.breakdown}>
        <div className={styles.stat}>
          💛 Love: {fitAnalysis.ikigai.love}/25
        </div>
        <div className={styles.stat}>
          💪 Skill: {fitAnalysis.ikigai.good_at}/25
        </div>
        <div className={styles.stat}>
          🌍 Need: {fitAnalysis.ikigai.world_needs}/25
        </div>
        <div className={styles.stat}>
          💰 Money: {fitAnalysis.ikigai.paid_for}/25
        </div>
      </div>

      {fitAnalysis.network_leverage.critical.length > 0 && (
        <div className={styles.advantage}>
          <strong>🎯 Your Advantage:</strong>
          <p>{fitAnalysis.network_leverage.critical[0]}</p>
        </div>
      )}
    </div>
  );
}

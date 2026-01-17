'use client';

import { SignalScore } from '@/lib/validation/signal-score';
import styles from './signal-score-gauge.module.css';

interface SignalScoreGaugeProps {
  score: SignalScore | null;
  isLoading?: boolean;
  onValidate?: () => void;
}

export function SignalScoreGauge({ score, isLoading, onValidate }: SignalScoreGaugeProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}>⏳</div>
          <p>Calculating validation metrics...</p>
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <p>No validation data yet</p>
          {onValidate && (
            <button onClick={onValidate} className={styles.validateButton}>
              Calculate Signal Score
            </button>
          )}
        </div>
      </div>
    );
  }

  const getScoreColor = (total: number) => {
    if (total >= 71) return '#10b981'; // Green
    if (total >= 41) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

  const getScoreLabel = (total: number) => {
    if (total >= 71) return 'Strong Potential';
    if (total >= 41) return 'Moderate Viability';
    return 'Needs Refinement';
  };

  return (
    <div className={styles.container}>
      {/* Main Score Display */}
      <div className={styles.scoreDisplay}>
        <div 
          className={styles.scoreCircle}
          style={{ borderColor: getScoreColor(score.total) }}
        >
          <div className={styles.scoreValue}>{score.total}</div>
          <div className={styles.scoreMax}>/100</div>
        </div>
        <div className={styles.scoreLabel} style={{ color: getScoreColor(score.total) }}>
          {getScoreLabel(score.total)}
        </div>
      </div>

      {/* Breakdown */}
      <div className={styles.breakdown}>
        <h4 className={styles.breakdownTitle}>SCORE BREAKDOWN</h4>
        
        <div className={styles.breakdownItem}>
          <div className={styles.breakdownHeader}>
            <span className={styles.breakdownLabel}>Market Size</span>
            <span className={styles.breakdownScore}>
              {score.breakdown.marketSize.score}/{score.breakdown.marketSize.maxScore}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${(score.breakdown.marketSize.score / 25) * 100}%`,
                background: getScoreColor(score.breakdown.marketSize.score * 4),
              }}
            />
          </div>
          <p className={styles.breakdownReason}>{score.breakdown.marketSize.reason}</p>
        </div>

        <div className={styles.breakdownItem}>
          <div className={styles.breakdownHeader}>
            <span className={styles.breakdownLabel}>Competition</span>
            <span className={styles.breakdownScore}>
              {score.breakdown.competition.score}/{score.breakdown.competition.maxScore}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${(score.breakdown.competition.score / 25) * 100}%`,
                background: getScoreColor(score.breakdown.competition.score * 4),
              }}
            />
          </div>
          <p className={styles.breakdownReason}>{score.breakdown.competition.reason}</p>
        </div>

        <div className={styles.breakdownItem}>
          <div className={styles.breakdownHeader}>
            <span className={styles.breakdownLabel}>Trend Momentum</span>
            <span className={styles.breakdownScore}>
              {score.breakdown.trendMomentum.score}/{score.breakdown.trendMomentum.maxScore}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${(score.breakdown.trendMomentum.score / 25) * 100}%`,
                background: getScoreColor(score.breakdown.trendMomentum.score * 4),
              }}
            />
          </div>
          <p className={styles.breakdownReason}>{score.breakdown.trendMomentum.reason}</p>
        </div>

        <div className={styles.breakdownItem}>
          <div className={styles.breakdownHeader}>
            <span className={styles.breakdownLabel}>Feasibility</span>
            <span className={styles.breakdownScore}>
              {score.breakdown.feasibility.score}/{score.breakdown.feasibility.maxScore}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${(score.breakdown.feasibility.score / 25) * 100}%`,
                background: getScoreColor(score.breakdown.feasibility.score * 4),
              }}
            />
          </div>
          <p className={styles.breakdownReason}>{score.breakdown.feasibility.reason}</p>
        </div>
      </div>

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <div className={styles.recommendations}>
          <h4 className={styles.recommendationsTitle}>RECOMMENDATIONS</h4>
          <ul className={styles.recommendationsList}>
            {score.recommendations.map((rec, i) => (
              <li key={i} className={styles.recommendation}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

'use client';

import { CompetitorAnalysis } from '@/lib/validation/competitor-research';
import styles from './competitor-list.module.css';

interface CompetitorListProps {
  analysis: CompetitorAnalysis | null;
  isLoading?: boolean;
  onResearch?: () => void;
}

export function CompetitorList({ analysis, isLoading, onResearch }: CompetitorListProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}>🔍</div>
          <p>Scanning competitive landscape...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🤺</div>
          <p>No competitor data yet</p>
          {onResearch && (
            <button onClick={onResearch} className={styles.researchButton}>
              Research Competitors
            </button>
          )}
        </div>
      </div>
    );
  }

  const getFundingColor = (stage: string) => {
    switch (stage) {
      case 'Pre-seed': return '#a1a1aa';
      case 'Seed': return '#fbbf24';
      case 'Series A': return '#fb923c';
      case 'Series B+': return '#ef4444';
      case 'Public': return '#8b5cf6';
      default: return '#71717a';
    }
  };

  return (
    <div className={styles.container}>
      {/* Competitors List */}
      <div className={styles.competitorsList}>
        {analysis.competitors.map((competitor, index) => (
          <div key={index} className={styles.competitorCard}>
            <div className={styles.competitorHeader}>
              <h4 className={styles.competitorName}>{competitor.name}</h4>
              <span 
                className={styles.fundingBadge}
                style={{ 
                  background: getFundingColor(competitor.fundingStage),
                  color: 'white',
                }}
              >
                {competitor.fundingStage}
              </span>
            </div>

            <p className={styles.competitorDescription}>{competitor.description}</p>

            {competitor.url && (
              <a 
                href={competitor.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.competitorLink}
              >
                🔗 Visit Website
              </a>
            )}

            <div className={styles.differentiationBox}>
              <strong>🎯 How We Differ:</strong>
              <p>{competitor.differentiation}</p>
            </div>

            <div className={styles.swotGrid}>
              <div className={styles.swotSection}>
                <strong className={styles.swotLabel}>💪 Strengths</strong>
                <ul className={styles.swotList}>
                  {competitor.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.swotSection}>
                <strong className={styles.swotLabel}>⚠️ Weaknesses</strong>
                <ul className={styles.swotList}>
                  {competitor.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Gaps */}
      {analysis.marketGaps.length > 0 && (
        <div className={styles.insightsSection}>
          <h4 className={styles.insightsTitle}>🔓 Market Gaps & Opportunities</h4>
          <ul className={styles.gapsList}>
            {analysis.marketGaps.map((gap, i) => (
              <li key={i} className={styles.gapItem}>{gap}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Strategy */}
      <div className={styles.strategyBox}>
        <h4 className={styles.strategyTitle}>🎲 Recommended Positioning</h4>
        <p className={styles.strategyText}>{analysis.recommendedStrategy}</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.timestamp}>
          Researched: {new Date(analysis.researchedAt).toLocaleDateString()}
        </span>
        {onResearch && (
          <button onClick={onResearch} className={styles.refreshButton}>
            🔄 Refresh Data
          </button>
        )}
      </div>
    </div>
  );
}

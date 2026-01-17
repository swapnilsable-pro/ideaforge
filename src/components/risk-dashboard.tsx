'use client';

import { RiskAnalysis, RiskLevel } from '@/lib/validation/risk-analysis';
import styles from './risk-dashboard.module.css';

interface RiskDashboardProps {
  analysis: RiskAnalysis | null;
  isLoading?: boolean;
  onAnalyze?: () => void;
}

export function RiskDashboard({ analysis, isLoading, onAnalyze }: RiskDashboardProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}>⚠️</div>
          <p>Analyzing risks...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛡️</div>
          <p>No risk analysis yet</p>
          {onAnalyze && (
            <button onClick={onAnalyze} className={styles.analyzeButton}>
              Analyze Risks
            </button>
          )}
        </div>
      </div>
    );
  }

  const getRiskColor = (level: RiskLevel) => {
    if (level === 'high') return '#ef4444';
    if (level === 'medium') return '#fbbf24';
    return '#10b981';
  };

  const getRiskIcon = (level: RiskLevel) => {
    if (level === 'high') return '🔴';
    if (level === 'medium') return '🟡';
    return '🟢';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'skill': return '🧠';
      case 'market': return '📊';
      case 'regulatory': return '⚖️';
      case 'timeline': return '⏱️';
      default: return '⚠️';
    }
  };

  return (
    <div className={styles.container}>
      {/* Overall Risk Summary */}
      <div 
        className={styles.overallRisk}
        style={{ 
          borderColor: getRiskColor(analysis.overallRisk),
          background: analysis.overallRisk === 'high' ? '#fef2f2' : 
                     analysis.overallRisk === 'medium' ? '#fefce8' : '#f0fdf4',
        }}
      >
        <div className={styles.overallLabel}>Overall Risk Level</div>
        <div 
          className={styles.overallValue}
          style={{ color: getRiskColor(analysis.overallRisk) }}
        >
          {getRiskIcon(analysis.overallRisk)} {analysis.overallRisk.toUpperCase()}
        </div>
        <div className={styles.mvpEstimate}>
          Estimated MVP: <strong>{analysis.estimatedMvpWeeks} weeks</strong> (~{Math.round(analysis.estimatedMvpWeeks / 4)} months)
        </div>
      </div>

      {/* Risk Cards */}
      <div className={styles.risksGrid}>
        {analysis.risks.map((risk, index) => (
          <div 
            key={index}
            className={styles.riskCard}
            style={{ borderLeftColor: getRiskColor(risk.level), borderLeftWidth: '6px' }}
          >
            <div className={styles.riskHeader}>
              <div className={styles.riskCategory}>
                {getCategoryIcon(risk.category)} {risk.category}
              </div>
              <div 
                className={styles.riskBadge}
                style={{ 
                  background: getRiskColor(risk.level),
                  color: 'white',
                }}
              >
                {getRiskIcon(risk.level)} {risk.level}
              </div>
            </div>

            <h4 className={styles.riskTitle}>{risk.title}</h4>
            <p className={styles.riskDescription}>{risk.description}</p>

            <div className={styles.mitigation}>
              <strong>💡 Mitigation:</strong>
              <p>{risk.mitigation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.timestamp}>
          Analyzed: {new Date(analysis.researchedAt).toLocaleDateString()}
        </span>
        {onAnalyze && (
          <button onClick={onAnalyze} className={styles.refreshButton}>
            🔄 Re-analyze
          </button>
        )}
      </div>
    </div>
  );
}

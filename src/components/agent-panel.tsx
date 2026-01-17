'use client';

import { useState } from 'react';
import { AgentReport } from '@/types';
import styles from './agent-panel.module.css';

interface AgentPanelProps {
  ideaId: string;
  existingAnalysis?: {
    reports: AgentReport[];
    synthesis: string;
  };
}

const AGENT_INFO = {
  researcher: {
    name: '📊 Market Researcher',
    emoji: '📊',
    description: 'Analyzes market size, competition, and trends',
  },
  designer: {
    name: '🎨 Product Designer',
    emoji: '🎨',
    description: 'Critiques features, UX/UI, and tech architecture',
  },
  validator: {
    name: '💼 Business Validator',
    emoji: '💼',
    description: 'Assesses revenue model and scalability',
  },
  gtm: {
    name: '🚀 GTM Strategist',
    emoji: '🚀',
    description: 'Creates go-to-market strategy and pricing',
  },
};

export function AgentPanel({ ideaId, existingAnalysis }: AgentPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [reports, setReports] = useState<AgentReport[]>(existingAnalysis?.reports || []);
  const [synthesis, setSynthesis] = useState(existingAnalysis?.synthesis || '');
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setIsRunning(true);
    setReports([]);
    setSynthesis('');

    try {
      const response = await fetch(`/api/ideas/${ideaId}/agents`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setReports(data.analysis.reports);
        setSynthesis(data.analysis.synthesis);
      } else {
        alert('Analysis failed: ' + data.error);
      }
    } catch (error) {
      console.error('Agent analysis error:', error);
      alert('Failed to run multi-agent analysis');
    } finally {
      setIsRunning(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 70) return '#10b981'; // Green
    if (score >= 50) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>🤖 Multi-Agent Analysis</h2>
          <p className={styles.subtitle}>
            4 specialized AI agents analyze your idea from different perspectives
          </p>
        </div>
        <button
          onClick={handleRunAnalysis}
          disabled={isRunning}
          className={styles.runButton}
        >
          {isRunning ? '⏳ Running...' : reports.length > 0 ? '🔄 Re-Run Analysis' : '▶️ Run Analysis'}
        </button>
      </div>

      {isRunning && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>AI agents are analyzing your idea... This may take 30-60 seconds.</p>
        </div>
      )}

      {reports.length > 0 && (
        <>
          {/* Synthesis */}
          {synthesis && (
            <div className={styles.synthesis}>
              <h3 className={styles.synthesisTitle}>📋 Overall Assessment</h3>
              <div className={styles.synthesisContent}>{synthesis}</div>
            </div>
          )}

          {/* Agent Reports */}
          <div className={styles.reports}>
            {reports.map((report) => {
              const info = AGENT_INFO[report.agent_role as keyof typeof AGENT_INFO];
              const isExpanded = expandedAgent === report.agent_role;

              return (
                <div key={report.agent_role} className={styles.agentCard}>
                  <div
                    className={styles.agentHeader}
                    onClick={() => setExpandedAgent(isExpanded ? null : report.agent_role)}
                  >
                    <div className={styles.agentInfo}>
                      <span className={styles.agentEmoji}>{info.emoji}</span>
                      <div>
                        <h4 className={styles.agentName}>{info.name}</h4>
                        <p className={styles.agentDesc}>{info.description}</p>
                      </div>
                    </div>
                    <div className={styles.confidenceScore}>
                      <div
                        className={styles.scoreCircle}
                        style={{ borderColor: getConfidenceColor(report.confidence_score) }}
                      >
                        <span style={{ color: getConfidenceColor(report.confidence_score) }}>
                          {report.confidence_score}%
                        </span>
                      </div>
                      <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.agentBody}>
                      <p className={styles.summary}>{report.summary}</p>

                      {report.key_insights.length > 0 && (
                        <div className={styles.section}>
                          <h5 className={styles.sectionTitle}>💡 Key Insights</h5>
                          <ul className={styles.list}>
                            {report.key_insights.map((insight, i) => (
                              <li key={i}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {report.recommendations.length > 0 && (
                        <div className={styles.section}>
                          <h5 className={styles.sectionTitle}>✅ Recommendations</h5>
                          <ul className={styles.list}>
                            {report.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {report.concerns.length > 0 && (
                        <div className={styles.section}>
                          <h5 className={styles.sectionTitle}>⚠️ Concerns</h5>
                          <ul className={styles.listConcerns}>
                            {report.concerns.map((concern, i) => (
                              <li key={i}>{concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {report.metadata && Object.keys(report.metadata).length > 0 && (
                        <div className={styles.metadata}>
                          {Object.entries(report.metadata).map(([key, value]) => (
                            <div key={key} className={styles.metadataItem}>
                              <strong>{key.replace(/_/g, ' ')}:</strong>{' '}
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className={styles.executionTime}>
                        Analyzed in {(report.execution_time_ms / 1000).toFixed(1)}s
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

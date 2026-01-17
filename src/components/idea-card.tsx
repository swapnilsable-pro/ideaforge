'use client';

import type { GeneratedIdea } from '@/types';
import { BUSINESS_MODELS, TECHNOLOGIES } from '@/types';
import { getSourceDisplayName, getSourceColor } from '@/lib/problems';
import styles from './idea-card.module.css';

interface IdeaCardProps {
  idea: GeneratedIdea;
  onSave?: () => void;
  onRegenerate?: () => void;
  isSaving?: boolean;
}

export function IdeaCard({ idea, onSave, onRegenerate, isSaving }: IdeaCardProps) {
  const sourceColor = getSourceColor(idea.problem_source);

  return (
    <div className={styles.card}>
      <div className={styles.glow} />
      <div className={styles.gradientBar} />
      
      <div className={styles.header}>
        <div 
          className={styles.source}
          style={{ background: sourceColor }}
        >
          {getSourceDisplayName(idea.problem_source)}
        </div>
        {idea.viability_score && (
          <div className={styles.score}>
            <span className={styles.scoreLabel}>Viability</span>
            <span className={styles.scoreValue}>{idea.viability_score}</span>
          </div>
        )}
      </div>

      <h2 className={styles.title}>{idea.title}</h2>
      <p className={styles.tagline}>{idea.tagline}</p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>💡 The Problem</h3>
        <p className={styles.text}>{idea.problem_description}</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🚀 The Solution</h3>
        <p className={styles.text}>{idea.solution_description}</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📖 Job Story</h3>
        <div className={styles.jobStory}>
          <p><strong>When</strong> {idea.job_story.situation},</p>
          <p><strong>I want to</strong> {idea.job_story.motivation},</p>
          <p><strong>So I can</strong> {idea.job_story.outcome}.</p>
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Business Model</span>
          <span className={styles.metaValue}>{BUSINESS_MODELS[idea.business_model]}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Technology</span>
          <span className={styles.metaValue}>{TECHNOLOGIES[idea.technology]}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Target</span>
          <span className={styles.metaValue}>{idea.target_audience}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Revenue</span>
          <span className={styles.metaValue}>{idea.revenue_model}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>✨ Key Features</h3>
        <ul className={styles.features}>
          {idea.key_features.map((feature, index) => (
            <li key={index} className={styles.feature}>{feature}</li>
          ))}
        </ul>
      </div>

      {idea.validation_data && (
        <div className={styles.validation}>
          {idea.validation_data.risk_warnings.length > 0 && (
            <div className={styles.risks}>
              <h4>⚠️ Risk Warnings</h4>
              <ul>
                {idea.validation_data.risk_warnings.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
          )}
          {idea.validation_data.opportunities.length > 0 && (
            <div className={styles.opportunities}>
              <h4>🎯 Opportunities</h4>
              <ul>
                {idea.validation_data.opportunities.map((opp, i) => (
                  <li key={i}>{opp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button 
          className="glass-button button-primary" 
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : '💾 Save Idea'}
        </button>
        <button className="glass-button" onClick={onRegenerate}>
          🔄 Generate Another
        </button>
      </div>
    </div>
  );
}

export function IdeaCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.skeleton} style={{ width: '100px', height: '24px', marginBottom: '16px' }} />
      <div className={styles.skeleton} style={{ width: '80%', height: '32px', marginBottom: '8px' }} />
      <div className={styles.skeleton} style={{ width: '60%', height: '20px', marginBottom: '24px' }} />
      <div className={styles.skeleton} style={{ width: '100%', height: '80px', marginBottom: '16px' }} />
      <div className={styles.skeleton} style={{ width: '100%', height: '80px', marginBottom: '16px' }} />
      <div className={styles.skeleton} style={{ width: '100%', height: '100px' }} />
    </div>
  );
}

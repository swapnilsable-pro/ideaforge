'use client';

import type { GeneratedIdea } from '@/types';
import { BUSINESS_MODELS, TECHNOLOGIES } from '@/types';
import { getSourceDisplayName } from '@/lib/problems';
import styles from './idea-card.module.css';

interface IdeaCardProps {
  idea: GeneratedIdea;
  onSave?: () => void;
  onRegenerate?: () => void;
  isSaving?: boolean;
  justSaved?: boolean;
}

export function IdeaCard({ idea, onSave, onRegenerate, isSaving, justSaved }: IdeaCardProps) {
  const getButtonContent = () => {
    if (isSaving) return '⏳ SAVING...';
    if (justSaved) return '✓ SAVED!';
    return 'SAVE IDEA';
  };

  const getButtonStyle = () => {
    if (justSaved) return { background: '#10b981', color: 'white' };
    return {};
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.sourceBadge}>
          SOURCE: {getSourceDisplayName(idea.problem_source)}
        </span>
        <span className={styles.id}>#{idea.id.slice(0, 8)}</span>
      </div>

      <div className={styles.titleSection}>
        <h2 className={styles.title}>{idea.title}</h2>
        <p className={styles.tagline}>{idea.tagline}</p>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Problem</h3>
            <p className={styles.text}>{idea.problem_description}</p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Solution Blueprint</h3>
            <p className={styles.text}>{idea.solution_description}</p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Job Story</h3>
            <div className={styles.jobStory}>
              <p><strong>WHEN</strong> {idea.job_story.situation}</p>
              <p><strong>I WANT TO</strong> {idea.job_story.motivation}</p>
              <p><strong>SO I CAN</strong> {idea.job_story.outcome}</p>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Business Model</span>
            <div className={styles.metaValue}>{BUSINESS_MODELS[idea.business_model]}</div>
          </div>
          
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Technology</span>
            <div className={styles.metaValue}>{TECHNOLOGIES[idea.technology]}</div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Key Features</h3>
            <ul className={styles.features}>
              {idea.key_features.map((feature, index) => (
                <li key={index} className={styles.feature}>{feature}</li>
              ))}
            </ul>
          </div>

          {idea.viability_score && (
            <div className={styles.viabilityScore}>
              <span className={styles.scoreVal}>{idea.viability_score}</span>
              <span className={styles.scoreLabel}>Viability Score</span>
            </div>
          )}
        </div>
      </div>

      {(onSave || onRegenerate) && (
        <div className={styles.actions}>
          {onSave && (
            <button 
              className="brutalist-button button-primary" 
              onClick={onSave}
              disabled={isSaving || justSaved}
              style={getButtonStyle()}
            >
              {getButtonContent()}
            </button>
          )}
          {onRegenerate && (
            <button className="brutalist-button" onClick={onRegenerate}>
              GENERATE ANOTHER
            </button>
          )}
        </div>
      )}
    </div>
  );
}

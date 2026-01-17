'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SavedIdea, JobStory, GeneratedIdea, ValidationData } from '@/types';
import { IdeaCard } from '@/components/idea-card';
import styles from './page.module.css';

interface IdeaDetailClientProps {
  id: string;
}

export function IdeaDetailClient({ id }: IdeaDetailClientProps) {
  const router = useRouter();
  const [idea, setIdea] = useState<SavedIdea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIdea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchIdea = async () => {
    try {
      const response = await fetch(`/api/ideas/${id}`);
      const data = await response.json();

      if (data.success) {
        setIdea(data.idea);
      } else {
        setError(data.error || 'Failed to fetch idea');
      }
    } catch (err) {
      console.error('Error fetching idea:', err);
      setError('Failed to load idea');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      '🗑️ Are you sure you want to delete this idea? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Navigate back to ideas list
        router.push('/ideas');
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete idea. Please try again.');
      setIsDeleting(false);
    }
  };

  // Adapter to convert SavedIdea (DB) back to GeneratedIdea (Frontend) for IdeaCard
  // Note: job_story is stored as string in DB but IdeaCard expects object
  const getDisplayIdea = (savedResult: SavedIdea): GeneratedIdea => {
    let jobStory = { situation: '', motivation: '', outcome: '' };
    try {
      jobStory = typeof savedResult.job_story === 'string' 
        ? JSON.parse(savedResult.job_story)
        : savedResult.job_story;
    } catch (e) {
      console.error("Failed to parse job story", e);
    }

    return {
      id: savedResult.id,
      title: savedResult.title,
      tagline: 'Generated Idea',
      problem_source: savedResult.problem_source as GeneratedIdea['problem_source'],
      problem_title: savedResult.problem_title || '',
      problem_description: savedResult.problem_description || 'No description available',
      solution_description: savedResult.solution_description || 'No solution blueprint available',
      business_model: savedResult.business_model as GeneratedIdea['business_model'],
      technology: savedResult.technology as GeneratedIdea['technology'],
      job_story: jobStory,
      target_audience: savedResult.target_market || '',
      revenue_model: savedResult.revenue_model || '',
      key_features: [], // Not stored separately yet
      viability_score: savedResult.signal_score || undefined,
      created_at: savedResult.created_at,
    };
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading idea details...</div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer}>
          <div className={styles.error}>⚠️ {error || 'Idea not found'}</div>
          <button onClick={() => router.push('/ideas')} className={styles.backButton}>
            ← Back to My Ideas
          </button>
        </div>
      </div>
    );
  }

  const displayIdea = getDisplayIdea(idea);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={() => router.push('/ideas')} className={styles.backButton}>
          ← Back to List
        </button>
        <span className={styles.headerTitle}>{idea.title}</span>
        <button 
          onClick={handleDelete} 
          className={styles.deleteButton}
          disabled={isDeleting}
        >
          {isDeleting ? '🗑️ DELETING...' : '🗑️ DELETE'}
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Main Content Area - IdeaCard without action buttons */}
          <div className={styles.contentColumn}>
            <IdeaCard 
              idea={displayIdea} 
            />
          </div>

          {/* Validation Dashboard Placeholder - Right Column */}
          <div className={styles.dashboardColumn}>
            <div className={styles.dashboardCard}>
              <h3 className={styles.dashboardTitle}>Validation Dashboard</h3>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📊</div>
                <p>Signal Score & Market Analysis coming soon...</p>
                <div className={styles.comingSoonBadge}>MVP 2 In Progress</div>
              </div>
            </div>
            
             <div className={styles.dashboardCard}>
              <h3 className={styles.dashboardTitle}>Competitors</h3>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🤺</div>
                <p>Competitor radar scanning...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

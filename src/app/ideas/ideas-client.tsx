'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SavedIdea } from '@/types';
import styles from './page.module.css';

export function IdeasClient() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas');
      const data = await response.json();

      if (data.success) {
        setIdeas(data.ideas);
      } else {
        setError(data.error || 'Failed to fetch ideas');
      }
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError('Failed to load ideas');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading your ideas...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={() => router.push('/generate')} className={styles.backButton}>
          ← Back to Generator
        </button>
        <h1 className={styles.title}>My Ideas</h1>
        <div className={styles.count}>{ideas.length} saved</div>
      </header>

      <main className={styles.main}>
        {error && (
          <div className={styles.error}>
            <span>⚠️</span> {error}
          </div>
        )}

        {ideas.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>💡</div>
            <h2>No saved ideas yet</h2>
            <p>Generate and save your first business idea to see it here!</p>
            <button
              className="brutalist-button"
              onClick={() => router.push('/generate')}
              style={{ marginTop: '1.5rem' }}
            >
              Generate Idea
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {ideas.map((idea) => (
              <div key={idea.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.domain}>{idea.domain || 'General'}</span>
                  <span className={styles.date}>{formatDate(idea.created_at)}</span>
                </div>
                
                <h3 className={styles.cardTitle}>{idea.title}</h3>
                
                {idea.problem_title && (
                  <p className={styles.problem}>{idea.problem_title}</p>
                )}

                <div className={styles.meta}>
                  {idea.business_model && (
                    <span className={styles.tag}>{idea.business_model}</span>
                  )}
                  {idea.technology && (
                    <span className={styles.tag}>{idea.technology}</span>
                  )}
                </div>

                {idea.signal_score && (
                  <div className={styles.score}>
                    <span className={styles.scoreValue}>{idea.signal_score}</span>
                    <span className={styles.scoreLabel}>Signal Score</span>
                  </div>
                )}

                <button
                  className={styles.viewButton}
                  onClick={() => router.push(`/ideas/${idea.id}`)}
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

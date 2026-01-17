'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DomainSelector } from '@/components/domain-selector';
import { ChallengeList } from '@/components/challenge-card';
import { IdeaCard } from '@/components/idea-card';
import { LoadingSpinner } from '@/components/loading-spinner';
import { LogoutButton } from '@/components/auth/auth-buttons';
import type { Domain, UnsolvedProblem, GeneratorState } from '@/types';
import styles from './page.module.css';

export function GeneratorClient() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<{ email?: string; user_metadata?: { name?: string; avatar_url?: string } } | null>(null);
  const [state, setState] = useState<GeneratorState>({
    step: 'domain',
    isLoading: false,
  });
  const [problems, setProblems] = useState<UnsolvedProblem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Check auth status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
    };
    checkUser();
  }, [supabase, router]);

  // Fetch problems when domain is selected
  useEffect(() => {
    if (state.selectedDomain) {
      fetchProblems(state.selectedDomain);
    }
  }, [state.selectedDomain]);

  const fetchProblems = async (domain: Domain) => {
    try {
      const response = await fetch(`/api/problems?domain=${domain}`);
      const data = await response.json();
      if (data.success) {
        setProblems(data.problems);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    }
  };

  const handleDomainSelect = (domain: Domain) => {
    setState(prev => ({
      ...prev,
      selectedDomain: domain,
      step: 'challenge',
      selectedProblem: undefined,
      generatedIdea: undefined,
    }));
  };

  const handleProblemSelect = (problem: UnsolvedProblem) => {
    setState(prev => ({
      ...prev,
      selectedProblem: problem,
    }));
  };

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, step: 'generating', isLoading: true, error: undefined }));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: state.selectedDomain,
          problemId: state.selectedProblem?.id,
        }),
      });

      const data = await response.json();

      if (data.success && data.idea) {
        setState(prev => ({
          ...prev,
          step: 'result',
          generatedIdea: data.idea,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          step: 'challenge',
          isLoading: false,
          error: data.error || 'Failed to generate idea',
        }));
      }
    } catch (error) {
      console.error('Generation error:', error);
      setState(prev => ({
        ...prev,
        step: 'challenge',
        isLoading: false,
        error: 'Failed to generate idea. Please try again.',
      }));
    }
  };

  const handleRandomGenerate = async () => {
    setState(prev => ({ 
      ...prev, 
      step: 'generating', 
      isLoading: true, 
      error: undefined,
      selectedProblem: undefined 
    }));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: state.selectedDomain,
        }),
      });

      const data = await response.json();

      if (data.success && data.idea) {
        setState(prev => ({
          ...prev,
          step: 'result',
          generatedIdea: data.idea,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          step: 'challenge',
          isLoading: false,
          error: data.error || 'Failed to generate idea',
        }));
      }
    } catch (error) {
      console.error('Generation error:', error);
      setState(prev => ({
        ...prev,
        step: 'challenge',
        isLoading: false,
        error: 'Failed to generate idea. Please try again.',
      }));
    }
  };

  const handleSaveIdea = async () => {
    if (!state.generatedIdea || !user) return;
    
    setIsSaving(true);
    try {
      // For now, just show success - we'll implement actual save later
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Idea saved! (Demo mode - Supabase storage coming soon)');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save idea');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    if (state.selectedProblem) {
      handleGenerate();
    } else {
      handleRandomGenerate();
    }
  };

  const handleBack = () => {
    if (state.step === 'result') {
      setState(prev => ({ ...prev, step: 'challenge', generatedIdea: undefined }));
    } else if (state.step === 'challenge') {
      setState(prev => ({ ...prev, step: 'domain', selectedDomain: undefined, selectedProblem: undefined }));
    }
  };

  const handleStartOver = () => {
    setState({
      step: 'domain',
      isLoading: false,
    });
    setProblems([]);
  };

  if (!user) {
    return (
      <div className={styles.page}>
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={handleStartOver} className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>IdeaForge</span>
        </button>
        
        <div className={styles.userSection}>
          {user.user_metadata?.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className={styles.avatar}
            />
          )}
          <span className={styles.userName}>
            {user.user_metadata?.name || user.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className={styles.main}>
        {/* Progress Indicator */}
        <div className={styles.progress}>
          <div className={`${styles.step} ${state.step === 'domain' ? styles.active : ''} ${['challenge', 'generating', 'result'].includes(state.step) ? styles.completed : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Domain</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${state.step === 'challenge' ? styles.active : ''} ${['generating', 'result'].includes(state.step) ? styles.completed : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Challenge</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${['generating', 'result'].includes(state.step) ? styles.active : ''}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Idea</span>
          </div>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className={styles.error}>
            <span>⚠️</span> {state.error}
          </div>
        )}

        {/* Step Content */}
        <div className={styles.content}>
          {state.step === 'domain' && (
            <DomainSelector
              selectedDomain={state.selectedDomain}
              onSelect={handleDomainSelect}
            />
          )}

          {state.step === 'challenge' && (
            <div className={styles.challengeStep}>
              <div className={styles.challengeHeader}>
                <button onClick={handleBack} className={styles.backButton}>
                  ← Back
                </button>
                <h2 className={styles.challengeTitle}>
                  Select a <span className="gradient-text">Grand Challenge</span>
                </h2>
                <p className={styles.challengeSubtitle}>
                  Choose a specific problem to solve, or let us pick randomly
                </p>
              </div>

              <div className={styles.challengeActions}>
                <button 
                  className="glass-button button-primary"
                  onClick={handleRandomGenerate}
                >
                  🎲 Random Challenge → Generate
                </button>
                {state.selectedProblem && (
                  <button 
                    className="glass-button button-neon"
                    onClick={handleGenerate}
                  >
                    <span>🚀 Generate from Selected</span>
                  </button>
                )}
              </div>

              <ChallengeList
                problems={problems}
                selectedId={state.selectedProblem?.id}
                onSelect={handleProblemSelect}
              />
            </div>
          )}

          {state.step === 'generating' && (
            <LoadingSpinner message="Generating your business idea..." />
          )}

          {state.step === 'result' && state.generatedIdea && (
            <div className={styles.resultStep}>
              <button onClick={handleBack} className={styles.backButton}>
                ← Back to Challenges
              </button>
              <IdeaCard
                idea={state.generatedIdea}
                onSave={handleSaveIdea}
                onRegenerate={handleRegenerate}
                isSaving={isSaving}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

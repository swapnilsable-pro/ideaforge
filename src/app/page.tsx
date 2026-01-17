import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { GoogleLoginButton } from '@/components/auth/auth-buttons';
import styles from './page.module.css';

// Force dynamic rendering (uses Supabase auth)
export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>IdeaForge</span>
        </div>
        {user && (
          <Link href="/generate" className="glass-button">
            Go to Generator →
          </Link>
        )}
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            <span className="gradient-text">Transform</span> Unsolved Problems
            <br />
            Into <span className="gradient-text">Startup Ideas</span>
          </h1>
          
          <p className={styles.subtitle}>
            AI-powered ideation engine that connects global challenges—from XPrize 
            to UN SDGs—with validated business opportunities tailored to your vision.
          </p>

          <div className={styles.cta}>
            {user ? (
              <Link href="/generate" className="glass-button button-primary">
                <span>🚀</span> Start Generating Ideas
              </Link>
            ) : (
              <GoogleLoginButton />
            )}
          </div>

          <div className={styles.sources}>
            <p className={styles.sourcesLabel}>Powered by challenges from</p>
            <div className={styles.sourceLogos}>
              <span className={styles.sourceBadge} style={{ background: '#00d4ff' }}>XPRIZE</span>
              <span className={styles.sourceBadge} style={{ background: '#00ff88' }}>UN SDGs</span>
              <span className={styles.sourceBadge} style={{ background: '#ff6b6b' }}>WEF Risks</span>
              <span className={styles.sourceBadge} style={{ background: '#ff9f43' }}>YC RFS</span>
            </div>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Mode B: Moonshot Ideas</h3>
            <p>Generate ideas from $100M+ grand challenges and investor wishlists</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🤖</div>
            <h3>AI-Powered Validation</h3>
            <p>Get viability scores, risk warnings, and market opportunities</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📖</div>
            <h3>Job Story Framework</h3>
            <p>Every idea comes with a JTBD story for crystal-clear value propositions</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built with Next.js, Supabase, and Google Gemini</p>
      </footer>
    </div>
  );
}

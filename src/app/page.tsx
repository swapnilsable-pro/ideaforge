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
          <div className={styles.logoIcon}>⚡</div>
          <div className={styles.logoText}>IdeaForge</div>
        </div>
        {user && (
          <Link href="/generate" className="brutalist-button">
            Generator →
          </Link>
        )}
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            BUILD THE <span className={styles.highlight}>EXTRAORDINARY</span>
          </h1>
          
          <p className={styles.subtitle}>
            Don't build another todo app. Use our AI engine to discover $100M+ opportunities 
            hidden in global grand challenges.
          </p>

          <div className={styles.cta}>
            {user ? (
              <Link href="/generate" className="brutalist-button button-primary">
                START GENERATING
              </Link>
            ) : (
              <GoogleLoginButton />
            )}
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🚀</div>
            <h3>Moonshot Factory</h3>
            <p>Direct access to XPrize & YC requests. Solve real problems that matter.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🧠</div>
            <h3>AI Validation</h3>
            <p>Instant viability scoring and risk analysis for every generated idea.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📝</div>
            <h3>Job Stories</h3>
            <p>Clear "Jobs to be Done" framework output for immediate clarity.</p>
          </div>
        </div>

        <div className={styles.sources}>
          <p className={styles.sourcesLabel}>DATA SOURCES</p>
          <div className={styles.sourceLogos}>
            <span className={styles.sourceBadge}>XPRIZE</span>
            <span className={styles.sourceBadge}>UN SDGs</span>
            <span className={styles.sourceBadge}>WEF RISKS</span>
            <span className={styles.sourceBadge}>YC RFS</span>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built for ambitious founders. Powered by Gemini & Groq.</p>
      </footer>
    </div>
  );
}

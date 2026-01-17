import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import OnboardingClient from './onboarding-client';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Check if already onboarded
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_completed')
    .eq('user_id', user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect('/generate?already_onboarded=true');
  }

  return <OnboardingClient />;
}

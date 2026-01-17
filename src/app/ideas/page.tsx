import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { IdeasClient } from './ideas-client';

export default async function IdeasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return <IdeasClient />;
}

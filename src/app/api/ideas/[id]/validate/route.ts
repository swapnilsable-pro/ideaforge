import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { calculateSignalScore } from '@/lib/validation/signal-score';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch the idea
    const { data: idea, error: fetchError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Calculate signal score
    const scoreResult = calculateSignalScore(idea);

    // Update the idea with validation data
    const { error: updateError } = await supabase
      .from('ideas')
      .update({
        signal_score: scoreResult.total,
        validation_report: {
          breakdown: scoreResult.breakdown,
          recommendations: scoreResult.recommendations,
          validated_at: new Date().toISOString(),
        },
        last_validated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating validation:', updateError);
      return NextResponse.json({ error: 'Failed to save validation' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      score: scoreResult 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

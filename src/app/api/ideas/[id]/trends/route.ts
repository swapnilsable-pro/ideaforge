import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendData } from '@/lib/validation/trend-research';

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

    // Fetch trend data
    const trendAnalysis = await fetchTrendData(idea);

    // Update validation report with trend data
    const currentReport = idea.validation_report || {};
    const updatedReport = {
      ...currentReport,
      trends: trendAnalysis,
    };

    const { error: updateError } = await supabase
      .from('ideas')
      .update({
        validation_report: updatedReport,
        last_validated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating trend data:', updateError);
      return NextResponse.json({ error: 'Failed to save trend data' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      analysis: trendAnalysis 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

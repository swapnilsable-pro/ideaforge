import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { analyzeRisks } from '@/lib/validation/risk-analysis';

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

    // Analyze risks
    const riskAnalysis = analyzeRisks(idea);

    // Update validation report with risk data
    const currentReport = idea.validation_report || {};
    const updatedReport = {
      ...currentReport,
      risks: riskAnalysis,
    };

    const { error: updateError } = await supabase
      .from('ideas')
      .update({
        validation_report: updatedReport,
        last_validated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating risk data:', updateError);
      return NextResponse.json({ error: 'Failed to save risk data' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      analysis: riskAnalysis 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

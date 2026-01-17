import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAllAgents, MultiAgentCoordinator, AgentContext } from '@/lib/agents';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await params;
    const supabase = await createClient();

    // Verify user owns this idea
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', ideaId)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json(
        { success: false, error: 'Idea not found' },
        { status: 404 }
      );
    }

    // Get user profile for context
    const { data: { user } } = await supabase.auth.getUser();
    const { data: userProfile } = user
      ? await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
      : { data: null };

    // Create multi-agent analysis session
    const { data: analysisSession, error: sessionError } = await supabase
      .from('multi_agent_analyses')
      .insert({
        idea_id: ideaId,
        status: 'in_progress',
      })
      .select()
      .single();

    if (sessionError) {
      return NextResponse.json(
        { success: false, error: 'Failed to create analysis session' },
        { status: 500 }
      );
    }

    // Build agent context
    const context: AgentContext = {
      idea: {
        id: idea.id,
        title: idea.title,
        tagline: idea.tagline,
        problem_description: idea.problem_description,
        solution_description: idea.solution_description,
        target_audience: idea.target_audience,
        revenue_model: idea.revenue_model,
        business_model: idea.business_model,
        technology: idea.technology,
        key_features: idea.key_features || [],
      },
      userProfile: userProfile
        ? {
            skills: userProfile.skills || [],
            experience: userProfile.experience || [],
            expertise: userProfile.expertise || [],
            industries: userProfile.industries || [],
            network: userProfile.network || {},
            resources: userProfile.resources || {},
          }
        : undefined,
      previousReports: [],
    };

    // Initialize agents and coordinator
    const agents = createAllAgents();
    const coordinator = new MultiAgentCoordinator(agents);

    // Execute all agents sequentially
    const reports = await coordinator.executeAll(context);

    // Persist agent reports to database
    for (const report of reports) {
      await supabase.from('agent_reports').insert({
        idea_id: ideaId,
        agent_role: report.agent_role,
        summary: report.summary,
        key_insights: report.key_insights,
        recommendations: report.recommendations,
        concerns: report.concerns,
        confidence_score: report.confidence_score,
        metadata: report.metadata || {},
        execution_time_ms: report.execution_time_ms,
      });
    }

    // Generate synthesis
    const synthesis = coordinator.generateSynthesis(reports);

    // Update analysis session
    await supabase
      .from('multi_agent_analyses')
      .update({
        synthesis,
        status: 'complete',
        completed_at: new Date().toISOString(),
      })
      .eq('id', analysisSession.id);

    return NextResponse.json({
      success: true,
      analysis: {
        id: analysisSession.id,
        reports: reports.map(r => ({
          agent_role: r.agent_role,
          summary: r.summary,
          key_insights: r.key_insights,
          recommendations: r.recommendations,
          concerns: r.concerns,
          confidence_score: r.confidence_score,
          metadata: r.metadata,
        })),
        synthesis,
      },
    });
  } catch (error) {
    console.error('Multi-agent analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Multi-agent analysis failed' },
      { status: 500 }
    );
  }
}

// GET: Retrieve existing multi-agent analysis
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await params;
    const supabase = await createClient();

    // Get latest analysis for this idea
    const { data: analysis, error: analysisError } = await supabase
      .from('multi_agent_analyses')
      .select('*')
      .eq('idea_id', ideaId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json(
        { success: false, error: 'No analysis found' },
        { status: 404 }
      );
    }

    // Get all agent reports for this analysis
    const { data: reports } = await supabase
      .from('agent_reports')
      .select('*')
      .eq('idea_id', ideaId)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        reports: reports || [],
      },
    });
  } catch (error) {
    console.error('Fetch analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all ideas for the logged-in user
    const { data: ideas, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
      return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
    }

    return NextResponse.json({ success: true, ideas });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.job_story) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert new idea
    const { data: idea, error } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
        title: body.title,
        problem_title: body.problem_title || null,
        problem_source: body.problem_source || null,
        problem_description: body.problem_description,
        solution_description: body.solution_description,
        domain: body.domain || null,
        job_story: body.job_story,
        business_model: body.business_model || null,
        technology: body.technology || null,
        target_market: body.target_market || null,
        revenue_model: body.revenue_model || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving idea:', error);
      return NextResponse.json({ error: 'Failed to save idea' }, { status: 500 });
    }

    return NextResponse.json({ success: true, idea });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

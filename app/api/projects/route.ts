// API routes for user projects
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { databaseService } from '@/lib/database/databaseService';

// Supabase client for server-side verification
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


async function getCurrentUser(request: NextRequest) {
  // Get the access token from the Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Not authenticated');
  }
  const accessToken = authHeader.replace('Bearer ', '');
  // Verify the token with Supabase
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data?.user) {
    throw new Error('Invalid Supabase token');
  }
  return data.user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const projects = await databaseService.getProjectsByUserId(user.id);
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    
    if (error instanceof Error && error.message.includes('authenticated')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to get projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Log incoming request body
    const body = await request.json();
    console.log('Received project data:', body);


    // Get authenticated user from Supabase
    let user;
    try {
      user = await getCurrentUser(request);
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Add user_id to project data
    const projectDataWithUser = { ...body, user_id: user.id };

    // Pass all received fields to databaseService
    let project;
    try {
      project = await databaseService.createProject(projectDataWithUser);
      console.log('Supabase insert result:', project);
    } catch (dbError) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json({ error: 'Supabase insert error', details: dbError?.message }, { status: 500 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project', details: error?.message }, { status: 500 });
  }
}
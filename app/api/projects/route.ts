// API routes for user projects
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { databaseService } from '@/lib/database/databaseService';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

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

      // Check for duplicate project name for this user
      const projectName = body.project_name?.trim();
      if (projectName) {
        try {
          const { data: existingProjects, error: checkError } = await supabaseAdmin
            .from('projects')
            .select('id, project_name')
            .eq('user_id', user.id)
            .ilike('project_name', projectName);

          if (checkError) {
            console.error('Error checking for duplicate project name:', checkError);
          } else if (existingProjects && existingProjects.length > 0) {
            console.log('Duplicate project name found:', projectName);
            return NextResponse.json(
              { error: 'duplicate_name', message: 'A project with this name already exists. Please choose a different name.' },
              { status: 400 }
            );
          }
        } catch (duplicateCheckError) {
          console.error('Unexpected error checking duplicate:', duplicateCheckError);
          // Continue with creation if duplicate check fails
        }
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
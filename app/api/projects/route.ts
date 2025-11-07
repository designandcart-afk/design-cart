// API routes for user projects
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/authService';
import { databaseService } from '@/lib/database/databaseService';

async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const user = await authService.getUserFromToken(token);
  if (!user) {
    throw new Error('Invalid token');
  }
  
  return user;
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
    const user = await getCurrentUser(request);
    const body = await request.json();
    const { name, description, scope, budget } = body;

    if (!name || !description || !scope) {
      return NextResponse.json(
        { error: 'Name, description, and scope are required' },
        { status: 400 }
      );
    }

    const project = await databaseService.createProject({
      userId: user.id,
      name: name.trim(),
      description: description.trim(),
      scope: scope.trim(),
      budget: budget || undefined,
      status: 'active',
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    
    if (error instanceof Error && error.message.includes('authenticated')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
'use client';
import AuthGuard from '@/components/AuthGuard';
import { useProjects } from '@/lib/contexts/projectsContext';
import Link from 'next/link';
import { Card } from '@/components/UI';

export default function ProjectsPage(){
  const { projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <AuthGuard>
        <Card className="p-4">
          <div className="text-lg font-semibold mb-3">All Projects</div>
          <div className="text-center py-8 text-gray-500">Loading projects...</div>
        </Card>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Card className="p-4">
        <div className="text-lg font-semibold mb-3">All Projects</div>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No projects yet.</p>
            <p className="text-sm mt-2">Create your first project from the dashboard!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {projects.map(p=>(
              <Link key={p.id} href={`/projects/${p.id}`} className="border rounded-2xl p-3 bg-white hover:bg-black/5">
                <div className="font-medium text-brand-primary">{p.name}</div>
                <div className="text-sm text-black/60">{p.scope} · {p.status}</div>
                <div className="text-xs text-black/50 mt-1">{p.address}</div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </AuthGuard>
  );
}

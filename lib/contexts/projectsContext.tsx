'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { demoProjects, DemoProject, DemoUpload } from '@/lib/demoData';

interface ProjectsContextType {
  projects: DemoProject[];
  addProject: (project: Omit<DemoProject, 'id' | 'createdAt'>) => DemoProject;
  updateProject: (id: string, updates: Partial<DemoProject>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => DemoProject | undefined;
  isLoading: boolean;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const PROJECTS_KEY = 'dc:projects';

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { user, isDemo } = useAuth();
  const [projects, setProjects] = useState<DemoProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects when auth changes
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    if (isDemo) {
      // Demo mode - use demo projects
      setProjects(demoProjects);
    } else {
      // Real user - load from user-specific storage
      const userProjectsKey = `${PROJECTS_KEY}:${user.id}`;
      const stored = localStorage.getItem(userProjectsKey);
      
      if (stored) {
        try {
          const parsedProjects = JSON.parse(stored);
          setProjects(parsedProjects);
        } catch (error) {
          console.error('Failed to parse stored projects:', error);
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
    }
    
    setIsLoading(false);
  }, [user, isDemo]);

  const saveProjects = (newProjects: DemoProject[]) => {
    if (!user || isDemo) return;
    
    const userProjectsKey = `${PROJECTS_KEY}:${user.id}`;
    localStorage.setItem(userProjectsKey, JSON.stringify(newProjects));
  };

  const addProject = (projectData: Omit<DemoProject, 'id' | 'createdAt'>): DemoProject => {
    const newProject: DemoProject = {
      ...projectData,
      id: `p_${Date.now()}`,
      createdAt: Date.now(),
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<DemoProject>) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  const getProject = (id: string): DemoProject | undefined => {
    return projects.find(project => project.id === id);
  };

  const value: ProjectsContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProject,
    isLoading,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
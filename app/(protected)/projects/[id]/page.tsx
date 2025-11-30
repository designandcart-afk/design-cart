"use client";

import AuthGuard from "@/components/AuthGuard";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  demoProjects,
  demoRenders,
  demoProducts,
  demoProjectProducts,
  demoProductsAll,
} from "@/lib/demoData";
import { supabase } from '@/lib/supabase';
import { useProjects } from '@/lib/contexts/projectsContext';
import { Button, Badge, Input } from "@/components/UI";
import { MessageCircle, ClipboardList, FolderOpen, ChevronLeft, ChevronRight, X, Send, Paperclip, CalendarDays, Image as ImageIcon, PlusCircle, Trash2 } from "lucide-react";
import AreaModal from "@/components/AreaModal";
import CenterModal from "@/components/CenterModal";
import ChatMessage from "@/components/chat/ChatMessage";
import { storage, type ChatMessage as StorageChatMessage } from "@/lib/storage";
import { uploadFiles, UploadError, type UploadedFile } from "@/lib/uploadAdapter";
import { meetingService } from "@/lib/meetingService";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id as string;
  const router = useRouter();

  const { getProject, deleteProject: deleteProjectFromContext } = useProjects();
  const project = useMemo(() => {
    // Prefer project from context (real/demo), fallback to seeded demoProjects
    return getProject(projectId) ?? (demoProjects ?? []).find((p) => p.id === projectId);
  }, [projectId, getProject]);

  // All hooks must be called before any early returns
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [meetOpen, setMeetOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Record<string, 'renders' | 'screenshots'>>({});
  const [activeSlides, setActiveSlides] = useState<Record<string, { renders: number; screenshots: number }>>({});
  const [approvalStatus, setApprovalStatus] = useState<Record<string, {
    renders: Record<number, 'approved' | 'requested-change' | null>;
    screenshots: Record<number, 'approved' | 'requested-change' | null>;
  }>>({});
  
  // Lightbox state for fullscreen image view
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<Array<{ id: string; imageUrl: string }>>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxType, setLightboxType] = useState<'renders' | 'screenshots'>('renders');

  // Real chat functionality
  const [messages, setMessages] = useState<StorageChatMessage[]>([]);
  const [chatText, setChatText] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Area management
  const [addingArea, setAddingArea] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // File upload state
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Request change modal state
  const [requestChangeModal, setRequestChangeModal] = useState<{
    open: boolean;
    area: string;
    type: 'renders' | 'screenshots';
    index: number;
  } | null>(null);
  const [changeNotes, setChangeNotes] = useState("");

  // Force refresh of linked products when localStorage changes
  const [productRefreshKey, setProductRefreshKey] = useState(0);

  // Load linked products - must be before early return
  const [linked, setLinked] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [renders, setRenders] = useState<any[]>([]);

  // Define functions that will be used in useEffect
  async function loadChatMessages() {
    if (!projectId) return;
    try {
      setIsLoadingChat(true);
      const msgs = await storage.getMessages(projectId);
      if (msgs.length === 0) {
        // Seed welcome message
        const welcomeMsg: StorageChatMessage = {
          id: `m_${projectId}_welcome`,
          projectId,
          sender: "agent",
          text: `Hi, I'm your project assistant! 👋 Feel free to share your requirements, upload files, or ask me anything about your project.`,
          ts: Date.now(),
        };
        await storage.saveMessage(welcomeMsg);
        setMessages([welcomeMsg]);
      } else {
        setMessages(msgs);
      }
    } catch (err) {
      setChatError('Failed to load messages');
      console.error(err);
    } finally {
      setIsLoadingChat(false);
    }
  }

  // Handle approval
  const handleApprove = async (area: string, type: 'renders' | 'screenshots', index: number) => {
    setApprovalStatus(prev => ({
      ...prev,
      [area]: {
        ...prev[area],
        [type]: {
          ...prev[area]?.[type],
          [index]: 'approved'
        }
      }
    }));

    // Update Supabase
    if (!isDemoProject) {
      const items = type === 'renders' ? rendersForArea(area) : screenshotsFor(area);
      const item = items[index];
      if (item?.id) {
        const tableName = type === 'renders' ? 'project_renders' : 'project_screenshots';
        await supabase
          .from(tableName)
          .update({ 
            approval_status: 'approved',
            change_notes: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);
      }
    }
  };

  // Handle request change - open modal
  const handleRequestChange = (area: string, type: 'renders' | 'screenshots', index: number) => {
    setRequestChangeModal({ open: true, area, type, index });
    setChangeNotes("");
  };

  // Submit request change with notes
  const submitRequestChange = async () => {
    if (!requestChangeModal) return;
    const { area, type, index } = requestChangeModal;
    
    setApprovalStatus(prev => ({
      ...prev,
      [area]: {
        ...prev[area],
        [type]: {
          ...prev[area]?.[type],
          [index]: 'requested-change'
        }
      }
    }));

    // Update Supabase
    if (!isDemoProject) {
      const items = type === 'renders' ? rendersForArea(area) : screenshotsFor(area);
      const item = items[index];
      if (item?.id) {
        const tableName = type === 'renders' ? 'project_renders' : 'project_screenshots';
        await supabase
          .from(tableName)
          .update({ 
            approval_status: 'change_requested',
            change_notes: changeNotes.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);
      }
    }

    // Save the change request as a chat message
    if (changeNotes.trim() && projectId) {
      const msg: StorageChatMessage = {
        id: `m_${Date.now()}`,
        projectId,
        sender: "designer",
        text: `🔄 Change requested for ${area} - ${type}:\n${changeNotes}`,
        ts: Date.now(),
      };
      await storage.saveMessage(msg);
      setMessages(prev => [...prev, msg]);
    }

    setRequestChangeModal(null);
    setChangeNotes("");
  };

  // ...existing code...

  // Listen for changes to project products in localStorage
  useEffect(() => {
    if (!project) return; // Guard against null project
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dc:projectProducts') {
        setProductRefreshKey(prev => prev + 1);
      }
    };
    
    // Also listen for custom refresh events from same window
    const handleRefresh = () => {
      setProductRefreshKey(prev => prev + 1);
    };
    
    // Refresh when page becomes visible (user comes back from another tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setProductRefreshKey(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('projectProductsUpdated', handleRefresh);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial refresh on mount
    setProductRefreshKey(prev => prev + 1);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('projectProductsUpdated', handleRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [project]);

  // Load messages when chat opens
  useEffect(() => {
    if (chatOpen && projectId) {
      loadChatMessages();
    }
  }, [chatOpen, projectId]);

  // Load screenshots and renders from Supabase
  useEffect(() => {
    if (!project || project.id.startsWith('demo_')) return;
    
    async function loadScreenshotsAndRenders() {
      try {
        // Load screenshots
        const { data: screenshotsData, error: screenshotsError } = await supabase
          .from('project_screenshots')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: true });
        
        if (screenshotsError) {
          console.error('Error loading screenshots:', screenshotsError);
        } else {
          setScreenshots(screenshotsData || []);
        }

        // Load renders
        const { data: rendersData, error: rendersError } = await supabase
          .from('project_renders')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: true });
        
        if (rendersError) {
          console.error('Error loading renders:', rendersError);
        } else {
          setRenders(rendersData || []);
        }
      } catch (err) {
        console.error('Error loading screenshots/renders:', err);
      }
    }

    loadScreenshotsAndRenders();
  }, [project]);

  // Load linked products
  useEffect(() => {
    if (!project) return; // Guard against null project
    
    const isDemoProject = project.id.startsWith('demo_');
    if (isDemoProject) {
      setLinked((demoProjectProducts ?? []).filter((pp) => pp.projectId === project.id));
    } else {
      // For real user projects, fetch from both Supabase AND localStorage
      async function fetchLinked() {
        // First, get from Supabase
        const { data: supabaseData, error } = await supabase
          .from('project_products')
          .select('*, product:products(*)')
          .eq('project_id', project.id);
        
        if (error) {
          console.error('Failed to fetch project_products from Supabase:', error);
        }
        
        // Then, get from localStorage
        const localKey = "dc:projectProducts";
        const localData = JSON.parse(localStorage.getItem(localKey) || "[]");
        const localProjectProducts = localData.filter((pp: any) => pp.projectId === project.id);
        
        // Fetch product details for localStorage entries
        const localProductsWithDetails = await Promise.all(
          localProjectProducts.map(async (pp: any) => {
            const { data: productData } = await supabase
              .from('products')
              .select('*')
              .eq('id', pp.productId)
              .single();
            
            return {
              ...pp,
              product: productData,
            };
          })
        );
        
        // Combine both sources (Supabase + localStorage)
        const combined = [
          ...(supabaseData || []),
          ...localProductsWithDetails.filter(p => p.product), // Only include if product was found
        ];
        
        setLinked(combined);
      }
      fetchLinked();
    }
  }, [project, productRefreshKey]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
      }
    };

    if (lightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxOpen, lightboxImages.length]);

  // Early return AFTER all hooks to comply with Rules of Hooks
  if (!project) return <div className="container py-8">Project not found</div>;

  const projectCode = `#DAC-${project.id.slice(0, 6).toUpperCase()}`;
  
  // Check if this is a demo project (starts with "demo_") or a real user project
  const isDemoProject = project.id.startsWith('demo_');

  // Mock chat messages - only for demo projects
  const mockMessages = isDemoProject ? [
    {
      id: '1',
      projectId: project.id,
      senderId: 'demo-user-1',
      text: 'Hi, I have uploaded the latest renders.',
      timestamp: Date.now() - 3600000
    },
    {
      id: '2',
      projectId: project.id,
      senderId: 'designer',
      text: 'Thank you, I will review them shortly.',
      timestamp: Date.now() - 1800000
    }
  ] : [];

  // Mock files - only for demo projects
  const mockFiles = isDemoProject ? [
    {
      id: 'file1',
      projectId: project.id,
      type: 'pdf',
      url: 'https://example.com/floor-plan.pdf'
    },
    {
      id: 'file2',
      projectId: project.id,
      type: 'dwg',
      url: 'https://example.com/technical-drawing.dwg'
    }
  ] : [];

  const allRendersForProject = isDemoProject 
    ? (demoRenders ?? []).filter((r) => r.projectId === project.id)
    : renders;

  // Derive areas: use project's areas (user-provided) or empty array for real users
  const derivedFromLinks = Array.from(new Set(linked.map((l) => l.area))).filter(Boolean) as string[];
  const derivedFromRenders = Array.from(new Set(allRendersForProject.map((r) => r.area).filter(Boolean) as string[]));
  const derivedFromScreenshots = Array.from(new Set(screenshots.map((s) => s.area).filter(Boolean) as string[]));
  const areas = (project.areas && project.areas.length)
    ? project.areas
    : project.area
      ? [project.area]
      : (isDemoProject ? (derivedFromLinks.length ? derivedFromLinks : (derivedFromRenders.length ? derivedFromRenders : [])) : (derivedFromScreenshots.length ? derivedFromScreenshots : []));

  // Screenshots from Supabase for real projects, mock for demo
  // ...existing code...

  // Renders for area
  const rendersForArea = (area: string) => {
    const filtered = allRendersForProject.filter((r) => r.area === area);
    // Map database field to UI field for non-demo projects
    if (!isDemoProject) {
      return filtered.map((r) => ({
        ...r,
        imageUrl: r.image_url,
      }));
    }
    return filtered;
  };

  // Get status buttons for renders/screenshots
  const getStatusButtons = (area: string, type: 'renders' | 'screenshots', index: number) => {
    // Check Supabase data first for real projects
    if (!isDemoProject) {
      const items = type === 'renders' ? rendersForArea(area) : screenshotsFor(area);
      const item = items[index];
      if (item?.approval_status) {
        if (item.approval_status === 'approved') {
          return (
            <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              ✓ Approved
            </div>
          );
        }
        if (item.approval_status === 'change_requested') {
          return (
            <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              🔄 Change Requested
            </div>
          );
        }
      }
    }
    // Fallback to local state for demo projects
    const status = approvalStatus[area]?.[type]?.[index];
    if (status === 'approved') {
      return (
        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          ✓ Approved
        </div>
      );
    }
    if (status === 'requested-change') {
      return (
        <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          🔄 Change Requested
        </div>
      );
    }
    return (
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleApprove(area, type, index);
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg"
        >
          ✓ Approve
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRequestChange(area, type, index);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg"
        >
          🔄 Request Change
        </button>
      </div>
    );
  };

  // Screenshots from Supabase for real projects, mock for demo
  const screenshotsFor = (area: string) => {
    if (isDemoProject) {
      return [1, 2].map((n) => ({
        id: `${area}-${n}`,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(area + n)}/1200/800`,
      }));
    }
    return screenshots
      .filter((s) => s.area === area)
      .map((s) => ({
        ...s,
        imageUrl: s.image_url, // Map database field to UI field
      }));
  };

  // ...existing code...

  const productsFor = (area: string) => {
    if (isDemoProject) {
      return linked
        .filter((l) => l.area === area)
        .map((l) => (demoProductsAll ?? []).find((p) => p.id === l.productId))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map((p) => ({
          id: p.id,
          title: p.title,
          imageUrl: p.imageUrl,
          price: p.price,
        }));
    } else {
      return linked
        .filter((l) => l.area === area && l.product)
        .map((l) => ({
          id: l.product.id,
          title: l.product.title || l.product.name || 'Product',
          imageUrl: l.product.image_url || l.product.imageUrl,
          price: l.product.price || l.product.selling_price || 0,
        }));
    }
  };

  // Get unique products with their counts for display
  const getUniqueProductsWithCount = (area: string) => {
    const products = productsFor(area);
    const productMap = new Map<string, { product: typeof products[0], count: number }>();
    
    products.forEach(p => {
      if (productMap.has(p.id)) {
        productMap.get(p.id)!.count++;
      } else {
        productMap.set(p.id, { product: p, count: 1 });
      }
    });
    
    return Array.from(productMap.values());
  };

  async function sendChat(text?: string, attachments?: UploadedFile[], meetingInfo?: StorageChatMessage['meetingInfo']) {
    const messageText = text || chatText;
    if (!messageText.trim() && !attachments?.length) return;
    
    try {
      const msg: StorageChatMessage = {
        id: `m_${Date.now()}`,
        projectId,
        sender: "designer",
        text: messageText.trim(),
        ts: Date.now(),
        ...(attachments && { attachments }),
        ...(meetingInfo && { meetingInfo }),
      };
      await storage.saveMessage(msg);
      setMessages(prev => [...prev, msg]);
      setChatText("");
    } catch (err) {
      setChatError('Failed to send message');
      console.error(err);
    }
  }

  async function handleChatUpload(files: FileList, type: 'image' | 'file') {
    try {
      setIsLoadingChat(true);
      const uploaded = await uploadFiles(
        Array.from(files).map(file => ({
          file,
          type,
          projectId
        }))
      );
      await sendChat(
        `Shared ${uploaded.length} ${type}${uploaded.length > 1 ? 's' : ''}`,
        uploaded
      );
    } catch (err) {
      if (err instanceof UploadError) {
        setChatError(err.message);
      } else {
        setChatError('Failed to upload files');
      }
      console.error(err);
    } finally {
      setIsLoadingChat(false);
    }
  }

  async function scheduleChatMeeting() {
    try {
      setIsLoadingChat(true);
      const date = new Date();
      date.setMinutes(Math.ceil(date.getMinutes() / 30) * 30);

      const meeting = await meetingService.createMeeting({
        projectId,
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().split(':').slice(0, 2).join(':'),
        duration: 30,
        title: `Design Consultation - ${project.name}`,
      });

      // Create calendar event
      const calendarUrl = meetingService.getCalendarEvent(meeting);

      await sendChat(
        "I've scheduled a meeting.",
        undefined,
        {
          ...meeting,
          status: 'scheduled'
        }
      );

      // Open calendar event in new tab
      window.open(calendarUrl, '_blank');
    } catch (err) {
      setChatError('Failed to schedule meeting');
      console.error(err);
    } finally {
      setIsLoadingChat(false);
    }
  }

  const files = mockFiles;

  // Add new area to project
  const { updateProject } = useProjects();
  
  const handleAddArea = async () => {
    if (!newAreaName.trim()) return;

    const currentAreas = project.areas || (project.area ? [project.area] : []);
    const updatedAreas = [...currentAreas, newAreaName.trim()];

    // Update local context first for immediate UI feedback
    updateProject(project.id, {
      areas: updatedAreas
    });

    // Update Supabase projects table with new areas array
    if (!isDemoProject) {
      try {
        const { error: projectError } = await supabase
          .from('projects')
          .update({ areas: updatedAreas })
          .eq('id', project.id);

        if (projectError) {
          console.error('Error updating project areas in Supabase:', projectError);
        }

        // Also insert into project_areas table for detailed tracking
        const areaId = `AREA_${Date.now()}`;
        const now = new Date().toISOString();
        const { error: areaError } = await supabase
          .from('project_areas')
          .insert([
            {
              id: areaId,
              project_id: project.id,
              area_name: newAreaName.trim(),
              area_type: '',
              status: 'created',
              created_at: now,
              updated_at: now,
            },
          ]);

        if (areaError) {
          console.error('Error inserting project area into Supabase:', areaError);
        }
      } catch (error) {
        console.error('Error saving area:', error);
      }
    }

    setNewAreaName("");
    setAddingArea(false);
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      // Delete from Supabase if it's a real project
      if (!isDemoProject) {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', project.id);
        
        if (error) {
          console.error('Error deleting project:', error);
          alert('Failed to delete project. Please try again.');
          setIsDeleting(false);
          return;
        }
      }
      
      // Remove from context (this will update the dashboard immediately)
      deleteProjectFromContext(project.id);
      
      // Navigate back to dashboard
      router.push('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setUploadingFiles(true);
    setUploadError(null);
    
    try {
      const uploaded = await uploadFiles(
        Array.from(files).map(file => ({
          file,
          type: 'file',
          projectId
        }))
      );
      
      // Refresh files list or show success message
      alert(`Successfully uploaded ${uploaded.length} file(s)`);
      
      // You can add the files to a state or refetch them here
    } catch (err) {
      if (err instanceof UploadError) {
        setUploadError(err.message);
      } else {
        setUploadError('Failed to upload files');
      }
      console.error(err);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleApproval = (area: string, type: 'renders' | 'screenshots', index: number, status: 'approved' | 'requested-change') => {
    setApprovalStatus(prev => {
      const areaStatus = prev[area] || { renders: {}, screenshots: {} };
      return {
        ...prev,
        [area]: {
          ...areaStatus,
          [type]: {
            ...areaStatus[type],
            [index]: status
          }
        }
      };
    });
  };

  const getStatus = (area: string, type: 'renders' | 'screenshots', index: number) => {
    return approvalStatus[area]?.[type]?.[index] || null;
  };

  // Open lightbox for renders/screenshots
  const openLightbox = (area: string, type: 'renders' | 'screenshots', index: number) => {
    const images = type === 'renders' ? rendersForArea(area) : screenshotsFor(area);
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxType(type);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  return (
    <AuthGuard>
      <div className="py-4 bg-[#f4f3f0] -mx-4 px-4 rounded-2xl">
        {/* Back Button - Top Left */}
        <div className="mb-3">
          <Button
            variant="outline"
            onClick={() => history.back()}
            className="px-3 py-1.5 text-sm text-black/70 hover:bg-gray-100 border-black/20 inline-flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to dashboard
          </Button>
        </div>

        <div className="relative bg-white/90 border rounded-2xl p-5 shadow-lg shadow-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[28px] font-semibold leading-tight">
                {project.name}
              </h1>
              <div className="text-sm text-black/60">{projectCode}</div>

              <div className="mt-3">
                <div className="text-sm font-semibold">Address</div>
                <div>{project.address || "—"}</div>
              </div>

              {/* Details = Notes entered at creation */}
              <div className="mt-3">
                <div className="text-sm font-semibold">Details</div>
                {project.notes ? (
                  <div className="text-black/80 whitespace-pre-wrap">
                    {project.notes}
                  </div>
                ) : (
                  <div className="text-black/60">—</div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {project.scope && (
                  <Badge className="text-[13px] px-3 py-1">{project.scope}</Badge>
                )}
                {project.status && (
                  <Badge className="text-[13px] px-3 py-1">{project.status}</Badge>
                )}
              </div>
            </div>

            {/* Action Buttons - Icon Only */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setChatOpen(true)}
                className="flex items-center justify-center w-10 h-10 p-0 text-[#d96857] hover:bg-[#d96857] hover:text-white border-[#d96857]/30 transition-all"
                title="Chat"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setMeetOpen(true)}
                className="flex items-center justify-center w-10 h-10 p-0 text-[#d96857] hover:bg-[#d96857] hover:text-white border-[#d96857]/30 transition-all"
                title="Meeting Summary"
              >
                <ClipboardList className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilesOpen(true)}
                className="flex items-center justify-center w-10 h-10 p-0 text-[#d96857] hover:bg-[#d96857] hover:text-white border-[#d96857]/30 transition-all"
                title="Files"
              >
                <FolderOpen className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center w-10 h-10 p-0 text-red-600 hover:bg-red-600 hover:text-white border-red-600/30 transition-all"
                title="Delete Project"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Combined Documents Section - Demo Only */}
        {isDemoProject && (
        <div className="relative bg-white border rounded-2xl p-5 shadow-lg shadow-black/5 mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* View Quote Button */}
            <button
              onClick={() => {
                const quoteSection = document.getElementById('quote-files');
                if (quoteSection) {
                  quoteSection.classList.toggle('hidden');
                }
              }}
              className="flex-1 flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-black/10 hover:border-[#d96857]/30 hover:bg-[#faf8f6] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#d96857]/10 flex items-center justify-center group-hover:bg-[#d96857]/20 transition-colors">
                  <span className="text-[#d96857] font-bold text-sm">₹</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#2e2e2e] text-sm">View Quote</div>
                  <div className="text-xs text-black/50">3 files</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-black/30 group-hover:text-[#d96857] transition-colors" />
            </button>

            {/* View Files Button */}
            <button
              onClick={() => {
                const filesSection = document.getElementById('designer-files');
                if (filesSection) {
                  filesSection.classList.toggle('hidden');
                }
              }}
              className="flex-1 flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-black/10 hover:border-[#d96857]/30 hover:bg-[#faf8f6] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#d96857]/10 flex items-center justify-center group-hover:bg-[#d96857]/20 transition-colors">
                  <FolderOpen className="w-5 h-5 text-[#d96857]" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#2e2e2e] text-sm">View Files</div>
                  <div className="text-xs text-black/50">6 files</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-black/30 group-hover:text-[#d96857] transition-colors" />
            </button>
          </div>

          {/* Quote Files - Expandable */}
          <div id="quote-files" className="hidden mt-4 pt-4 border-t border-black/5">
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-[#2e2e2e]">Shared Quote</h4>
              <p className="text-xs text-black/50">Bill and quotation documents</p>
            </div>
            <div className="space-y-1 mt-3">
              {[
                { id: 'q1', name: 'Project Quotation - Final.pdf', type: 'PDF', url: 'https://example.com/quotation.pdf' },
                { id: 'q2', name: 'Cost Breakdown.xlsx', type: 'XLSX', url: 'https://example.com/cost-breakdown.xlsx' },
                { id: 'q3', name: 'Payment Schedule.pdf', type: 'PDF', url: 'https://example.com/payment-schedule.pdf' }
              ].map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-[#faf8f6] transition-all group"
                >
                  <span className="text-xs font-semibold text-[#d96857] bg-[#d96857]/10 px-2 py-0.5 rounded min-w-[45px] text-center">
                    {file.type}
                  </span>
                  <span className="text-sm text-[#2e2e2e]/80 group-hover:text-[#d96857] group-hover:underline transition-colors">
                    {file.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Designer Files - Expandable */}
          <div id="designer-files" className="hidden mt-4 pt-4 border-t border-black/5">
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-[#2e2e2e]">Designer Files</h4>
              <p className="text-xs text-black/50">Technical drawings and specifications</p>
            </div>
            <div className="space-y-1 mt-3">
              {[
                { id: 'df1', name: 'Floor Plan - Final.pdf', type: 'PDF', url: 'https://example.com/floor-plan.pdf' },
                { id: 'df2', name: 'Material Specifications.xlsx', type: 'XLSX', url: 'https://example.com/materials.xlsx' },
                { id: 'df3', name: 'Lighting Layout.dwg', type: 'DWG', url: 'https://example.com/lighting.dwg' },
                { id: 'df4', name: 'Color Palette Guide.pdf', type: 'PDF', url: 'https://example.com/colors.pdf' },
                { id: 'df5', name: 'Product List with Links.xlsx', type: 'XLSX', url: 'https://example.com/products.xlsx' },
                { id: 'df6', name: 'Electrical Points Layout.pdf', type: 'PDF', url: 'https://example.com/electrical.pdf' }
              ].map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-[#faf8f6] transition-all group"
                >
                  <span className="text-xs font-semibold text-[#d96857] bg-[#d96857]/10 px-2 py-0.5 rounded min-w-[45px] text-center">
                    {file.type}
                  </span>
                  <span className="text-sm text-[#2e2e2e]/80 group-hover:text-[#d96857] group-hover:underline transition-colors">
                    {file.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Quote by Team Section */}
        <div className="relative bg-gradient-to-br from-[#d96857]/5 to-[#d96857]/10 border-2 border-[#d96857]/20 rounded-2xl p-6 shadow-lg shadow-black/5 mt-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#d96857] flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2e2e2e] mb-1">Quote by Team</h3>
                <p className="text-sm text-[#2e2e2e]/70">View detailed quotations and documents from our team</p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/projects/${project.id}/quotes`)}
              className="bg-[#d96857] text-white hover:bg-[#c85745] px-6 py-2.5 flex items-center gap-2 shadow-md"
            >
              View Quote
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="h-px bg-black/10 my-6 rounded-full" />

        {/* Areas Section */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#2e2e2e]">Design Areas</h2>
            <p className="text-sm text-[#2e2e2e]/60 mt-1">
              Organize your project by rooms or spaces
            </p>
          </div>
          <Button
            onClick={() => setAddingArea(true)}
            className="bg-[#d96857] text-white hover:bg-[#c85745] px-4 py-2 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Area
          </Button>
        </div>

        {areas.length === 0 ? (
          <div className="bg-white border rounded-2xl p-8 text-center shadow-lg shadow-black/5">
            <div className="text-[#2e2e2e]/40 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#2e2e2e] mb-2">No Areas Added Yet</h3>
            <p className="text-sm text-[#2e2e2e]/60 mb-4">
              Click "Add Area" to create your first design area (e.g., Living Room, Kitchen, Bedroom).
            </p>
            <p className="text-xs text-[#2e2e2e]/50">
              Areas help organize your design work by room or space.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {areas.map((area, idx) => {
            const areaRenders = rendersForArea(area).slice(0, 2);
            const areaScreens = screenshotsFor(area);
            const areaProducts = productsFor(area);
            const uniqueProductsWithCount = getUniqueProductsWithCount(area);

            return (
              <div
                key={area}
                className={`relative rounded-2xl p-3 shadow-lg shadow-black/5 border transition ${
                  idx % 2 ? "bg-[#faf8f6]" : "bg-white"
                } hover:shadow-xl hover:-translate-y-[1px]`}
              >
                <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#d96857] rounded-r-full" />
                <div className="mb-2 pl-2">
                  <div className="text-lg font-semibold">{area}</div>
                </div>

                <div className="pl-2">
                  <div className="mb-3 flex gap-2 bg-[#f7f4f2] p-1 rounded-xl inline-flex">
                    <button 
                      className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                        (activeTab[area] || 'renders') === 'renders' 
                          ? 'bg-white text-[#d96857] shadow-sm' 
                          : 'text-gray-600 hover:text-[#2e2e2e]'
                      }`}
                      onClick={() => setActiveTab(prev => ({ ...prev, [area]: 'renders' }))}
                    >
                      Renders
                    </button>
                    <button 
                      className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                        (activeTab[area] || 'renders') === 'screenshots' 
                          ? 'bg-white text-[#d96857] shadow-sm' 
                          : 'text-gray-600 hover:text-[#2e2e2e]'
                      }`}
                      onClick={() => setActiveTab(prev => ({ ...prev, [area]: 'screenshots' }))}
                    >
                      Screenshots
                    </button>
                  </div>
                  
                  <div className="relative rounded-2xl overflow-hidden bg-[#f7f4f2] border">
                    {(activeTab[area] || 'renders') === 'renders' ? (
                      areaRenders.length > 0 ? (
                        <div className="relative">
                          <img
                            src={areaRenders[activeSlides[area]?.renders || 0]?.imageUrl}
                            className="w-full h-[400px] object-cover cursor-pointer"
                            alt="render"
                            onClick={() => openLightbox(area, 'renders', activeSlides[area]?.renders || 0)}
                          />
                          {areaRenders.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSlides(prev => {
                                    const currentArea = prev[area] || { renders: 0, screenshots: 0 };
                                    const currentIndex = currentArea.renders || 0;
                                    return {
                                      ...prev,
                                      [area]: {
                                        ...currentArea,
                                        renders: currentIndex > 0 ? currentIndex - 1 : areaRenders.length - 1
                                      }
                                    };
                                  });
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
                              >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSlides(prev => {
                                    const currentArea = prev[area] || { renders: 0, screenshots: 0 };
                                    const currentIndex = currentArea.renders || 0;
                                    return {
                                      ...prev,
                                      [area]: {
                                        ...currentArea,
                                        renders: currentIndex < areaRenders.length - 1 ? currentIndex + 1 : 0
                                      }
                                    };
                                  });
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
                              >
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                              </button>
                            </>
                          )}
                          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                            {getStatusButtons(area, 'renders', activeSlides[area]?.renders || 0)}
                          </div>
                        </div>
                      ) : (
                        <div className="h-[400px] flex items-center justify-center text-sm text-black/50">
                          No renders yet
                        </div>
                      )
                    ) : (
                      areaScreens.length > 0 ? (
                        <div className="relative">
                          <img
                            src={areaScreens[activeSlides[area]?.screenshots || 0]?.imageUrl}
                            className="w-full h-[400px] object-cover cursor-pointer"
                            alt="screenshot"
                            onClick={() => openLightbox(area, 'screenshots', activeSlides[area]?.screenshots || 0)}
                          />
                          {areaScreens.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSlides(prev => {
                                    const currentArea = prev[area] || { renders: 0, screenshots: 0 };
                                    const currentIndex = currentArea.screenshots || 0;
                                    return {
                                      ...prev,
                                      [area]: {
                                        ...currentArea,
                                        screenshots: currentIndex > 0 ? currentIndex - 1 : areaScreens.length - 1
                                      }
                                    };
                                  });
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
                              >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSlides(prev => {
                                    const currentArea = prev[area] || { renders: 0, screenshots: 0 };
                                    const currentIndex = currentArea.screenshots || 0;
                                    return {
                                      ...prev,
                                      [area]: {
                                        ...currentArea,
                                        screenshots: currentIndex < areaScreens.length - 1 ? currentIndex + 1 : 0
                                      }
                                    };
                                  });
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
                              >
                              <ChevronRight className="w-6 h-6 text-gray-700" />
                            </button>
                          </>
                          )}
                          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                            {getStatusButtons(area, 'screenshots', activeSlides[area]?.screenshots || 0)}
                          </div>
                        </div>
                      ) : (
                        <div className="h-[400px] flex items-center justify-center text-sm text-black/50">
                          No screenshots yet
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-3 pl-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-medium text-black/70">Products</div>
                      {areaProducts.length > 0 && (
                        <div className="px-2 py-0.5 bg-[#d96857] text-white text-[10px] font-semibold rounded-full">
                          {areaProducts.length}
                        </div>
                      )}
                    </div>
                    <button
                      className="text-xs font-medium text-[#d96857] hover:text-[#c85745] transition-colors flex items-center gap-1"
                      onClick={() => setOpenArea(area)}
                    >
                      Product details →
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {uniqueProductsWithCount.map(({ product: p, count }) => (
                      <div
                        key={p.id}
                        className="flex-shrink-0 cursor-pointer group relative"
                        onClick={() => setOpenArea(area)}
                      >
                        <div className="relative w-[80px] h-[80px] rounded-lg overflow-visible">
                          <img
                             src={p.imageUrl}
                             className="w-full h-full object-cover rounded-lg border border-black/5 group-hover:border-[#d96857]/30 transition-all group-hover:shadow-md"
                             alt={p.title}
                          />
                          {/* Product count badge */}
                          {
                            count > 1 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#d96857] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20">
                              {count}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* Add more products button when products exist */}
                    {areaProducts.length > 0 && (
                      <button
                        onClick={() => router.push('/products')}
                        className="flex-shrink-0 w-[80px] h-[80px] rounded-lg border-2 border-dashed border-[#d96857]/30 hover:border-[#d96857]/60 bg-[#d96857]/5 hover:bg-[#d96857]/10 transition-all flex items-center justify-center group"
                      >
                        <svg className="w-8 h-8 text-[#d96857]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}
                    {areaProducts.length === 0 && (
                      <button
                        onClick={() => router.push('/products')}
                        className="text-xs text-[#2e2e2e]/60 py-3 px-4 bg-gradient-to-br from-[#d96857]/5 to-[#d96857]/10 rounded-xl border border-[#d96857]/20 hover:border-[#d96857]/40 hover:from-[#d96857]/10 hover:to-[#d96857]/15 transition-all flex items-center gap-2 group"
                      >
                        <svg className="w-4 h-4 text-[#d96857]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-medium">Add Products</span>
                        <span className="text-[#2e2e2e]/40 group-hover:text-[#d96857] transition-colors">→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {openArea && (
        <AreaModal
          open={true}
          onClose={() => setOpenArea(null)}
          area={openArea}
          products={productsFor(openArea)}
          projectAddress={project.address || ""}
        />
      )}

      {/* Chat */}
      <CenterModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title={`Project Chat - ${project.name}`}
        maxWidth="max-w-4xl"
      >
        {chatError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center justify-between">
            <span>{chatError}</span>
            <Button
              className="p-1 hover:bg-red-100 rounded-full"
              onClick={() => setChatError(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="h-[60vh] overflow-y-auto bg-[#f9f9f8] p-4 rounded-xl mb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-3 flex ${
                m.sender === "designer" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  m.sender === "designer"
                    ? "bg-[#d96857] text-white"
                    : "bg-white text-[#2e2e2e] border border-zinc-200"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                
                {/* Meeting Info */}
                {m.meetingInfo && (
                  <div className={`mt-2 p-3 rounded-lg ${
                    m.sender === "designer" ? "bg-[#c85745]" : "bg-zinc-100"
                  }`}>
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <CalendarDays className="w-4 h-4" />
                      <span className="font-medium">Meeting Scheduled</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>Date: {m.meetingInfo.date}</div>
                      <div>Time: {m.meetingInfo.time}</div>
                      <div>Duration: {m.meetingInfo.duration} minutes</div>
                      <a 
                        href={m.meetingInfo.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                          m.sender === "designer" 
                            ? "bg-white text-[#d96857]" 
                            : "bg-[#d96857] text-white"
                        }`}
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {m.attachments && m.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {m.attachments.map((att, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded-lg flex items-center gap-2 ${
                          m.sender === "designer" ? "bg-[#c85745]" : "bg-zinc-100"
                        }`}
                      >
                        {att.type === 'image' ? (
                          <ImageIcon className="w-4 h-4" />
                        ) : (
                          <Paperclip className="w-4 h-4" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{att.name}</div>
                          {att.size && (
                            <div className="text-[10px] opacity-70">
                              {Math.round(att.size / 1024)}KB
                            </div>
                          )}
                        </div>
                        <a 
                          href={att.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`p-1 rounded-full ${
                            m.sender === "designer" 
                              ? "hover:bg-[#c85745]" 
                              : "hover:bg-zinc-200"
                          }`}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-1 text-[10px] opacity-70">
                  {new Date(m.ts).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          {(!messages || messages.length === 0) && !isLoadingChat && (
            <div className="text-sm text-black/60 text-center py-8">No messages yet. Start the conversation!</div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mb-3">
          <Button
            className="flex items-center gap-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded-full"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip';
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files?.length) {
                  handleChatUpload(files, 'file');
                }
              };
              input.click();
            }}
            disabled={isLoadingChat}
          >
            <Paperclip className="w-3 h-3" />
            Add Files
          </Button>
          
          <Button
            className="flex items-center gap-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded-full"
            onClick={scheduleChatMeeting}
            disabled={isLoadingChat}
          >
            <CalendarDays className="w-3 h-3" />
            Schedule Meeting
          </Button>
          
          <Button
            className="flex items-center gap-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded-full"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = true;
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files?.length) {
                  handleChatUpload(files, 'image');
                }
              };
              input.click();
            }}
            disabled={isLoadingChat}
          >
            <ImageIcon className="w-3 h-3" />
            Add Images
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Type a message…"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              className="w-full rounded-2xl pr-10"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (chatText.trim()) {
                    sendChat();
                  }
                }
              }}
              disabled={isLoadingChat}
            />
          </div>
          <Button
            onClick={() => chatText.trim() && sendChat()}
            disabled={isLoadingChat || !chatText.trim()}
            className="rounded-2xl bg-[#d96857] text-white px-4 py-2 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoadingChat ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </Button>
        </div>
      </CenterModal>

      {/* Meeting summary */}
      <CenterModal
        open={meetOpen}
        onClose={() => setMeetOpen(false)}
        title="Meeting Summary"
        maxWidth="max-w-3xl"
      >
        <div className="text-center py-12">
          <div className="text-[#2e2e2e]/40 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#2e2e2e] mb-2">No Meeting Summaries Yet</h3>
          <p className="text-sm text-[#2e2e2e]/60 mb-4 max-w-md mx-auto">
            Meeting summaries will be automatically generated after your first meeting with us.
          </p>
          <p className="text-xs text-[#2e2e2e]/50">
            Schedule a meeting from the chat to get started!
          </p>
        </div>
      </CenterModal>

      {/* Add Area Modal */}
      <CenterModal
        open={addingArea}
        onClose={() => {
          setAddingArea(false);
          setNewAreaName("");
        }}
        title="Add New Area"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2e2e2e] mb-2">
              Area Name
            </label>
            <Input
              placeholder="e.g., Living Room, Master Bedroom, Kitchen"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newAreaName.trim()) {
                  handleAddArea();
                }
              }}
              className="w-full"
              autoFocus
            />
            <p className="text-xs text-[#2e2e2e]/50 mt-2">
              Give this area a descriptive name to help organize your design work.
            </p>
          </div>

          {/* Quick suggestions */}
          <div>
            <div className="text-xs font-medium text-[#2e2e2e]/70 mb-2">Quick suggestions:</div>
            <div className="flex flex-wrap gap-2">
              {['Living Room', 'Master Bedroom', 'Kitchen', 'Bathroom', 'Dining Area', 'Study Room', 'Guest Bedroom', 'Balcony'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setNewAreaName(suggestion)}
                  className="px-3 py-1 text-xs rounded-full bg-[#d96857]/10 text-[#d96857] hover:bg-[#d96857] hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleAddArea}
              disabled={!newAreaName.trim()}
              className="flex-1 bg-[#d96857] text-white hover:bg-[#c85745] disabled:opacity-50"
            >
              Add Area
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAddingArea(false);
                setNewAreaName("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CenterModal>

      {/* Files */}
      <CenterModal
        open={filesOpen}
        onClose={() => {
          setFilesOpen(false);
          setUploadError(null);
        }}
        title="Project Files"
        maxWidth="max-w-4xl"
      >
        {/* Upload Section */}
        <div className="mb-6 p-4 border-2 border-dashed border-[#d96857]/30 rounded-2xl bg-[#d96857]/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#2e2e2e] mb-1">Upload Files</h3>
              <p className="text-xs text-[#2e2e2e]/60">Add documents, images, or any project-related files</p>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                id="file-upload-input"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(e.target.files);
                    e.target.value = ''; // Reset input
                  }
                }}
                className="hidden"
                disabled={uploadingFiles}
              />
              <Button
                onClick={() => document.getElementById('file-upload-input')?.click()}
                disabled={uploadingFiles}
                className="bg-[#d96857] text-white hover:bg-[#c85745] px-4 py-2 flex items-center gap-2 disabled:opacity-50"
              >
                {uploadingFiles ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium">Choose Files</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          {uploadError && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {uploadError}
            </div>
          )}
        </div>

        {/* Files List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(files ?? []).map((f) => (
            <a
              key={f.id}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="border rounded-2xl p-3 hover:bg-black/5 transition-all hover:shadow-md"
            >
              <div className="text-xs text-black/60 mb-1">{f.type.toUpperCase()}</div>
              <div className="flex items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-[#d96857]/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-[#d96857]">{f.type.toUpperCase()}</span>
                </div>
                <div className="truncate text-sm">{f.url.split('/').pop() || 'File'}</div>
              </div>
            </a>
          ))}
          {(!files || files.length === 0) && (
            <div className="col-span-full text-center py-8">
              <div className="text-[#2e2e2e]/40 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-[#2e2e2e]/60">No files uploaded yet</p>
              <p className="text-xs text-[#2e2e2e]/40 mt-1">Click "Choose Files" to upload documents</p>
            </div>
          )}
        </div>
      </CenterModal>

      {/* Fullscreen Lightbox for Renders/Screenshots */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all z-10 border border-white/20"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
            {lightboxIndex + 1} / {lightboxImages.length}
          </div>

          {/* Main Image */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImages[lightboxIndex]?.imageUrl}
              alt={`${lightboxType} ${lightboxIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />

            {/* Navigation Arrows */}
            {lightboxImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevLightboxImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-2xl flex items-center justify-center transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-7 h-7 text-[#2e2e2e]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextLightboxImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-2xl flex items-center justify-center transition-all hover:scale-110"
                >
                  <ChevronRight className="w-7 h-7 text-[#2e2e2e]" />
                </button>
              </>
            )}
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/70 text-xs border border-white/20">
            Press ESC to close • Use arrow keys to navigate
          </div>
        </div>
      )}

      {/* Area Products Modal */}
      {openArea && (
        <AreaModal
          open={!!openArea}
          onClose={() => setOpenArea(null)}
          area={openArea}
          products={productsFor(openArea)}
          projectAddress={project.address || ''}
          projectId={project.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      <CenterModal
        open={showDeleteConfirm}
        onClose={() => !isDeleting && setShowDeleteConfirm(false)}
        title="Delete Project?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-900">Warning: This action cannot be undone</h3>
              <p className="text-xs text-red-700 mt-1">
                All project data, files, and chat history will be permanently deleted.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-[#2e2e2e] font-medium mb-1">Project Details:</p>
            <div className="text-xs text-[#2e2e2e]/70 space-y-1">
              <div><span className="font-medium">Name:</span> {project.name}</div>
              <div><span className="font-medium">Code:</span> {projectCode}</div>
              {project.address && <div><span className="font-medium">Address:</span> {project.address}</div>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Yes, Delete Project</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CenterModal>

      {/* Request Change Modal */}
      {requestChangeModal?.open && (
        <CenterModal
          open={requestChangeModal.open}
          onClose={() => {
            setRequestChangeModal(null);
            setChangeNotes("");
          }}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#2e2e2e] mb-4">
              Request Changes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please describe what changes you'd like to see in this {requestChangeModal.type === 'renders' ? 'render' : 'screenshot'} for {requestChangeModal.area}:
            </p>
            <textarea
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="Describe the changes you want..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d96857]/50 resize-none text-sm"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setRequestChangeModal(null);
                  setChangeNotes("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitRequestChange}
                disabled={!changeNotes.trim()}
                className="flex-1 px-4 py-2.5 bg-[#d96857] text-white rounded-xl hover:bg-[#c85745] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </div>
          </div>
        </CenterModal>
      )}
    </AuthGuard>
  );
}

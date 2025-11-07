"use client";

import AuthGuard from "@/components/AuthGuard";
import { useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  demoProjects,
  demoRenders,
  demoProducts,
  demoProjectProducts,
  extraDemoProducts,
  demoProductsAll,
} from "@/lib/demoData";
import {
  getProjectAreas,
  getProjectRenders,
  getProjectProducts,
  generateScreenshotsForArea,
} from "@/lib/projectTemplate";
import { useAuth } from "@/lib/auth/authContext";
import { Button, Badge, Input } from "@/components/UI";
import { MessageCircle, ClipboardList, FolderOpen, ChevronLeft, ChevronRight, X } from "lucide-react";
import AreaModal from "@/components/AreaModal";
import CenterModal from "@/components/CenterModal";
import ChatMessage from "@/components/chat/ChatMessage";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id as string;
  const { isDemo, user } = useAuth();

  // Load project data based on demo mode or real user
  const [project, setProject] = useState<any>(null);
  const [allRenders, setAllRenders] = useState<any[]>([]);
  const [allProductLinks, setAllProductLinks] = useState<any[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  useEffect(() => {
    if (isDemo) {
      // Demo mode - use demo data
      const demoProject = demoProjects.find((p) => p.id === projectId);
      setProject(demoProject);
      setAllRenders(demoRenders || []);
      setAllProductLinks(demoProjectProducts || []);
    } else if (user) {
      // Real user mode - load from localStorage
      const userProjectsKey = `dc:projects:${user.id}`;
      const userProjects = JSON.parse(localStorage.getItem(userProjectsKey) || '[]');
      const userProject = userProjects.find((p: any) => p.id === projectId);
      
      if (userProject) {
        setProject(userProject);
        
        // Load user-specific renders
        const userRendersKey = `dc:renders:${user.id}`;
        const userRenders = JSON.parse(localStorage.getItem(userRendersKey) || '[]');
        setAllRenders(userRenders);
        
        // Load user-specific product links
        const userLinksKey = `dc:projectProducts:${user.id}`;
        const userLinks = JSON.parse(localStorage.getItem(userLinksKey) || '[]');
        setAllProductLinks(userLinks);
      }
    }
  }, [projectId, isDemo, user]);

  useEffect(() => {
    if (project && user && !isDemo) {
      const projectAreas = getProjectAreas(projectId, user.id);
      setAreas(projectAreas);
    } else if (project && isDemo) {
      // Demo mode areas
      const linked = (demoProjectProducts ?? []).filter(
        (pp) => pp.projectId === project.id
      );
      const allRendersForProject = (demoRenders ?? []).filter(
        (r) => r.projectId === project.id
      );
      const derivedFromLinks = Array.from(new Set(linked.map((l) => l.area))).filter(Boolean) as string[];
      const derivedFromRenders = Array.from(new Set(allRendersForProject.map((r) => r.area).filter(Boolean) as string[]));
      const demoAreas = (derivedFromLinks.length ? derivedFromLinks : derivedFromRenders).length > 0
        ? (derivedFromLinks.length ? derivedFromLinks : derivedFromRenders)
        : ["Living Room", "Dining", "Bedroom", "Kitchen"];
      setAreas(demoAreas);
    }
  }, [project, projectId, user, isDemo]);

  if (!project) return <div className="container py-8">Project not found</div>;

  const projectCode = `#DAC-${project.id.slice(0, 6).toUpperCase()}`;

  // Mock chat messages
  const mockMessages = [
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
  ];

  // Mock files
  const mockFiles = [
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
  ];

  // Helper functions to get data for specific areas
  const screenshotsFor = (area: string) => {
    if (isDemo) {
      return [1, 2].map((n) => ({
        id: `${area}-${n}`,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(area + n)}/1200/800`,
      }));
    } else {
      return generateScreenshotsForArea(area);
    }
  };

  const productsFor = (area: string) => {
    const productCatalog = isDemo ? demoProducts : demoProductsAll;
    const relevantLinks = allProductLinks.filter((l) => l.projectId === projectId && l.area === area);
    
    return relevantLinks
      .map((l) => productCatalog?.find((p) => p.id === l.productId))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({
        id: p.id,
        title: p.title,
        imageUrl: p.imageUrl,
        price: p.price,
      }));
  };

  const rendersForArea = (area: string) => {
    return allRenders.filter((r) => r.projectId === projectId && r.area === area);
  };

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

  const messages = mockMessages;
  const [chatText, setChatText] = useState("");
  function sendChat() {
    if (!chatText.trim()) return;
    alert("Message sent (demo).");
    setChatText("");
  }
  const files = mockFiles;

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

  const getStatusButtons = (area: string, type: 'renders' | 'screenshots', index: number) => {
    const status = getStatus(area, type, index);
    if (status) {
      return (
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm">
          {status === 'approved' ? '✓ Approved' : '⟲ Change Requested'}
        </div>
      );
    }
    return (
      <>
        <Button 
          className="bg-[#d96857] text-white px-6" 
          onClick={() => handleApproval(area, type, index, 'approved')}
        >
          Approve
        </Button>
        <Button 
          variant="outline" 
          className="bg-white px-6" 
          onClick={() => handleApproval(area, type, index, 'requested-change')}
        >
          Request Change
        </Button>
      </>
    );
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      }
    };

    if (lightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxOpen, lightboxImages.length]);

  return (
    <AuthGuard>
      <div className="py-4 bg-[#f4f3f0] -mx-4 px-4 rounded-2xl">
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

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => history.back()}
                  className="px-4 text-black/70 hover:bg-gray-100"
                >
                  Back
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setChatOpen(true)}
                  className="flex items-center justify-center w-10 h-10 p-0 text-[#d96857] hover:bg-[#d96857] hover:text-white"
                  title="Chat"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setMeetOpen(true)}
                  className="flex items-center justify-center w-10 h-10 p-0 text-[#d96857] hover:bg-[#d96857] hover:text-white"
                  title="Meeting Summary"
                >
                  <ClipboardList className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFilesOpen(true)}
                  className="flex items-center justify-center w-10 h-10 p-0 text-[#d96857] hover:bg-[#d96857] hover:text-white"
                  title="Files"
                >
                  <FolderOpen className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Documents Section */}
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

        <div className="h-px bg-black/10 my-6 rounded-full" />

        <div className="grid sm:grid-cols-2 gap-5">
          {areas.map((area, idx) => {
            const areaRenders = rendersForArea(area).slice(0, 2);
            const areaScreens = screenshotsFor(area);
            const areaProducts = productsFor(area);

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
                    <div className="text-xs font-medium text-black/70">Products</div>
                    <button
                      className="text-xs font-medium text-[#d96857] hover:text-[#c85745] transition-colors flex items-center gap-1"
                      onClick={() => setOpenArea(area)}
                    >
                      Product details →
                    </button>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {areaProducts.slice(0, 6).map((p) => (
                      <div
                        key={p.id}
                        className="flex-shrink-0 cursor-pointer group"
                        onClick={() => setOpenArea(area)}
                      >
                        <img
                          src={p.imageUrl}
                          className="w-[150px] h-[150px] object-cover rounded-xl border border-black/5 group-hover:border-[#d96857]/30 transition-all group-hover:shadow-md"
                          alt={p.title}
                        />
                      </div>
                    ))}
                    {areaProducts.length === 0 && (
                      <div className="text-xs text-black/50 py-3 px-4 bg-white/60 rounded-xl border border-black/5">
                        No products linked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
        title="Project Chat"
        maxWidth="max-w-3xl"
      >
        <div className="max-h-[60vh] overflow-auto pr-2 mb-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.senderId === 'demo-user-1' ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  m.senderId === 'demo-user-1' 
                    ? 'bg-[#d96857] text-white' 
                    : 'bg-gray-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          {(!messages || messages.length === 0) && (
            <div className="text-sm text-black/60">No messages yet.</div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
          />
          <Button onClick={sendChat}>Send</Button>
        </div>
      </CenterModal>

      {/* Meeting summary */}
      <CenterModal
        open={meetOpen}
        onClose={() => setMeetOpen(false)}
        title="Meeting Summary"
        maxWidth="max-w-3xl"
      >
        <div className="text-sm">
          <div className="font-medium mb-1">24 Oct — Kickoff</div>
          <ul className="list-disc pl-4 space-y-1 text-black/80">
            <li>Finalize living room palette</li>
            <li>Dining pendant options to share</li>
            <li>Upload DWG for kitchen by Friday</li>
          </ul>
          <div className="font-medium mt-4 mb-1">18 Oct — Intake</div>
          <ul className="list-disc pl-4 space-y-1 text-black/80">
            <li>Site photos received</li>
            <li>Floor plan PDF uploaded</li>
          </ul>
        </div>
      </CenterModal>

      {/* Files */}
      <CenterModal
        open={filesOpen}
        onClose={() => setFilesOpen(false)}
        title="Project Files"
        maxWidth="max-w-4xl"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(files ?? []).map((f) => (
            <a
              key={f.id}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="border rounded-2xl p-3 hover:bg-black/5"
            >
              <div className="text-xs text-black/60 mb-1">{f.type.toUpperCase()}</div>
              <div className="flex items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center">
                  <span className="text-xs">{f.type.toUpperCase()}</span>
                </div>
                <div className="truncate">{f.url}</div>
              </div>
            </a>
          ))}
          {(!files || files.length === 0) && (
            <div className="text-sm text-black/60">No files uploaded.</div>
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
    </AuthGuard>
  );
}

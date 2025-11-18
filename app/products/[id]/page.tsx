"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { demoProductsAll } from "@/lib/demoData";
import { Button, Select, Card, Badge } from "@/components/UI";
import { useAuth } from "@/lib/auth/authContext";
import { useProjects } from "@/lib/contexts/projectsContext";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = useMemo(
    () => demoProductsAll.find((p) => p.id === id),
    [id]
  );

  const { user } = useAuth();
  const { projects } = useProjects();
  const isLoggedIn = !!user;
  const authEmail = user?.email || null;

  // Filter to only show user's own projects (not demo projects)
  const userProjects = useMemo(() => {
    return projects.filter(p => !p.id.startsWith('demo_'));
  }, [projects]);

  const [projectId, setProjectId] = useState("");
  const [area, setArea] = useState("");
  const [note, setNote] = useState("");

  // Set initial project when userProjects load
  useEffect(() => {
    if (userProjects.length > 0 && !projectId) {
      setProjectId(userProjects[0].id);
    }
  }, [userProjects, projectId]);

  // Get areas for the selected project
  const selectedProject = useMemo(() => {
    return userProjects.find(p => p.id === projectId);
  }, [userProjects, projectId]);

  const availableAreas = useMemo(() => {
    // Support both new `areas` array and legacy `area` string
    if (selectedProject?.areas && selectedProject.areas.length > 0) {
      return selectedProject.areas;
    }
    // Fallback to legacy single area field
    if (selectedProject?.area) {
      return [selectedProject.area];
    }
    return [];
  }, [selectedProject]);

  // Set initial area when project changes
  useEffect(() => {
    if (availableAreas.length > 0) {
      setArea(availableAreas[0]);
    } else {
      setArea("");
    }
  }, [availableAreas]);

  if (!product) {
    return (
      <main className="p-10 text-center text-zinc-600">Product not found.</main>
    );
  }

  // Store "Add to Design" links in localStorage (so we don't mutate your demoData.ts)
  function addLinkToLocal(projectId: string, productId: string, area: string, note?: string) {
    const key = "dc:projectProducts";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const entry = {
      id: `pp_${Date.now()}`,
      projectId,
      productId,
      area,
      note: note || "",
      createdAt: Date.now(),
    };
    list.push(entry);
    localStorage.setItem(key, JSON.stringify(list));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('projectProductsUpdated'));
  }

  function handleAddToDesign() {
    if (!projectId) return alert("Please choose a project.");
    if (!area) return alert("Please select an area. Add areas to your project if needed.");
    const projectName = selectedProject?.name || projectId;
    addLinkToLocal(projectId, product.id, area, note);
    alert(`Added "${product.title}" to ${projectName} (${area}).`);
    setNote("");
  }

  return (
    <main className="min-h-screen bg-[#efeee9]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/products')}
          className="mb-6 flex items-center gap-2 text-[#2e2e2e] hover:text-[#d96857] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </button>

        {/* Product Card */}
        <Card className="overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left: Image */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#f9f8f7] border border-[#2e2e2e]/10">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Info + Actions */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-[#2e2e2e] leading-tight">
                    {product.title}
                  </h1>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {product.category && (
                      <Badge>
                        {product.category}
                      </Badge>
                    )}
                    {product.roomType && (
                      <Badge>
                        {product.roomType}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="text-2xl font-semibold text-[#d96857]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>
                  {product.rating && (
                    <Badge className="flex items-center gap-2 bg-[#f9f8f7]">
                      <span className="text-yellow-500">★</span>
                      <span>{product.rating}</span>
                    </Badge>
                  )}
                </div>

                {product.description && (
                  <p className="text-[#2e2e2e]/70 leading-relaxed border-t border-[#2e2e2e]/10 pt-4">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Designer Actions */}
              {isLoggedIn ? (
                <div className="space-y-4 border-t border-[#2e2e2e]/10 pt-6">
                  {userProjects.length === 0 ? (
                    <div className="text-center py-4 text-[#2e2e2e]/60">
                      <p className="mb-3">No projects yet. Create a project first to add products.</p>
                      <Button
                        onClick={() => {
                          window.location.href = '/';
                        }}
                        className="w-full"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#2e2e2e] mb-2">
                          Select Project
                        </label>
                        <Select
                          value={projectId}
                          onChange={(e) => setProjectId(e.target.value)}
                        >
                          {userProjects.map((pj) => (
                            <option key={pj.id} value={pj.id}>
                              {pj.name}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2e2e2e] mb-2">
                          Select Area
                        </label>
                        {availableAreas.length === 0 ? (
                          <div className="text-sm text-[#2e2e2e]/60 p-3 bg-[#f9f8f7] border border-[#2e2e2e]/10 rounded-xl">
                            No areas in this project. Add areas from the project page.
                          </div>
                        ) : (
                          <Select
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                          >
                            {availableAreas.map((ar) => (
                              <option key={ar} value={ar}>
                                {ar}
                              </option>
                            ))}
                          </Select>
                        )}
                      </div>
                    </>
                  )}

                  {userProjects.length > 0 && (
                    <>
                      <textarea
                        placeholder="Add a note (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full min-h-[100px] resize-none border border-[#2e2e2e]/10 rounded-xl p-3 bg-[#f9f8f7] text-[#2e2e2e] placeholder:text-[#2e2e2e]/40 focus:outline-none focus:ring-2 focus:ring-[#d96857]/30"
                      />

                      <Button
                        onClick={handleAddToDesign}
                        className="w-full"
                        disabled={!projectId || !area || availableAreas.length === 0}
                      >
                        Add to Design
                      </Button>
                    </>
                  )}

                  <p className="text-sm text-[#2e2e2e]/60 text-center">
                    Logged in as{" "}
                    <span className="text-[#d96857] font-medium">
                      {authEmail}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="border-t border-[#2e2e2e]/10 pt-6 text-center space-y-4">
                  <p className="text-[#2e2e2e]/70">
                    Sign in to add this product to your design projects.
                  </p>
                  <Button
                    onClick={() => {
                      window.location.href = '/login';
                    }}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Product Details */}
        <div className="mt-8 space-y-6">
          {/* Full Description */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#2e2e2e] mb-4">Product Details</h3>
            <p className="text-[#2e2e2e]/70 text-sm leading-relaxed">
              {product.description || 'This high-quality product has been carefully selected for our catalog to ensure realistic 3D visualization and reliable sourcing options for your interior design projects.'}
            </p>
          </Card>

          {/* Specifications Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[#2e2e2e] mb-4">Basic Info</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-[#2e2e2e]/60">Category</span>
                  <span className="text-[#2e2e2e] font-medium">{product.category}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-[#2e2e2e]/60">Room Type</span>
                  <span className="text-[#2e2e2e] font-medium">{product.roomType}</span>
                </div>
                {product.color && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-[#2e2e2e]/60">Color</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-[#2e2e2e]/10"
                        style={{ backgroundColor: product.color }}
                      />
                      <span className="text-[#2e2e2e] font-medium">
                        {product.color.startsWith('#') ? 'Custom' : product.color}
                      </span>
                    </div>
                  </div>
                )}
                {product.rating && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-[#2e2e2e]/60">Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-[#2e2e2e] font-medium">{product.rating}/5</span>
                    </div>
                  </div>
                )}
                {product.isNew && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-[#2e2e2e]/60">Status</span>
                    <Badge className="w-fit bg-[#d96857]/10 text-[#d96857] border-[#d96857]/20">New Arrival</Badge>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[#2e2e2e] mb-4">Pricing</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-[#2e2e2e]/60">Price</span>
                  <span className="text-[#d96857] font-semibold text-lg">₹{product.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-[#2e2e2e]/60">GST (18%)</span>
                  <span className="text-[#2e2e2e] font-medium">₹{Math.round(product.price * 0.18).toLocaleString("en-IN")}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm border-t border-[#2e2e2e]/10 pt-3">
                  <span className="text-[#2e2e2e]/60">Total</span>
                  <span className="text-[#2e2e2e] font-semibold">₹{Math.round(product.price * 1.18).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[#2e2e2e] mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-[#2e2e2e]/60">Stock Status</span>
                  <Badge className="w-fit bg-green-100 text-green-700 border-green-200">In Stock</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-[#2e2e2e]/60">Delivery</span>
                  <span className="text-[#2e2e2e] font-medium">2-4 weeks</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-[#2e2e2e]/60">Warranty</span>
                  <span className="text-[#2e2e2e] font-medium">1 Year</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#2e2e2e] mb-4">Additional Information</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-[#2e2e2e]">Features</h4>
                <ul className="list-disc list-inside space-y-1 text-[#2e2e2e]/70">
                  <li>Premium quality materials</li>
                  <li>Professional assembly available</li>
                  <li>Easy care and maintenance</li>
                  <li>Eco-friendly manufacturing</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-[#2e2e2e]">Care Instructions</h4>
                <ul className="list-disc list-inside space-y-1 text-[#2e2e2e]/70">
                  <li>Clean with soft, damp cloth</li>
                  <li>Avoid harsh chemicals</li>
                  <li>Keep away from direct sunlight</li>
                  <li>Follow manufacturer guidelines</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

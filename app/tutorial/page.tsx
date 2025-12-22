'use client';

import { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  FolderPlus, 
  ShoppingBag, 
  CheckCircle, 
  Image as ImageIcon, 
  ShoppingCart, 
  CreditCard,
  Package,
  FileText
} from 'lucide-react';

interface TutorialSection {
  id: string;
  title: string;
  icon: any;
}

const tutorialSections: TutorialSection[] = [
  { id: 'getting-started', title: 'Getting Started', icon: LogIn },
  { id: 'create-project', title: 'Create Project', icon: FolderPlus },
  { id: 'add-products', title: 'Add Products', icon: ShoppingBag },
  { id: 'review-approve', title: 'Review & Approve Designs', icon: CheckCircle },
  { id: 'view-renders', title: 'View Renders', icon: ImageIcon },
  { id: 'add-to-cart', title: 'Add to Cart', icon: ShoppingCart },
  { id: 'checkout', title: 'Checkout', icon: CreditCard },
  { id: 'track-orders', title: 'Track Orders', icon: Package },
  { id: 'bills-invoices', title: 'Bills & Invoices', icon: FileText },
];

export default function TutorialPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':

        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Getting Started</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Create your account or sign in to access your professional dashboard.
            </p>

            {/* Dashboard Screenshot */}
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border border-[#2e2e2e]/10 overflow-hidden">
              <img
                src="/screenshots/dashboard.png"
                alt="Dashboard Screenshot"
                className="object-contain max-h-full max-w-full"
              />
            </div>

            <div className="bg-[#f8f7f4] rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Quick Start</h3>
              <ul className="space-y-2 text-[#2e2e2e]/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Sign up with your business email or sign in if you already have an account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Complete your profile to unlock all features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Explore the dashboard and start creating projects</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Use your work email for seamless communication and quick verification.
              </p>
            </div>
          </div>
        );

      case 'create-project':

        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Create Project</h2>
            <p className="text-[#2e2e2e]/70 text-lg">Start a new project to organize your design work and product selections.</p>

            {/* Flex layout: image left, content right */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-xl p-8 border-2 border-dashed border-[#2e2e2e]/20">
              <div className="md:w-1/2 w-full flex justify-center">
                <img
                  src="/screenshots/create-project.png"
                  alt="Create Project Screenshot"
                  className="object-contain max-h-96 rounded-lg border"
                />
              </div>
              <div className="md:w-1/2 w-full space-y-4">
                <h3 className="text-xl font-semibold text-[#2e2e2e]">How to Create a Project</h3>
                <ol className="space-y-3 text-[#2e2e2e]/70">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                    <span>Click "Create Project" on your dashboard.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                    <span>Enter the project name and select the scope (e.g., 2BHK, Villa).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                    <span>Add areas/rooms, address, pincode, and any notes.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">4</span>
                    <span>Upload reference files if needed.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">5</span>
                    <span>Save to create your project card.</span>
                  </li>
                </ol>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Add detailed notes and files to keep all project info in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'add-products':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Add Products</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Curate and assign products to each area of your project.
            </p>

            {/* Product Catalog Screenshots */}
            <div className="space-y-6">
              {/* Main Add Products Interface */}
              <div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
                <div className="space-y-4">
                  <div className="w-full flex justify-center">
                    <img
                      src="/screenshots/add-products.png"
                      alt="Add Products Screenshot"
                      className="object-contain max-h-96 rounded-lg border shadow-sm"
                    />
                  </div>
                  <p className="text-center text-sm text-[#2e2e2e]/40 pt-2">Screenshot: Product selection interface</p>
                </div>
              </div>

              {/* Product Catalog Browser */}
              <div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
                <div className="space-y-4">
                  <div className="w-full flex justify-center">
                    <img
                      src="/screenshots/product-catalog.png"
                      alt="Product Catalog Screenshot"
                      className="object-contain max-h-96 rounded-lg border shadow-sm"
                    />
                  </div>
                  <p className="text-center text-sm text-[#2e2e2e]/40 pt-2">Screenshot: Product catalog with filters and categories</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Steps:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Browse the product catalog using filters.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Select a product to view details.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Click "Add to Project" and choose the relevant project and room.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">4</span>
                  <span>Repeat for all required products.</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Use filters to quickly find products by category, style, or price.
              </p>
            </div>
          </div>
        );

      case 'review-approve':

        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Review & Approve Designs</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Preview your design layouts and ensure everything is as planned.
            </p>

            {/* Review & Approve Screenshot */}
            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
              <div className="space-y-4">
                <div className="w-full flex justify-center">
                  <img
                    src="/screenshots/review-approve.png"
                    alt="Review & Approve Screenshot"
                    className="object-contain max-h-96 rounded-lg border shadow-sm"
                  />
                </div>
                <p className="text-center text-sm text-[#2e2e2e]/40 pt-2">Screenshot: Design review and approval interface</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Steps:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Open your project and navigate to the area/room.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Review the design previews (screenshots).</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Approve the design or request changes as needed.</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Leave clear feedback when requesting changes for faster updates.
              </p>
            </div>
          </div>
        );

      case 'view-renders':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">View Renders</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              See high-quality 3D renders of your approved designs.
            </p>

            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]/10">
                  <h3 className="text-lg font-semibold text-[#2e2e2e]">Final 3D Renders</h3>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ Approved</div>
                </div>
                <div className="space-y-3">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-[#2e2e2e]/30 font-medium">High-Quality 3D Render</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-[#d96857] text-white text-sm rounded-lg">Download All</button>
                  <button className="flex-1 py-2 bg-gray-200 text-[#2e2e2e] text-sm rounded-lg">Share</button>
                </div>
                <p className="text-center text-sm text-[#2e2e2e]/40 pt-2">Screenshot: 3D render gallery</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Steps:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Go to the "Renders" tab in your project.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>View the final 3D images for each area.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Approve the renders or request adjustments.</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Download renders for presentations or client meetings.
              </p>
            </div>
          </div>
        );

      case 'add-to-cart':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Add to Cart</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Prepare your order by adding approved products to your cart.
            </p>

            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]/10">
                  <h3 className="text-lg font-semibold text-[#2e2e2e]">Approved Products</h3>
                  <button className="px-4 py-1.5 bg-[#d96857] text-white text-sm rounded-lg">Add All to Cart</button>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <button className="px-3 py-1.5 bg-[#d96857] text-white text-xs rounded-lg">Add to Cart</button>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-[#2e2e2e]/40 pt-2">Screenshot: Product list with add to cart buttons</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Steps:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>In your project, view the list of approved products.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Select the products you wish to order.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Click "Add to Cart" for each item.</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Add all required products at once to streamline checkout.
              </p>
            </div>
          </div>
        );

      case 'checkout':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Checkout</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Place your order securely and confirm your purchase.
            </p>

            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2e2e2e] pb-3 border-b border-[#2e2e2e]/10">Shopping Cart</h3>
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-14 h-14 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="text-sm font-semibold text-[#2e2e2e]">₹12,500</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#f8f7f4] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹25,000</span></div>
                  <div className="flex justify-between text-sm"><span>GST (18%)</span><span>₹4,500</span></div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-[#2e2e2e]/10"><span>Total</span><span>₹29,500</span></div>
                </div>
                <button className="w-full py-3 bg-[#d96857] text-white font-medium rounded-lg">Proceed to Checkout</button>
                <p className="text-center text-sm text-[#2e2e2e]/40 pt-2">Screenshot: Cart with checkout button</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Steps:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Review your cart for accuracy.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Confirm quantities and delivery details.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Click "Checkout" and complete payment.</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Save your billing and shipping info for faster future orders.
              </p>
            </div>
          </div>
        );

      case 'track-orders':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Track Orders</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Monitor your order status and delivery progress in real time.
            </p>

            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2e2e2e] pb-3 border-b border-[#2e2e2e]/10">My Orders</h3>
                <div className="space-y-3">
                  {[
                    { status: 'Delivered', color: 'green', order: '#ORD-001' },
                    { status: 'Shipped', color: 'blue', order: '#ORD-002' },
                    { status: 'Processing', color: 'yellow', order: '#ORD-003' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#2e2e2e]">{item.order}</span>
                        <div className={`px-3 py-1 bg-${item.color}-100 text-${item.color}-700 text-xs rounded-full`}>{item.status}</div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      <button className="text-[#d96857] text-sm font-medium">View Details →</button>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-[#2e2e2e]/40 pt-2">Screenshot: Order list with status tracking</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Steps:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Go to the "Orders" section from your dashboard.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>View the status of each order (Processing, Shipped, Delivered).</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Click on an order for detailed tracking and updates.</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Enable notifications to get real-time order updates.
              </p>
            </div>
          </div>
        );

      case 'bills-invoices':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Bills & Invoices</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Easily access and download all your project-wise bills and invoices.
            </p>

            <div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]/10">
                  <h3 className="text-lg font-semibold text-[#2e2e2e]">Bills & Invoices</h3>
                  <button className="px-3 py-1 bg-gray-200 text-[#2e2e2e] text-sm rounded-lg">Filter ▼</button>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-[#d96857]/10 rounded flex items-center justify-center">
                        <div className="text-[#d96857] text-xs font-bold">PDF</div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <button className="px-4 py-1.5 bg-[#d96857] text-white text-xs rounded-lg">Download</button>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-[#2e2e2e]/40 pt-2">Screenshot: Invoice list with download options</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Steps:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Open the "Bills & Invoices" tab in your dashboard or project.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Find invoices for each completed order.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Download or print invoices as needed for your records.</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Keep your invoices organized for smooth accounting and GST compliance.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#efeee9]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2e2e2e] mb-2">Tutorial</h1>
          <p className="text-[#2e2e2e]/60">Learn how to use Design&Cart step by step</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-[#2e2e2e]/10 p-4 sticky top-24">
              <nav className="space-y-1">
                {tutorialSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-[#d96857] text-white shadow-sm'
                          : 'text-[#2e2e2e]/70 hover:bg-[#f8f7f4]'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-[#2e2e2e]/10 p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

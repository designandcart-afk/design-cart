'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  FolderPlus, 
  ShoppingBag, 
  Upload, 
  CheckCircle, 
  Image as ImageIcon, 
  ShoppingCart, 
  CreditCard,
  Package
} from 'lucide-react';

interface TutorialSection {
  id: string;
  title: string;
  icon: any;
}

const tutorialSections: TutorialSection[] = [
  { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
  { id: 'create-project', title: 'Create Project', icon: FolderPlus },
  { id: 'add-products', title: 'Add Products', icon: ShoppingBag },
  { id: 'upload-screenshots', title: 'Upload Screenshots', icon: Upload },
  { id: 'approval-process', title: 'Approval Process', icon: CheckCircle },
  { id: 'view-renders', title: 'View Renders', icon: ImageIcon },
  { id: 'add-to-cart', title: 'Add to Cart', icon: ShoppingCart },
  { id: 'checkout', title: 'Checkout', icon: CreditCard },
  { id: 'track-orders', title: 'Track Orders', icon: Package },
];

export default function TutorialPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Welcome to Design&Cart</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Learn how to use our platform to bring your interior design visions to life.
            </p>
            
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border border-[#2e2e2e]/10">
              <div className="text-center space-y-2">
                <BookOpen className="w-16 h-16 mx-auto text-[#2e2e2e]/30" />
                <p className="text-[#2e2e2e]/50">Tutorial video will appear here</p>
                <p className="text-sm text-[#2e2e2e]/40">YouTube embed placeholder</p>
              </div>
            </div>

            <div className="bg-[#f8f7f4] rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">What You'll Learn</h3>
              <ul className="space-y-2 text-[#2e2e2e]/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>How to create and manage your design projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Browse and select products for your designs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Upload screenshots and get professional renders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Place orders and track deliveries</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'create-project':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Create Your First Project</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Start by creating a project for the room you want to design.
            </p>

            <div className="bg-gray-100 rounded-xl p-8 border border-[#2e2e2e]/10">
              <p className="text-center text-[#2e2e2e]/50">Screenshot placeholder</p>
              <p className="text-center text-sm text-[#2e2e2e]/40 mt-2">Dashboard → Create Project button</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Steps:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Click the "Create New Project" button on your Dashboard</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Enter your project name (e.g., "Living Room Makeover")</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Select the room type from the dropdown</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">4</span>
                  <span>Enter the area in square feet</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">5</span>
                  <span>Click "Create" to save your project</span>
                </li>
              </ol>
            </div>
          </div>
        );

      case 'add-products':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Add Products to Your Design</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Browse our catalog and add products to your project.
            </p>

            <div className="bg-gray-100 rounded-xl p-8 border border-[#2e2e2e]/10">
              <p className="text-center text-[#2e2e2e]/50">Screenshot placeholder</p>
              <p className="text-center text-sm text-[#2e2e2e]/40 mt-2">Products page with filters</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">How to Add Products:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Navigate to the Products page from the top menu</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Use filters to narrow down by category, room type, or price</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Click "Add to Project" on any product you like</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">4</span>
                  <span>Select which project to add it to from the modal</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">5</span>
                  <span>Continue browsing and adding more products</span>
                </li>
              </ol>
            </div>
          </div>
        );

      case 'upload-screenshots':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Upload Your Design Screenshots</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Show us how you've placed products in your space.
            </p>

            <div className="bg-gray-100 rounded-xl p-8 border border-[#2e2e2e]/10">
              <p className="text-center text-[#2e2e2e]/50">Screenshot placeholder</p>
              <p className="text-center text-sm text-[#2e2e2e]/40 mt-2">Screenshot upload area</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Upload Process:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Open your project from the Dashboard</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Go to the "Screenshots" tab</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Drag and drop images or click to browse</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">4</span>
                  <span>Wait for upload to complete</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">5</span>
                  <span>Your screenshots will show "Pending" status</span>
                </li>
              </ol>
            </div>
          </div>
        );

      case 'approval-process':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Understanding the Approval Process</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Learn what happens after you upload screenshots.
            </p>

            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border border-[#2e2e2e]/10">
              <div className="text-center space-y-2">
                <CheckCircle className="w-16 h-16 mx-auto text-[#2e2e2e]/30" />
                <p className="text-[#2e2e2e]/50">Approval process video will appear here</p>
                <p className="text-sm text-[#2e2e2e]/40">YouTube embed placeholder</p>
              </div>
            </div>

            <div className="bg-[#f8f7f4] rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Approval Timeline</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2e2e2e]">Pending Review</h4>
                    <p className="text-sm text-[#2e2e2e]/60">Your screenshots are queued for admin review</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2e2e2e]">Under Review</h4>
                    <p className="text-sm text-[#2e2e2e]/60">Admin is checking your design layout (24-48 hours)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2e2e2e]">Approved</h4>
                    <p className="text-sm text-[#2e2e2e]/60">Professional renders are created and available!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'view-renders':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">View Your Professional Renders</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Once approved, beautiful renders of your design will be available.
            </p>

            <div className="bg-gray-100 rounded-xl p-8 border border-[#2e2e2e]/10">
              <p className="text-center text-[#2e2e2e]/50">Screenshot placeholder</p>
              <p className="text-center text-sm text-[#2e2e2e]/40 mt-2">Renders tab with images</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">What You Can Do:</h3>
              <ul className="space-y-2 text-[#2e2e2e]/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>View high-resolution render images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Zoom in to see details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Download renders for your records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Add all products to cart if you're ready to order</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'add-to-cart':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Add Products to Cart</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Ready to purchase? Add your approved products to the cart.
            </p>

            <div className="bg-gray-100 rounded-xl p-8 border border-[#2e2e2e]/10">
              <p className="text-center text-[#2e2e2e]/50">Screenshot placeholder</p>
              <p className="text-center text-sm text-[#2e2e2e]/40 mt-2">Add to cart button</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">How to Add:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Go to the Renders tab in your approved project</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Click "Add All to Cart" to add all products at once</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Or add individual products from the Products tab</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">4</span>
                  <span>Navigate to Cart page to review your items</span>
                </li>
              </ol>
            </div>
          </div>
        );

      case 'checkout':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Complete Your Purchase</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Review your cart and proceed to secure checkout.
            </p>

            <div className="bg-gray-100 rounded-xl p-8 border border-[#2e2e2e]/10">
              <p className="text-center text-[#2e2e2e]/50">Screenshot placeholder</p>
              <p className="text-center text-sm text-[#2e2e2e]/40 mt-2">Cart page with checkout button</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Checkout Steps:</h3>
              <ol className="space-y-3 text-[#2e2e2e]/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">1</span>
                  <span>Review items in your cart</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">2</span>
                  <span>Adjust quantities if needed</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">3</span>
                  <span>Check the total amount (including GST)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">4</span>
                  <span>Click "Proceed to Checkout"</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d96857] text-white flex items-center justify-center text-sm font-medium">5</span>
                  <span>Complete payment via Razorpay (secure payment gateway)</span>
                </li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800">
                <strong>🔒 Secure Payment:</strong> All payments are processed through Razorpay, 
                India's most trusted payment gateway. Your financial information is completely secure.
              </p>
            </div>
          </div>
        );

      case 'track-orders':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2e2e2e]">Track Your Orders</h2>
            <p className="text-[#2e2e2e]/70 text-lg">
              Monitor your order status and delivery progress.
            </p>

            <div className="bg-gray-100 rounded-xl p-8 border border-[#2e2e2e]/10">
              <p className="text-center text-[#2e2e2e]/50">Screenshot placeholder</p>
              <p className="text-center text-sm text-[#2e2e2e]/40 mt-2">Orders page</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">Order Statuses:</h3>
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900">Processing</h4>
                  <p className="text-sm text-yellow-700 mt-1">Your order is being prepared</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900">Shipped</h4>
                  <p className="text-sm text-blue-700 mt-1">Your order is on its way</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900">Delivered</h4>
                  <p className="text-sm text-green-700 mt-1">Your order has been delivered</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2e2e2e]">What You Can Do:</h3>
              <ul className="space-y-2 text-[#2e2e2e]/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>View all your past and current orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Check payment status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Track delivery status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d96857] mt-1">•</span>
                  <span>Download invoices for your records</span>
                </li>
              </ul>
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

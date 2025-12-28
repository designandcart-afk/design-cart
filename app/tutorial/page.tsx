'use client';

import { useState } from 'react';

interface TutorialSection {
  id: string;
  title: string;
}

const tutorialSections: TutorialSection[] = [
  { id: 'getting-started', title: 'Getting Started (Video)' },
  { id: 'create-project', title: '1. Create Project' },
  { id: 'dashboard', title: '2. Dashboard' },
  { id: 'project-details', title: '3. Project Details' },
  { id: 'products', title: '4. Products Page' },
  { id: 'add-to-design', title: '5. Add to Design' },
  { id: 'screenshot-review', title: '6. Screenshot Review' },
  { id: 'final-design', title: '7. Final Design' },
  { id: 'add-to-cart', title: '8. Add to Cart' },
  { id: 'checkout-payment', title: '9. Checkout & Payment' },
  { id: 'order-tracking', title: '10. Order Tracking' },
];

export default function TutorialPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const SectionHeading = ({ title, note }: { title: string; note?: string }) => (
    <div className="space-y-1">
      <h2 className="text-3xl font-bold text-[#2e2e2e]">{title}</h2>
      {note ? <p className="text-[#2e2e2e]/70 text-base">{note}</p> : null}
    </div>
  );

  const ImageBlock = ({ src, alt, max = 'max-w-2xl' }: { src: string; alt: string; max?: string }) => (
    <div className={`rounded-lg overflow-hidden border border-[#2e2e2e]/10 ${max}`}>
      <img src={src} alt={alt} className="w-full h-auto object-cover" />
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="Getting Started (Video)"
              note="This video shows the full workflow. Watch it, then follow the step-by-step instructions below if you prefer reading."
            />

            <div className="space-y-3">
              <div className="aspect-video bg-[#2e2e2e] rounded-lg overflow-hidden flex items-center justify-center max-w-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/i8KDc3dGRCo"
                  title="Design&Cart walkthrough"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <p className="text-[#2e2e2e]/70 text-sm">Video flow: Create Project → Dashboard → Project Details → Add to Design → Screenshot Review → Render Review → Final Design → Add to Cart → Checkout → Order Tracking.</p>
            </div>
          </div>
        );

      case 'create-project':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="1. Create Project"
              note="A project equals one client job. Set it up first so every design, product, and order stays organized."
            />

            {/* Content and Create Project Image Side by Side */}
            <div className="grid gap-6 md:grid-cols-2 items-start">
              <div className="space-y-4 text-[#2e2e2e]/80 text-base">
                <p className="text-sm">You are on: Dashboard → Click "Create Project"</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Enter <strong>Project Name</strong> (e.g., "3BHK for Mr. Shah").</li>
                  <li>Choose <strong>Scope of Work</strong> (e.g., Full Home, Living Room, Kitchen).</li>
                  <li>Add <strong>Areas</strong>: type each room/area (Living, Bedroom 1, Kitchen, Balcony, etc.).</li>
                  <li>Add <strong>Address</strong> and <strong>Pincode</strong> so deliveries are planned correctly.</li>
                  <li>Upload <strong>Files</strong> (floor plans, references). Optional but recommended.</li>
                  <li>Click <strong>Create Project</strong>.</li>
                </ol>
                <p className="text-sm">After this: The project is created and listed on your Dashboard.</p>
              </div>
              
              <div className="flex justify-center">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <ImageBlock src="/screenshots/create-project.png" alt="Create Project" max="max-w-xs" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="2. Dashboard"
              note="Your starting point. Every project and action begins here."
            />

            <div className="space-y-4 text-[#2e2e2e]/80 text-base">
              <p className="text-sm">You are on: Dashboard</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>See all projects with status cards.</li>
                <li>Use <strong>Search</strong> to find a project quickly.</li>
                <li>Click any project card to open its details.</li>
              </ol>
              <p className="text-sm">After this: You are inside the selected Project Details page.</p>
            </div>

            <ImageBlock src="/screenshots/dashboard.png" alt="Dashboard" />
          </div>
        );

      case 'project-details':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="3. Project Details"
              note="Everything about one project lives here: info, areas, files, quotes, and bills."
            />

            <div className="space-y-4 text-[#2e2e2e]/80 text-base">
              <p className="text-sm">You are on: Project Details</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Review <strong>Project Information</strong> (name, scope, address).</li>
                <li>Open <strong>Quotes and Bills</strong> when available to see costs.</li>
                <li>Download <strong>Final Files</strong> once the design is done.</li>
                <li>Check <strong>Design Areas</strong>: each room shows its screenshots, renders, and products grouped together.</li>
              </ol>
              <p className="text-sm">After this: You know where to find every document and visual for the project.</p>
            </div>

            <ImageBlock src="/screenshots/project-details.png" alt="Project Details" />
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="4. Products Page"
              note="Browse the catalog. This is for choosing, not purchasing yet."
            />

            <div className="space-y-4 text-[#2e2e2e]/80 text-base">
              <p className="text-sm">You are on: Products</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Use <strong>Categories</strong> to jump to furniture or decor types.</li>
                <li>Apply <strong>Filters</strong> and <strong>Price Range</strong> to narrow results.</li>
                <li>Click a product card to open details (images, price, specs).</li>
                <li>Do not buy here; you will add to design first.</li>
              </ol>
              <p className="text-sm">After this: You know which products to add into a design.</p>
            </div>

            <ImageBlock src="/screenshots/product-catalog.png" alt="Product catalog" />
          </div>
        );

      case 'add-to-design':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="5. Add to Design"
              note="Place chosen products into a specific project and room."
            />

            <div className="space-y-4 text-[#2e2e2e]/80 text-base">
              <p className="text-sm">You are on: Product detail → Add to Design modal</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Select <strong>Project</strong> from the dropdown.</li>
                <li>Select <strong>Area (Room)</strong> for this product.</li>
                <li>Add <strong>Notes</strong> (colors, placement preferences) if needed.</li>
                <li>Click <strong>Add to Design</strong>.</li>
              </ol>
              <p className="text-sm">After this: The product appears inside that room in Project Details under Design Areas.</p>
            </div>

            <ImageBlock src="/screenshots/add-products.png" alt="Add to Design" />
          </div>
        );

      case 'screenshot-review':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="6. Screenshot Review"
              note="Screenshots are quick previews showing layout and product placement before 3D renders."
            />

            <div className="space-y-4 text-[#2e2e2e]/80 text-base">
              <p className="text-sm">You are on: Project Details → Room → Screenshots</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open the screenshot thumbnails to view them full size.</li>
                <li>Check product positions and room flow.</li>
                <li>Click <strong>Approve</strong> if the layout looks right.</li>
                <li>Click <strong>Request Change</strong> if you need adjustments; type the exact change.</li>
              </ol>
              <p className="text-sm">After this: Approved screenshots move the room forward to render creation.</p>
            </div>

            <ImageBlock src="/screenshots/review-approve.png" alt="Screenshot review" />
          </div>
        );

      case 'final-design':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="7. Final Design"
              note="This stage confirms the agreed design for the project. No further design changes happen here."
            />

            <div className="space-y-4 text-[#2e2e2e]/80 text-base">
              <p className="text-sm">You are on: Project Details → Final Design</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>View <strong>Final Renders</strong> for each room.</li>
                <li>Review the <strong>Final Product List</strong> linked to those renders.</li>
                <li>Confirm everything before moving to purchase.</li>
              </ol>
              <p className="text-sm">After this: Products are ready to move to cart for ordering.</p>
            </div>

            <ImageBlock src="/screenshots/view-renders_1.png" alt="Final design renders" />
          </div>
        );

      case 'add-to-cart':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="8. Add to Cart"
              note="Move approved products into the cart before payment."
            />

            <div className="space-y-4 text-[#2e2e2e]/80 text-base">
              <p className="text-sm">You are on: Project Details → Add to Cart</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Select the project or room you want to order.</li>
                <li>Check each product and adjust <strong>Quantity</strong> if needed.</li>
                {/* Removed address and contact details step as requested */}
                <li>Click <strong>Add to Cart</strong>. Payment is not taken yet.</li>
              </ol>
              <p className="text-sm">After this: Items appear in the Cart grouped by project/room.</p>
            </div>

            <ImageBlock src="/screenshots/add-to-cart.png" alt="Add to cart" />
          </div>
        );

      case 'checkout-payment':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="9. Checkout & Payment"
              note="Review your order and pay securely via Razorpay."
            />

            <div className="space-y-4 text-[#2e2e2e]/80 text-base">
              <p className="text-sm">You are on: Cart → Checkout</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Review <strong>Order Summary</strong> (items, quantities, total).</li>
                {/* Removed GST and delivery charges step as requested */}
                <li>Click <strong>Pay Now</strong>.</li>
                <li>Complete secure payment via Razorpay (Card/UPI/Net Banking/EMI).</li>
              </ol>
              <p className="text-sm">After this: Order is placed and you receive confirmation.</p>
            </div>

            <ImageBlock src="/screenshots/checkout.png" alt="Checkout" />
          </div>
        );

      case 'order-tracking':
        return (
          <div className="space-y-6">
            <SectionHeading
              title="10. Order Tracking"
              note="Follow every order until delivery."
            />

            <div className="space-y-4 text-[#2e2e2e]/80 text-base">
              <p className="text-sm">You are on: Orders</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open <strong>Orders</strong> from the dashboard.</li>
                <li>Check status for each order: <strong>Placed → Processing → Shipped → Delivered</strong>.</li>
                <li>Open an order to view payment details, delivery address, and items.</li>
              </ol>
              <p className="text-sm">After this: You always know where your order stands and when to expect delivery.</p>
            </div>

            <ImageBlock src="/screenshots/track-orders.png" alt="Order tracking" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#efeee9]">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#2e2e2e] mb-2">Tutorial</h1>
          <p className="text-[#2e2e2e]/60 text-base">Step-by-step guide to using Design&Cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#2e2e2e]/10 p-4 sticky top-24 space-y-1">
              {tutorialSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-[#d96857] text-white'
                      : 'text-[#2e2e2e]/70 hover:bg-[#f8f7f4]'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-[#2e2e2e]/10 p-8 space-y-6">
              {renderContent()}
              <div className="pt-4 border-t border-[#2e2e2e]/10 text-sm text-[#2e2e2e]/70">
                Ready to begin? Open the dashboard and start your first project now.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

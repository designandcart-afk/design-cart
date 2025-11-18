"use client";

import AuthGuard from "@/components/AuthGuard";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useProjects } from '@/lib/contexts/projectsContext';
import { Button, Badge } from "@/components/UI";
import { ArrowLeft, FileText, Download, Calendar } from "lucide-react";

export default function ProjectQuotesPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id as string;
  const router = useRouter();

  const { getProject } = useProjects();
  const project = useMemo(() => getProject(projectId), [projectId, getProject]);

  if (!project) {
    return (
      <AuthGuard>
        <div className="container py-8">Project not found</div>
      </AuthGuard>
    );
  }

  const projectCode = `#DAC-${project.id.slice(0, 6).toUpperCase()}`;

  // Check if this is a demo project
  const isDemoProject = project.id.startsWith('demo_');

  // Mock quote data for demo projects
  const demoQuote = isDemoProject ? {
    quoteNumber: 'Q-2024-001',
    issueDate: '2024-10-15',
    validUntil: '2024-11-15',
    status: 'pending',
    totalAmount: 450000,
    items: [
      { id: 1, description: 'Living Room Design & Consultation', quantity: 1, unit: 'room', rate: 50000, amount: 50000 },
      { id: 2, description: 'Modular Kitchen with Appliances', quantity: 1, unit: 'set', rate: 200000, amount: 200000 },
      { id: 3, description: 'Bedroom Furniture & Wardrobes', quantity: 2, unit: 'room', rate: 75000, amount: 150000 },
      { id: 4, description: 'Lighting & Electrical Work', quantity: 1, unit: 'project', rate: 50000, amount: 50000 },
    ],
    files: [
      { id: 'f1', name: 'Project Quotation - Final.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '2024-10-15', url: '#' },
      { id: 'f2', name: 'Cost Breakdown.xlsx', type: 'XLSX', size: '156 KB', uploadDate: '2024-10-15', url: '#' },
      { id: 'f3', name: 'Payment Schedule.pdf', type: 'PDF', size: '890 KB', uploadDate: '2024-10-15', url: '#' },
      { id: 'f4', name: 'Terms & Conditions.pdf', type: 'PDF', size: '345 KB', uploadDate: '2024-10-15', url: '#' },
    ]
  } : null;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#faf8f6] pb-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-[#2e2e2e]/70 hover:text-[#2e2e2e]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Project
            </Button>

            <div className="bg-white border rounded-2xl p-6 shadow-lg shadow-black/5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-[#d96857] font-semibold mb-1">{projectCode}</div>
                  <h1 className="text-2xl font-bold text-[#2e2e2e] mb-2">{project.name}</h1>
                  <p className="text-sm text-[#2e2e2e]/60">{project.scope}</p>
                </div>
                {demoQuote && (
                  <Badge className="text-sm px-4 py-1.5 bg-amber-100 text-amber-800 border-amber-200">
                    {demoQuote.status === 'pending' ? 'Pending Review' : 'Approved'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Quote Content */}
          {!demoQuote ? (
            // Empty state for real users
            <div className="bg-white border rounded-2xl p-12 shadow-lg shadow-black/5 text-center">
              <div className="text-[#2e2e2e]/40 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#2e2e2e] mb-3">No Quotes Yet</h2>
              <p className="text-sm text-[#2e2e2e]/60 max-w-md mx-auto mb-4">
                Our team will prepare and upload a detailed quotation for your project after the initial consultation.
              </p>
              <p className="text-xs text-[#2e2e2e]/50">
                You'll be notified once the quote is ready for review.
              </p>
            </div>
          ) : (
            // Demo quote display
            <div className="space-y-6">
              {/* Quote Details */}
              <div className="bg-white border rounded-2xl p-6 shadow-lg shadow-black/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#2e2e2e]">Quote Details</h2>
                  <div className="text-right">
                    <div className="text-xs text-[#2e2e2e]/60">Quote Number</div>
                    <div className="text-sm font-semibold text-[#d96857]">{demoQuote.quoteNumber}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-6 pb-6 border-b border-black/5">
                  <div>
                    <div className="text-xs text-[#2e2e2e]/60 mb-1">Issue Date</div>
                    <div className="text-sm font-medium text-[#2e2e2e] flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#d96857]" />
                      {new Date(demoQuote.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#2e2e2e]/60 mb-1">Valid Until</div>
                    <div className="text-sm font-medium text-[#2e2e2e] flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#d96857]" />
                      {new Date(demoQuote.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#2e2e2e]/60 mb-1">Total Amount</div>
                    <div className="text-xl font-bold text-[#d96857]">
                      ₹{demoQuote.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Quote Items */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th className="text-left text-xs font-semibold text-[#2e2e2e]/70 pb-3 pr-4">Description</th>
                        <th className="text-center text-xs font-semibold text-[#2e2e2e]/70 pb-3 px-2">Qty</th>
                        <th className="text-center text-xs font-semibold text-[#2e2e2e]/70 pb-3 px-2">Unit</th>
                        <th className="text-right text-xs font-semibold text-[#2e2e2e]/70 pb-3 px-2">Rate</th>
                        <th className="text-right text-xs font-semibold text-[#2e2e2e]/70 pb-3 pl-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoQuote.items.map((item) => (
                        <tr key={item.id} className="border-b border-black/5">
                          <td className="py-3 pr-4 text-sm text-[#2e2e2e]">{item.description}</td>
                          <td className="py-3 px-2 text-sm text-center text-[#2e2e2e]/80">{item.quantity}</td>
                          <td className="py-3 px-2 text-sm text-center text-[#2e2e2e]/60">{item.unit}</td>
                          <td className="py-3 px-2 text-sm text-right text-[#2e2e2e]/80">₹{item.rate.toLocaleString('en-IN')}</td>
                          <td className="py-3 pl-4 text-sm text-right font-medium text-[#2e2e2e]">₹{item.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="pt-4 text-right text-sm font-semibold text-[#2e2e2e]">Total:</td>
                        <td className="pt-4 pl-4 text-right text-lg font-bold text-[#d96857]">
                          ₹{demoQuote.totalAmount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-black/5">
                  <Button className="flex-1 bg-[#d96857] text-white hover:bg-[#c85745]">
                    Approve Quote
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Request Changes
                  </Button>
                </div>
              </div>

              {/* Quote Files */}
              <div className="bg-white border rounded-2xl p-6 shadow-lg shadow-black/5">
                <h2 className="text-lg font-semibold text-[#2e2e2e] mb-4">Quote Documents</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {demoQuote.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      className="flex items-center gap-3 p-4 rounded-xl border border-black/10 hover:border-[#d96857]/30 hover:bg-[#faf8f6] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#d96857]/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-[#d96857]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#2e2e2e] truncate group-hover:text-[#d96857] transition-colors">
                          {file.name}
                        </div>
                        <div className="text-xs text-[#2e2e2e]/60 mt-0.5">
                          {file.size} • {new Date(file.uploadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <Download className="w-5 h-5 text-[#2e2e2e]/30 group-hover:text-[#d96857] transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center">
                    <span className="text-amber-800 text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900 mb-1">Important Note</h3>
                    <p className="text-sm text-amber-800/80">
                      Please review all documents carefully. If you have any questions or need clarifications, 
                      feel free to reach out to us via the project chat. This quote is valid for 30 days from the issue date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}

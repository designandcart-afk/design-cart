'use client';

import { Mail, Clock, Calendar, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#efeee9]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2e2e2e] mb-2">Contact Support</h1>
            <p className="text-[#2e2e2e]/60">We're here to help with any questions you may have</p>
          </div>

          {/* Main Contact Card */}
          <div className="bg-white rounded-xl border border-[#2e2e2e]/10 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#d96857]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#d96857]" />
              </div>
              <h2 className="text-lg font-semibold text-[#2e2e2e]">Email Us Directly</h2>
            </div>
            
            <div className="mb-4">
              <a 
                href="mailto:support@designandcart.in"
                className="text-[#2e2e2e] hover:text-[#d96857] transition-colors"
              >
                support@designandcart.in
              </a>
            </div>
            
            <a
              href="mailto:support@designandcart.in"
              className="inline-flex items-center gap-2 bg-[#d96857] text-white py-2.5 px-6 rounded-lg hover:bg-[#c45745] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </a>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-[#2e2e2e]/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#d96857]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#d96857]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2e2e2e] text-sm mb-1">Response Time</h3>
                  <p className="text-sm text-[#2e2e2e]/60">Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#2e2e2e]/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#d96857]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#d96857]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2e2e2e] text-sm mb-1">Support Hours</h3>
                  <p className="text-sm text-[#2e2e2e]/60">Mon-Sat, 9 AM - 6 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Need Quick Answers?</h3>
            </div>
            <p className="text-sm text-blue-800 mb-4">
              Check out our comprehensive Tutorial page for instant answers to common questions
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                <span>Creating and managing projects</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                <span>Product selection and approval process</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                <span>Payment and checkout procedures</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                <span>Order tracking and delivery information</span>
              </div>
            </div>
            <Link
              href="/tutorial"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              View Tutorial
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

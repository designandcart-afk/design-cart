'use client';

import { Mail, Clock, Calendar, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#efeee9]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#2e2e2e] mb-4">Get in Touch</h1>
            <p className="text-lg text-[#2e2e2e]/70">We're here to help with any questions you may have</p>
          </div>

          {/* Main Contact Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#2e2e2e]/10 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-[#d96857] to-[#c45745] p-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Mail className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">Email Us Directly</h2>
              <p className="text-center text-white/90">Click the button below to send us an email</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <a 
                  href="mailto:support@designandcart.in"
                  className="inline-block text-2xl font-semibold text-[#2e2e2e] hover:text-[#d96857] transition-colors"
                >
                  support@designandcart.in
                </a>
              </div>
              
              <a
                href="mailto:support@designandcart.in"
                className="w-full bg-[#d96857] text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-[#c45745] transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl group"
              >
                <Mail className="w-6 h-6" />
                <span>Send Email Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <p className="text-center text-sm text-[#2e2e2e]/60 mt-4">
                Your default email client will open with our address pre-filled
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-[#2e2e2e]/10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#d96857]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#d96857]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2e2e2e] text-lg mb-2">Response Time</h3>
                  <p className="text-[#2e2e2e]/70">We typically respond within 24 hours during business days</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#2e2e2e]/10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#d96857]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#d96857]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2e2e2e] text-lg mb-2">Support Hours</h3>
                  <p className="text-[#2e2e2e]/70">Monday - Saturday<br/>9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900">Need Quick Answers?</h3>
            </div>
            <p className="text-blue-800 mb-6">
              Check out our comprehensive Tutorial page for instant answers to common questions
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>Creating and managing projects</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>Product selection and approval process</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>Payment and checkout procedures</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>Order tracking and delivery information</span>
              </div>
            </div>
            <Link
              href="/tutorial"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Tutorial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

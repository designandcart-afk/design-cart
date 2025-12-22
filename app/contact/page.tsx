'use client';

import { useState } from 'react';
import { Mail, MessageSquare, User, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', message: '' });
        }, 5000);
      } else {
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to send message. Please try emailing us directly at support@designcart.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#efeee9]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#2e2e2e] mb-2">Contact Support</h1>
            <p className="text-[#2e2e2e]/60">Have questions? We're here to help!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-[#2e2e2e]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#d96857]/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-[#d96857]" />
              </div>
              <h3 className="font-semibold text-[#2e2e2e] mb-1">Email</h3>
              <p className="text-sm text-[#2e2e2e]/60">support@designcart.com</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#2e2e2e]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#d96857]/10 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-[#d96857]" />
              </div>
              <h3 className="font-semibold text-[#2e2e2e] mb-1">Response Time</h3>
              <p className="text-sm text-[#2e2e2e]/60">Within 24 hours</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#2e2e2e]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#d96857]/10 flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-[#d96857]" />
              </div>
              <h3 className="font-semibold text-[#2e2e2e] mb-1">Support Hours</h3>
              <p className="text-sm text-[#2e2e2e]/60">Mon-Sat, 9 AM - 6 PM</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#2e2e2e]/10 p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#2e2e2e] mb-2">Message Sent!</h3>
                <p className="text-[#2e2e2e]/60">
                  Thank you for contacting us. We've sent a confirmation email to your inbox. Our team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#2e2e2e] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#2e2e2e]/10 focus:outline-none focus:ring-2 focus:ring-[#d96857]/20 focus:border-[#d96857] transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2e2e2e] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#2e2e2e]/10 focus:outline-none focus:ring-2 focus:ring-[#d96857]/20 focus:border-[#d96857] transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#2e2e2e] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-[#2e2e2e]/10 focus:outline-none focus:ring-2 focus:ring-[#d96857]/20 focus:border-[#d96857] transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#d96857] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#c45745] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Before You Contact Us</h3>
            <p className="text-sm text-blue-800 mb-3">
              Check out our Tutorial page for quick answers to common questions about:
            </p>
            <ul className="text-sm text-blue-700 space-y-1 ml-4">
              <li>• How to create projects and add products</li>
              <li>• Understanding the approval process</li>
              <li>• Payment and checkout procedures</li>
              <li>• Order tracking and delivery status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

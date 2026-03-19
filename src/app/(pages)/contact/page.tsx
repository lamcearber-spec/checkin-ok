'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        setStatus('sent');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Something went wrong');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const inputClass = "w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BF6] focus:border-transparent text-sm";

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#4F6BF6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-[#4F6BF6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">{t('title')}</h1>
          <p className="text-[#6b7280] text-base">{t('subtitle')}</p>
        </div>

        {status === 'sent' ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#10b981]" />
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Message sent!</h2>
            <p className="text-[#6b7280] mb-6">Thank you for reaching out. We'll get back to you as soon as possible.</p>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-2.5 bg-[#4F6BF6] text-white rounded-lg text-sm font-medium hover:bg-[#3D5BD9] transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            {status === 'error' && errorMsg && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                  className={`${inputClass} ${!subject ? 'text-gray-400' : ''}`}
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="General">General inquiry</option>
                  <option value="Support">Support</option>
                  <option value="Billing">Billing</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="text-xs text-[#6b7280]">
                By submitting this form, you agree to our{' '}
                <Link href="/privacy" className="text-[#4F6BF6] hover:underline">Privacy Policy</Link>.
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#4F6BF6] hover:bg-[#3D5BD9] text-white py-3 px-6 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send message
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-[#6b7280]">
                Or email us directly at{' '}
                <a href="mailto:support@checkin-ok.be" className="text-[#4F6BF6] hover:underline font-medium">
                  support@checkin-ok.be
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

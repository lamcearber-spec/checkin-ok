'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = t.raw('items') as { question: string; answer: string }[];

  return (
    <section className="bg-white border border-border rounded-lg p-6 md:p-8">
      <h2 className="text-lg font-bold text-navy mb-6">{t('title')}</h2>
      <div className="divide-y divide-border">
        {items.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-sm font-medium text-navy pr-4">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-text/50 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <p className="text-xs text-slate-text/70 leading-relaxed pb-4">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

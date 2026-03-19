'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = t.raw('items') as { question: string; answer: string }[];

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4 text-center">{t('title')}</h2>
      <div className="mt-8 sm:mt-12 divide-y divide-[#e5e7eb]">
        {items.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between py-5 text-left"
            >
              <span className="text-base font-medium text-[#1a1a1a] pr-4">{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-[#6b7280] flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <p className="text-[#6b7280] text-sm leading-relaxed pb-5">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

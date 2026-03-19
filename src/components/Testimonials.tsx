'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

export function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items') as { name: string; location: string; role: string; text: string; rating: number }[];

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-12 text-center">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.name} className="bg-white border border-[#e5e7eb] rounded-2xl p-6 hover:border-[#4F6BF6]/30 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#4F6BF6]/10 flex items-center justify-center">
                <span className="text-sm font-bold text-[#4F6BF6]">
                  {item.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-base font-semibold text-[#1a1a1a]">{item.name}</p>
                <p className="text-sm text-[#6b7280]">{item.role} — {item.location}</p>
              </div>
            </div>
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-[#6b7280] text-sm leading-relaxed">&ldquo;{item.text}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}

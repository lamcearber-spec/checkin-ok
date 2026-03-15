'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

export function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items') as { name: string; location: string; role: string; text: string; rating: number }[];

  return (
    <section className="bg-white border border-border rounded-lg p-6 md:p-8">
      <h2 className="text-lg font-bold text-navy mb-6">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.name} className="border border-border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-corp-green-light flex items-center justify-center">
                <span className="text-sm font-bold text-corp-green">
                  {item.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">{item.name}</p>
                <p className="text-xs text-slate-text/50">{item.role} — {item.location}</p>
              </div>
            </div>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-xs text-slate-text/70 leading-relaxed">&ldquo;{item.text}&rdquo;</p>
          </div>
        ))}
      </div>
    </section>
  );
}

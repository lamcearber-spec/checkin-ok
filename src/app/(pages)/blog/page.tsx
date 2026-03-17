import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

const posts = [
  {
    slug: 'checkinatwork-compliance-guide-2026',
    date: '2026-03-12',
    readTime: 6,
    titleKey: 'post1Title',
    excerptKey: 'post1Excerpt',
  },
  {
    slug: 'nsso-attendance-declarations-explained',
    date: '2026-02-20',
    readTime: 5,
    titleKey: 'post2Title',
    excerptKey: 'post2Excerpt',
  },
  {
    slug: 'automating-ciao-declarations',
    date: '2026-02-05',
    readTime: 4,
    titleKey: 'post3Title',
    excerptKey: 'post3Excerpt',
  },
  {
    slug: 'construction-sector-dimona-rules',
    date: '2026-01-22',
    readTime: 7,
    titleKey: 'post4Title',
    excerptKey: 'post4Excerpt',
  },
];

export default function BlogPage() {
  const t = useTranslations('blog');

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-navy mb-2">{t('title')}</h1>
      <p className="text-slate-text/70 mb-10">{t('subtitle')}</p>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-sm text-slate-text/50 mb-3">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{post.date}</time>
              <span>&middot;</span>
              <span>{post.readTime} {t('minRead')}</span>
            </div>
            <h2 className="text-xl font-semibold text-navy mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-corp-green transition-colors">
                {t(post.titleKey)}
              </Link>
            </h2>
            <p className="text-slate-text/70 text-sm mb-4">{t(post.excerptKey)}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-corp-green hover:text-corp-green/80 transition-colors"
            >
              {t('readMore')} <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

const posts: Record<string, { date: string; readTime: number; titleKey: string; bodyKey: string }> = {
  'checkinatwork-compliance-guide-2026': {
    date: '2026-03-12',
    readTime: 6,
    titleKey: 'post1Title',
    bodyKey: 'post1Body',
  },
  'nsso-attendance-declarations-explained': {
    date: '2026-02-20',
    readTime: 5,
    titleKey: 'post2Title',
    bodyKey: 'post2Body',
  },
  'automating-ciao-declarations': {
    date: '2026-02-05',
    readTime: 4,
    titleKey: 'post3Title',
    bodyKey: 'post3Body',
  },
  'construction-sector-dimona-rules': {
    date: '2026-01-22',
    readTime: 7,
    titleKey: 'post4Title',
    bodyKey: 'post4Body',
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const t = useTranslations('blog');
  const post = posts[params.slug];

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-corp-green hover:text-corp-green/80 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {t('backToBlog')}
      </Link>

      <article>
        <div className="flex items-center gap-2 text-sm text-slate-text/50 mb-4">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{post.date}</time>
          <span>&middot;</span>
          <span>{post.readTime} {t('minRead')}</span>
        </div>
        <h1 className="text-3xl font-bold text-navy mb-8">{t(post.titleKey)}</h1>
        <div className="prose prose-sm text-slate-text/80 space-y-4 whitespace-pre-line">
          {t(post.bodyKey)}
        </div>
      </article>
    </div>
  );
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('blogTitle'),
    description: t('blogDescription'),
    openGraph: {
      title: `${t('blogTitle')} | Checkin OK`,
      description: t('blogDescription'),
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

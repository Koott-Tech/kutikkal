import ParentingCmsRenderer from '@/components/ParentingCmsRenderer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const res = await fetch(`${base}/api/better-parenting/${slug}`, { cache: 'no-store', next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data.message) {
        const s = data.message;
        const title = s.seo_title || s.hero_title || `${slug?.replace(/[-_]/g, ' ')} - Little Care`;
        const description = s.hero_subtext || 'Better parenting resources and guidance.';
        return { title, description };
      }
    }
  } catch (_) {}
  return {
    title: `${(await params)?.slug?.replace(/[-_]/g, ' ') || 'Better Parenting'} - Little Care`,
    description: 'Better parenting resources and guidance.'
  };
}

export default async function BetterParentingDynamicPage({ params }) {
  const { slug } = await params;
  return (
    <div>
      <ParentingCmsRenderer slug={slug} />
    </div>
  );
}



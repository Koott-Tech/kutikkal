import DynamicPage, { generateMetadata as gm } from '../[slug]/page';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return DynamicPage({ params: { slug: 'autism-support' } });
}

export async function generateMetadata() {
  return gm({ params: { slug: 'autism-support' } });
}
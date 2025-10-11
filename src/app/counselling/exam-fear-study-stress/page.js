import DynamicPage, { generateMetadata as gm } from '../[slug]/page';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return DynamicPage({ params: { slug: 'exam-fear-study-stress' } });
}

export async function generateMetadata() {
  return gm({ params: { slug: 'exam-fear-study-stress' } });
}
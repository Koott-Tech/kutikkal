import BlogTeaser from '@/components/BlogTeaser';
import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HelpFaq from '@/components/HelpFaq';
import ScrollToTop from '@/components/ScrollToTop';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import HowItWorks from '@/components/HowItWorks';
import InfoCards from '@/components/InfoCards';
import VideosShowcase from '@/components/VideosShowcase';
import Reviews from '@/components/Reviews';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchPage(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/better-parenting/${slug}`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data.success) return data.message;
    }
  } catch (e) {}
  return null;
}

export default async function BetterParentingDynamicPage({ params }) {
  const { slug } = await params;
  const data = await fetchPage(slug);

  const title = data?.hero_title || (slug ? slug.replace(/[-_]/g, ' ') : 'Better Parenting');
  const subtext = data?.hero_subtext || '';
  const imageUrl = data?.hero_image_url || '';

  return (
    <div>
      <ScrollToTop />
      <HeroSection 
        therapyType={slug}
        cmsData={{
          title,
          subtext,
          ctaText: data?.hero_cta_text || '',
          imageUrl,
          features: []
        }}
      />
      <LogosStrip bgColor="bg-[#15171A]" height="py-4" logosCount={6} swapSecondThird />

      <div className="mt-8">
        <BenefitsSection cmsData={{ title: data?.benefits_title || 'Why this program?', benefits: data?.benefits || [], benefitsImageUrl: data?.benefits_image_url || '' }} />
      </div>
      <div className="mt-8">
        <TherapyTypesSplit cmsData={{ title: data?.types_title || 'What we offer', types: data?.types || [], rightImageUrl: data?.right_image_url || '' }} />
      </div>
      <div className="mt-8">
        <HowItWorks />
      </div>
      {/* Consultation Banner removed */}
      {(data?.videos && data.videos.length > 0) && (
        <div className="mt-8">
          <VideosShowcase cmsData={{ videos: data.videos }} />
        </div>
      )}
      {(data?.reviews && data.reviews.length > 0) && (
        <div className="mt-8">
          <Reviews cmsData={{ reviews: data.reviews }} />
        </div>
      )}
      {(data?.info_cards && data.info_cards.length > 0) && (
        <div className="mt-8">
          <InfoCards cmsData={{ items: data.info_cards }} />
        </div>
      )}
      {(data?.blog_teaser_enabled !== false) && (
        <div className="mt-12 md:mt-16">
          <BlogTeaser />
        </div>
      )}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <HelpFaq cmsData={{ faqs: data?.faqs || [] }} />
        </div>
      </div>
    </div>
  );
}



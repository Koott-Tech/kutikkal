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
import TherapistCarousel from '@/components/TherapistCarousel';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchBetterParentingPage(slug, { preview = false } = {}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const previewSuffix = preview ? '?preview=1' : '';
    const response = await fetch(`${baseUrl}/api/better-parenting/${slug}${previewSuffix}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (response.ok) {
      const json = await response.json();
      if (json?.success) {
        const payload = json.data ?? json.message ?? json.page ?? json.result ?? json;
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          if (payload.page && typeof payload.page === 'object' && !Array.isArray(payload.page)) {
            return payload.page;
          }
          return payload;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching better parenting page:', error);
  }

  return null;
}

async function fetchPublicTherapists(limit = 6) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${baseUrl}/api/public/psychologists`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (response.ok) {
      const json = await response.json();
      const psychologists = json?.data?.psychologists || json?.message?.psychologists || json?.psychologists || [];
      if (Array.isArray(psychologists)) {
        return psychologists.slice(0, limit);
      }
    }
  } catch (error) {
    console.error('Error fetching public psychologists:', error);
  }

  return [];
}

export default async function BetterParentingDynamicPage({ params, searchParams }) {
  const { slug } = await params;
  const isPreview = searchParams?.preview === '1' || searchParams?.preview === 'true';
  const data = await fetchBetterParentingPage(slug, { preview: isPreview });

  if (!data) {
    return (
      <div className="px-6 py-16 text-center">
        <h3 className="text-2xl font-medium">Program coming soon</h3>
        <p className="mt-2 text-gray-600">We couldn't load this Better Parenting page right now. Please try another topic or check back shortly.</p>
      </div>
    );
  }

  const therapists = await fetchPublicTherapists(6);

  const title = data?.hero_title || (slug ? slug.replace(/[-_]/g, ' ') : 'Better Parenting');
  const subtext = data?.hero_subtext || '';
  const imageUrl = data?.hero_image_url || '';
  const heroFeatures = [data?.hero_point_1, data?.hero_point_2, data?.hero_point_3].filter(Boolean);

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
          features: heroFeatures
        }}
      />
      <LogosStrip bgColor="bg-[#15171A]" height="py-4" logosCount={6} swapSecondThird />

      {/* Therapist grid under hero */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-8 md:mt-12">
        <div className="px-4 sm:px-6 mb-8 md:mb-10 text-center">
          <div className="mt-3 text-center md:text-center px-4">
            <h3 className="how-it-works-heading text-center text-base md:text-xl lg:text-2xl" style={{ fontWeight: 500 }}>
              {data?.therapists_heading || 'Your journey to a happier, calmer home begins here.'}
            </h3>
          </div>
        </div>
        <TherapistCarousel therapists={therapists} />
      </div>

      <div className="mt-8">
        <BenefitsSection cmsData={{ title: data?.benefits_title || 'Why this program?', benefits: data?.benefits || [], benefitsImageUrl: data?.benefits_image_url || '' }} />
      </div>
      <div className="mt-8">
        <TherapyTypesSplit cmsData={{ title: data?.types_title || 'What we offer', types: data?.types || [], rightImageUrl: data?.right_image_url || '' }} />
      </div>
      <div className="mt-8">
        <HowItWorks />
      </div>
      {/* Videos showcase */}
      <div className="mt-8">
        <VideosShowcase cmsData={{ 
          videos: (data?.videos || []).map(video => ({
            src: video.url || video.src,
            poster: video.thumbnailUrl || video.poster,
            title: video.title,
            position: video.position
          })),
          videosHeading: data?.videos_heading,
          videosSubheading: data?.videos_subheading,
          featuredIndex: data?.videos_featured_index
        }} />
      </div>
      {/* Reviews */}
      <div className="mt-8">
        <Reviews cmsData={{ reviews: data?.reviews || [], title: data?.reviews_heading }} />
      </div>
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



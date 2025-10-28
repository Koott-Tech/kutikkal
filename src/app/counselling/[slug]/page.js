import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HowItWorks from '@/components/HowItWorks';
import ConsultationBanner from '@/components/ConsultationBanner';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import ConditionBoxes from '@/components/ConditionBoxes';
import HelpFaq from '@/components/HelpFaq';
import CounsellingNotFound from '@/components/CounsellingNotFound';
import ScrollToTop from '@/components/ScrollToTop';

// Force dynamic rendering and disable caching so edits reflect immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EXCLUDED = new Set([
  'assessments',
  'better-parenting',
  'resources'
]);

// Fallback metadata for when API fails
const FALLBACK_META = {
  'depression': {
    title: 'Depression Counselling - Little Care',
    description: 'Compassionate, evidence-based counselling to support children experiencing depression.'
  },
  'anxiety-sadness': {
    title: 'Anxiety, Sadness or Low mood - Little Care',
    description: 'Professional support for children experiencing anxiety, sadness, or low mood.'
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
    try {
    // Try to fetch from API for dynamic metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/counselling/${slug}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.message) {
        const service = data.message;
        // Only use fields that exist in database
        const title = service.seo_title || service.hero_title || `${slug?.replace(/[-_]/g, ' ')} - Little Care`;
        const description = service.hero_subtext || 'Specialized counselling services for children and families.';
        
        return {
          title,
          description,
          openGraph: {
            title,
            description,
            type: 'website',
            siteName: 'Little Care',
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching metadata (non-critical):', error);
    // Fall through to static metadata
  }
  
  // Fallback to static metadata if API fails
  const meta = FALLBACK_META[slug] || {
    title: `${slug?.replace(/[-_]/g, ' ') || 'Counselling'} - Little Care`,
    description: 'Specialized counselling services for children and families.'
  };
  return meta;
}

async function fetchCounsellingService(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/counselling/${slug}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return data.message;
      }
    }
  } catch (error) {
    console.error('Error fetching counselling service:', error);
  }
  
  return null;
}

export default async function CounsellingDynamicPage({ params }) {
  const { slug } = await params;

  // Guard for excluded roots if accessed directly
  if (EXCLUDED.has(slug)) {
    return (
      <div className="px-6 py-16 text-center">
        <h3 className="text-2xl font-medium">Section coming soon</h3>
        <p className="mt-2 text-gray-600">Please choose a specific counselling topic from the menu.</p>
      </div>
    );
  }

  // Try to fetch from CMS
  const serviceData = await fetchCounsellingService(slug);
  
  if (!serviceData) {
    return <CounsellingNotFound slug={slug} />;
  }

  // Render with CMS data - with safe fallbacks
  return (
    <div>
      <ScrollToTop />
      <HeroSection 
        therapyType={slug} 
        cmsData={{
          title: serviceData.hero_title || 'Counselling',
          subtext: serviceData.hero_subtext || '',
          ctaText: serviceData.hero_cta_text || '',
          imageUrl: serviceData.hero_image_url || ''
        }}
      />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <HowItWorks />
      <ConsultationBanner />
      <BenefitsSection 
        therapyType={slug} 
        cmsData={{
          title: serviceData.benefits_title,
          benefits: serviceData.benefits || [],
          benefitsImageUrl: serviceData.benefits_image_url || ''
        }}
      />
      <TherapyTypesSplit 
        therapyType={slug} 
        cmsData={{
          title: serviceData.types_title,
          types: serviceData.types || [],
          rightImageUrl: serviceData.right_image_url || '',
          buttonText: 'Get started'
        }}
      />
      <ConditionBoxes cmsData={{ condition_boxes: serviceData.condition_boxes }} />
      <div className="mt-24">
        <HelpFaq 
          cmsData={{
            faqs: serviceData.faqs || []
          }}
        />
      </div>
    </div>
  );
}

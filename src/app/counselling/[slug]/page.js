import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HowItWorks from '@/components/HowItWorks';
import ConsultationBanner from '@/components/ConsultationBanner';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
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
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.message) {
        const service = data.message;
        const metadata = {
          title: service.seo_title || `${slug?.replace(/[-_]/g, ' ')} - Little Care`,
          description: service.seo_description || 'Specialized counselling services for children and families.',
        };

        // Add keywords if available
        if (service.seo_keywords) {
          metadata.keywords = service.seo_keywords.split(',').map(k => k.trim());
        }

        // Add robots meta tag
        if (service.robots) {
          metadata.robots = service.robots;
        }

        // Add canonical URL if specified
        if (service.canonical_url) {
          metadata.alternates = {
            canonical: service.canonical_url
          };
        }

        // Add Open Graph metadata
        metadata.openGraph = {
          title: service.og_title || service.seo_title || service.hero_title,
          description: service.og_description || service.seo_description,
          type: 'website',
          siteName: 'Little Care',
        };

        if (service.og_image) {
          metadata.openGraph.images = [
            {
              url: service.og_image,
              width: 1200,
              height: 630,
              alt: service.og_title || service.seo_title
            }
          ];
        }

        // Add Twitter Card metadata
        metadata.twitter = {
          card: 'summary_large_image',
          title: service.og_title || service.seo_title,
          description: service.og_description || service.seo_description,
        };

        if (service.og_image) {
          metadata.twitter.images = [service.og_image];
        }

        return metadata;
      }
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }
  
  // Fallback to static metadata
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

  // Render with CMS data
  return (
    <div>
      <ScrollToTop />
      <HeroSection 
        therapyType={slug} 
        cmsData={{
          title: serviceData.hero_title,
          subtext: serviceData.hero_subtext,
          imageUrl: serviceData.hero_image_url
        }}
      />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <HowItWorks />
      <ConsultationBanner />
      <BenefitsSection 
        therapyType={slug} 
        cmsData={{
          benefits: serviceData.benefits
        }}
      />
      <TherapyTypesSplit 
        therapyType={slug} 
        cmsData={{
          types: serviceData.types,
          rightImageUrl: serviceData.right_image_url
        }}
      />
      <div className="mt-24">
        <HelpFaq 
          cmsData={{
            faqs: serviceData.faqs
          }}
        />
      </div>
    </div>
  );
}

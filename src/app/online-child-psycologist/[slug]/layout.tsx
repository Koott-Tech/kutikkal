import { Metadata } from 'next';
import React from 'react';

// Helper function to create slug from name
const createSlug = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Fetch psychologist data by slug
async function getPsychologistBySlug(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.little.care';
    const response = await fetch(`${baseUrl}/public/psychologists`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.success) {
      return null;
    }

    // API returns data.psychologists or data.data
    const psychologists = Array.isArray(data.data?.psychologists) 
      ? data.data.psychologists 
      : Array.isArray(data.data) 
        ? data.data 
        : Array.isArray(data.psychologists)
          ? data.psychologists
          : [];
    
    // Check if slug is a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    if (isUUID) {
      return psychologists.find((doc: any) => doc.id === slug);
    }
    
    // Find by name slug
    const psychologist = psychologists.find((doc: any) => {
      const name = doc.name || `${doc.first_name || ''} ${doc.last_name || ''}`.trim();
      const nameSlug = createSlug(name);
      return nameSlug === slug;
    });
    
    return psychologist || null;
  } catch (error) {
    console.error('Error fetching psychologist for metadata:', error);
    return null;
  }
}

// Normalize image URL for Open Graph (needs absolute URL)
function normalizeImageUrlForOG(url: string | null | undefined): string {
  if (!url) {
    return 'https://www.little.care/favicon.png';
  }
  
  // If already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a Supabase storage URL, convert to proxy URL for absolute path
  // Pattern: /storage/v1/object/public/BUCKET/FILENAME
  const supabaseStorageMatch = url.match(/\/storage\/v1\/object\/(?:public|sign)\/([^\/]+)\/(.+)$/);
  if (supabaseStorageMatch) {
    const bucket = supabaseStorageMatch[1];
    let filename = supabaseStorageMatch[2].split('?')[0]; // Remove query params
    try {
      filename = decodeURIComponent(filename);
    } catch (e) {
      // If decoding fails, use original filename
    }
    return `https://www.little.care/api/images/${bucket}/${encodeURIComponent(filename)}`;
  }
  
  // If it's already a relative proxy URL, make it absolute
  if (url.startsWith('/api/images/')) {
    return `https://www.little.care${url}`;
  }
  
  // Otherwise, prepend the base URL
  return `https://www.little.care${url.startsWith('/') ? url : `/${url}`}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const psychologist = await getPsychologistBySlug(slug);
    
    if (psychologist) {
      const name = psychologist.name || `${psychologist.first_name || ''} ${psychologist.last_name || ''}`.trim();
      const title = `${name} | Child Psychologist | Little Care`;
      
      // Get description from psychologist data or use default
      const description = psychologist.bio || 
                         psychologist.description || 
                         psychologist.short_bio ||
                         `Book an online session with ${name}, an experienced child psychologist at Little Care. Professional counseling and therapy for children.`;
      
      // Get therapist image - prefer cover_image_url, then profile_picture_url, then fallback
      const therapistImage = normalizeImageUrlForOG(
        psychologist.cover_image_url || 
        psychologist.profile_picture_url || 
        psychologist.profile_image_url || 
        psychologist.image_url
      );
      
      const url = `https://www.little.care/online-child-psycologist/${slug}`;
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'profile',
          siteName: 'Little Care',
          url,
          images: [
            {
              url: therapistImage,
              width: 1200,
              height: 630,
              alt: `${name} - Child Psychologist`,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [therapistImage],
        },
        alternates: {
          canonical: url,
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata for therapist profile:', error);
  }
  
  // Fallback metadata
  const fallbackTitle = slug 
    ? `${slug.replace(/[-_]/g, ' ')} - Child Psychologist | Little Care`
    : 'Child Psychologist | Little Care';
  
  return {
    title: fallbackTitle,
    description: 'Book an online session with an experienced child psychologist at Little Care. Professional counseling and therapy for children.',
    openGraph: {
      title: fallbackTitle,
      description: 'Book an online session with an experienced child psychologist at Little Care. Professional counseling and therapy for children.',
      type: 'profile',
      siteName: 'Little Care',
      url: `https://www.little.care/online-child-psycologist/${slug}`,
      images: [
        {
          url: 'https://www.little.care/favicon.png',
          width: 1200,
          height: 630,
          alt: 'Little Care',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fallbackTitle,
      description: 'Book an online session with an experienced child psychologist at Little Care. Professional counseling and therapy for children.',
      images: ['https://www.little.care/favicon.png'],
    },
    alternates: {
      canonical: `https://www.little.care/online-child-psycologist/${slug}`,
    },
  };
}

export default function TherapistProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

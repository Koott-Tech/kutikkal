"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TherapyTypesSplit({ therapyType = "individual", cmsData = null }) {
  const router = useRouter();
  // Content configuration for different therapy types
  const content = {
    individual: {
      title: "Types of individual therapy",
      types: [
        {
          title: "Cognitive behavioral therapy (CBT)",
          description: "Cognitive behavioral therapy focuses on the connection between people's thoughts, feelings, and behaviors to interrupt anxiety and other mental health challenges."
        },
        {
          title: "Dialectic behavioral therapy (DBT)",
          description: "Focuses on building emotional regulation skills and encouraging participants to fully accept all parts of themselves — even their anxiety."
        },
        {
          title: "Eye movement desensitization and reprocessing (EMDR)",
          description: "EMDR is a therapeutic technique that uses specific eye movements or tapping to help people process traumatic memories."
        },
        {
          title: "Acceptance and commitment therapy (ACT)",
          description: "ACT is a mindfulness-based form of behavioral therapy. It can effectively treat depression, anxiety, psychosis, OCD, and health conditions like chronic pain."
        }
      ],
      buttonText: "Get started"
    },
    "anxiety-sadness": {
      title: "Common Types of Anxiety in Kids",
      types: [
        {
          title: "Generalized Anxiety",
          description: "Worrying about lots of different things—school, friendships, safety, or family. Kids with this type of anxiety often feel nervous most of the time."
        },
        {
          title: "Separation Anxiety",
          description: "Fear of being away from parents or caregivers. This is common in younger children but can affect older kids too."
        },
        {
          title: "Social Anxiety",
          description: "Feeling very shy or nervous about talking to others, being in groups, or being the center of attention."
        },
        {
          title: "Specific Phobias",
          description: "Strong fears of certain things or situations, like animals, heights, storms, or doctors' visits."
        },
        {
          title: "School Anxiety",
          description: "Worrying a lot about going to school, tests, or being away from home, leading to resistance or refusal."
        },
        {
          title: "Panic Anxiety",
          description: "Sudden, intense feelings of fear that can cause a racing heart, dizziness, or feeling like something bad is about to happen."
        },
        {
          title: "Performance Anxiety",
          description: "Fear of making mistakes or being judged, especially during tests, sports, or presentations."
        }
      ],
      buttonText: "Get Started"
    },
    "big-emotions": {
      title: "Types of Big Emotions Therapy",
      types: [
        {
          title: "Cognitive Behavioral Therapy (CBT)",
          description: "Helps children identify and change negative thought patterns that contribute to emotional outbursts."
        },
        {
          title: "Emotion Regulation Training",
          description: "Teaches children strategies to manage and express their feelings in healthy ways."
        },
        {
          title: "Mindfulness Techniques",
          description: "Introduces calming practices to help children stay present and manage overwhelming emotions."
        },
        {
          title: "Parent-Child Interaction Therapy",
          description: "Involves parents in the therapeutic process to create consistent emotional support at home."
        }
      ],
      buttonText: "Get Started with Big Emotions Therapy"
    },
    "adhd-attention": {
      title: "Types of ADHD & Attention Support",
      types: [
        {
          title: "Behavioral Interventions",
          description: "Structured approaches to improve focus, organization, and task completion."
        },
        {
          title: "Executive Function Training",
          description: "Develops planning, organization, and time management skills."
        },
        {
          title: "Attention Training Programs",
          description: "Specific exercises to improve sustained attention and concentration."
        },
        {
          title: "Parent Coaching",
          description: "Guidance for parents on managing ADHD symptoms and supporting their child's success."
        }
      ],
      buttonText: "Start ADHD Support Today"
    }
  };

  // Use CMS data if available, otherwise fall back to hardcoded content
  const currentContent = cmsData ? {
    title: cmsData.title || content[therapyType]?.title || content.individual.title,
    types: cmsData.types && cmsData.types.length > 0 ? cmsData.types : (content[therapyType]?.types || content.individual.types),
    rightImageUrl: cmsData.rightImageUrl || content[therapyType]?.rightImageUrl || content.individual.rightImageUrl,
    buttonText: cmsData.buttonText || content[therapyType]?.buttonText || content.individual.buttonText
  } : (content[therapyType] || content.individual);
  return (
    <section className="w-full mt-4 md:mt-6 mb-0 md:mb-8 px-0 pt-8 md:pt-12">
      <div className="w-full overflow-hidden">
        <div className="flex flex-col md:grid md:grid-cols-2">
          {/* Content Area - with background */}
          <div
            className="flex flex-col justify-start px-0 pt-10 pb-0 md:py-20 text-[#1c331d] order-1 md:order-1 relative bg-[#DEEFDC]"
          >
            <div className="px-6 sm:px-8 md:px-[100px] lg:px-[120px]">
            <h3 
              className="mb-2"
              style={{
                color: '#15171a',
                fontWeight: 500,
                marginBottom: '0.5rem'
              }}
            >
              {currentContent.title}
            </h3>
           
            <div className="mt-8 md:mt-12 space-y-6 md:space-y-8">
              {currentContent.types.map((type, index) => (
                <div key={index}>
                  <p className="font-semibold text-sm md:text-base lg:text-lg mb-2 md:mb-3">
                    {type.title}
                  </p>
                  <p className="leading-relaxed font-normal text-xs md:text-sm lg:text-base">
                    {type.description}
                  </p>
                </div>
              ))}
            </div>
                
              <div className="flex justify-center md:justify-start">
            <button 
                className="mt-6 md:mt-8 inline-flex items-center justify-center rounded-full px-6 md:px-8 py-2 md:py-3 shadow-lg transition-colors duration-200 text-xs md:text-sm lg:text-base text-white"
              style={{ 
                backgroundColor: '#3f2e73',
                fontWeight: 500,
                textTransform: 'none',
                letterSpacing: 'normal',
                    fontFamily: "'Work Sans', Arial, sans-serif",
                    width: 'auto',
                    maxWidth: '80%'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d1733')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3f2e73')}
                  onClick={() => router.push('/psychologists')}
            >
              {currentContent.buttonText || "Get started"}
            </button>
              </div>
            </div>

            {/* Mobile Image - Inside the green background area */}
            <div className="block md:hidden mt-8 mx-0 relative" style={{ minHeight: '380px', height: '55vh', marginBottom: 0, paddingBottom: 0 }}>
              <div className="absolute inset-0" style={{ borderRadius: 0 }}>
                <Image
                  src={currentContent.rightImageUrl || "/rightside5th.png"}
                  alt="Two women sitting on a couch during therapy session"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                  style={{ objectPosition: 'center', borderRadius: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Image Area - Desktop Only */}
          <div className="hidden md:block relative" style={{ minHeight: '400px' }}>
            <div className="absolute inset-0">
              <Image
                src={currentContent.rightImageUrl || "/rightside5th.png"}
                alt="Two women sitting on a couch during therapy session"
                fill
                className="object-cover"
                sizes="50vw"
                priority
                style={{ objectPosition: 'center' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



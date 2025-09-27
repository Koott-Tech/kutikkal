import Image from "next/image";

export default function TherapyTypesSplit({ therapyType = "individual" }) {
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

  const currentContent = content[therapyType] || content.individual;
  return (
    <div className="px-4 sm:px-8 md:px-[50px]">
             <section className="w-full mt-16 md:mt-20 mb-6 md:mb-8">
                                   <div className="min-h-[100vh] w-full overflow-hidden shadow-sm">
          <div className="grid h-full w-full grid-cols-1 items-stretch md:grid-cols-2">
            {/* Left: Therapy Types */}
                                                                                                       <div
                 className="flex flex-col justify-start px-5 sm:px-8 md:px-[100px] lg:px-[120px] py-20 text-[#1c331d]"
                 style={{ background: "#d3e9d1" }}
               >
                                                                                         <h2 
                   className="mb-2 text-[2.5rem] md:text-[4rem] tracking-[-0.125rem] md:tracking-[-0.195rem] leading-[110%] md:leading-[106%]"
                   style={{
                     color: '#15171a',
                     fontWeight: 500,
                     marginBottom: '0.5rem'
                   }}
                 >
                  {currentContent.title}
                </h2>
               
               <div className="mt-12 space-y-8">
                 {currentContent.types.map((type, index) => (
                   <div key={index}>
                     <h3 className="text-base md:text-lg font-normal mb-3">
                       {type.title}
                     </h3>
                     <p className="text-sm md:text-base leading-relaxed font-normal">
                       {type.description}
                     </p>
                   </div>
                 ))}
               </div>
                   
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <button className="mt-8 inline-flex items-center rounded-full bg-[#38663a] px-12 sm:px-10 md:px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2d4f2e] w-fit mx-auto md:mx-0">
                           {currentContent.buttonText}
                         </button>
                         
                         {/* Mobile Image Section - Hidden on Desktop */}
                         <div className="block md:hidden mt-12 -mx-5 -mb-20">
                           <div className="relative h-[50vh] w-screen overflow-hidden">
                             <Image
                               src="/rightside5th.png"
                               alt="Two women sitting on a couch during therapy session"
                               fill
                               className="object-cover"
                               sizes="100vw"
                               priority
                             />
                           </div>
                         </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <Image
                src="/rightside5th.png"
                alt="Two women sitting on a couch during therapy session"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



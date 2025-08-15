import Image from "next/image";

export default function TherapyTypesSplit() {
  return (
    <div className="px-[50px]">
             <section className="w-full mt-16 md:mt-20 mb-6 md:mb-8">
                                   <div className="min-h-[100vh] w-full rounded-lg overflow-hidden shadow-sm">
          <div className="grid h-full w-full grid-cols-1 items-stretch md:grid-cols-2">
            {/* Left: Therapy Types */}
                                                                                                       <div
                 className="flex flex-col justify-start px-[100px] md:px-[120px] py-20 text-[#1c331d]"
                 style={{ background: "#d3e9d1" }}
               >
                                                                                         <h2 
                  className="mb-2"
                  style={{
                    color: '#15171a',
                    fontFamily: 'Scto Grotesk A Medium, Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: '4rem',
                    letterSpacing: '-0.195rem',
                    lineHeight: '106%',
                    marginBottom: '0.5rem'
                  }}
                >
                 Types of<br />
                 individual<br />
                 therapy
               </h2>
               
               <div className="mt-12 space-y-8">
                                                                       <div>
                     <h3 className="text-base md:text-lg font-normal mb-3">
                       Cognitive behavioral therapy (CBT)
                     </h3>
                     <p className="text-sm md:text-base leading-relaxed font-normal">
                       Cognitive behavioral therapy focuses on the connection between people's thoughts, feelings, and behaviors to interrupt anxiety and other mental health challenges.
                     </p>
                   </div>
                   
                   <div>
                     <h3 className="text-base md:text-lg font-normal mb-3">
                       Dialectic behavioral therapy (DBT)
                     </h3>
                     <p className="text-sm md:text-base leading-relaxed font-normal">
                       Focuses on building emotional regulation skills and encouraging participants to fully accept all parts of themselves — even their anxiety.
                     </p>
                   </div>
                   
                                      <div>
                      <h3 className="text-base md:text-lg font-normal mb-3">
                        Eye movement desensitization and reprocessing (EMDR)
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed font-normal">
                        EMDR is a therapeutic technique that uses specific eye movements or tapping to help people process traumatic memories.
                      </p>
                    </div>
                    
                                                                                <div>
                        <h3 className="text-base md:text-lg font-normal mb-3">
                          Acceptance and commitment therapy (ACT)
                        </h3>
                        <p className="text-sm md:text-base leading-relaxed font-normal">
                          ACT is a mindfulness-based form of behavioral therapy. It can effectively treat depression, anxiety, psychosis, OCD, and health conditions like chronic pain.
                        </p>
                      </div>
                   </div>
                   
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               <button className="mt-8 inline-flex items-center rounded-full bg-[#38663a] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2d4f2e] w-fit">
                           Get started
                         </button>                                     
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



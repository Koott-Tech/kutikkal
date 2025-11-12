"use client";

export default function TestimonialsAbout() {
    return (
        <div className="px-[50px]">
            <section className="w-full mt-10">
                <div className="min-h-[75vh] w-full rounded-2xl overflow-hidden bg-white">
                    <div className="w-full p-8">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h2 
                              className="text-[2.5rem] md:text-[3.75rem] font-medium md:font-[500] leading-[110%] md:leading-[3.975rem] tracking-[-0.125rem] md:tracking-[-0.195rem] mb-2 md:mb-4 text-center"
                            >
                              Where purpose feels real
                            </h2>
                            <p className="text-lg text-gray-600">Every story we tell, every session we take, reminds us why we started to make care feel human again.</p>
                        </div>

                        {/* Grid Cards Layout */}
                        <div className="flex md:grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 overflow-x-auto md:overflow-x-visible">
                            {/* Fathima Liana */}
                            <div className="md:col-span-1 bg-green-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg font-medium mb-4">"Little Care feels like home — warm, genuine, and full of heart. I love that we get to work closely with families and really see the difference small changes can make in a child's life."</p>

                                <div className="mt-auto">
                                    <p className="text-sm font-medium">Fathima Liana - Consultant Psychologist</p>
                                </div>
                            </div>
                            
                            {/* Anusmitha Praveen */}
                            <div className="md:col-span-1 bg-amber-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg font-medium mb-4">"What I really love about Little Care is the space it gives us to connect deeply with every child's journey. The team spirit here is amazing — we learn from each other every day."</p>

                                <div className="mt-auto">
                                    <p className="text-sm font-medium">Anusmitha Praveen - Consultant Psychologist</p>
                                </div>
                            </div>
                            
                            {/* Irene Marium */}
                            <div className="md:col-span-1 bg-cyan-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg font-medium mb-4">"Little Care blends science with softness in such a beautiful way. We use solid clinical methods, but there's always warmth and creativity behind every session."</p>

                                <div className="mt-auto">
                                    <p className="text-sm font-medium">Irene Marium - Consultant Psychologist</p>
                                </div>
                            </div>
                            
                            {/* Athulya O */}
                            <div className="md:col-span-1 bg-blue-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg font-medium mb-4">"There's so much creativity here! From therapy games to fun tools and parent sessions — it's all about helping kids grow while keeping therapy engaging and playful."</p>

                                <div className="mt-auto">
                                    <p className="text-sm font-medium">Athulya O - Consultant Psychologist</p>
                                </div>
                            </div>
                            
                            {/* Bhavith */}
                            <div className="bg-purple-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg mb-4">"What I love most is how collaborative the team is. Everyone genuinely cares — we celebrate small wins together and support each other through challenges. It really feels like a family."</p>

                                <div className="mt-auto">
                                    <p className="text-sm font-medium">Bhavith - Brand Designer</p>
                                </div>
                            </div>
                            
                            {/* Abhishek */}
                            <div className="bg-teal-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg mb-4">"Working with Little Care has been truly meaningful. It's not just about building a platform — it's about creating something that genuinely helps children and parents connect with care. Knowing our tech makes therapy easier and more accessible makes it all worth it."</p>

                                <div className="mt-auto">
                                    <p className="text-sm font-medium">Abhishek - Software Developer</p>
                                </div>
                            </div>
                            
                            {/* Jishnu */}
                            <div className="bg-pink-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg mb-4">"At Little Care, digital marketing never feels like marketing. We're not pushing content — we're sharing stories that matter. Every campaign shows how powerful it is when empathy meets purpose, and seeing parents connect because of something we created is what keeps me inspired."</p>

                                <div className="mt-auto">
                                    <p className="text-sm font-medium">Jishnu - Digital Marketing Specialist</p>
                                </div>
                            </div>
                            
                            {/* Shinas */}
                            <div className="bg-indigo-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg mb-4">"Working with Little Care has changed how I see storytelling. Every frame we capture holds real emotion — a child's progress, a parent's relief, a therapist's quiet pride. It's more than videos; it's documenting hope in its simplest form. I'm proud to be part of something so honest and meaningful."</p>

                                <div className="mt-auto">
                                    <p className="text-sm font-medium">Shinas - Videographer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

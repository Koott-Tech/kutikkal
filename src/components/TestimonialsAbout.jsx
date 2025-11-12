"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from "next/image";

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
                              We take pride in connecting patients and providers.
                            </h2>
                            <p className="text-lg text-gray-600">We're making online therapy work the way it should.</p>
                        </div>

                        {/* Grid Cards Layout */}
                        <div className="flex md:grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 overflow-x-auto md:overflow-x-visible">
                            {/* Left side - Text content card (top half) */}
                            <div className="md:col-span-1 bg-green-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg font-medium mb-4">"I didn't know where to start, but Little Care made it easy. They guided us with so much patience."</p>

                                <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Albin.webp"
                                            alt="Albin"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>A</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <cite className="text-sm font-medium">Albin</cite>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content card (bottom half) */}
                            <div className="md:col-span-1 bg-amber-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg font-medium mb-4">"They helped me understand my child better instead of just focusing on behavior."</p>

                                <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Aswathy%20Balan.webp"
                                            alt="Aswathy Balan"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>AB</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <cite className="text-sm font-medium">Aswathy Balan</cite>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Testimonial card 5 */}
                            <div className="md:col-span-1 bg-cyan-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg font-medium mb-4">"We finally found a place where my child feels heard. The sessions made such a difference at home."</p>

                                <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Thaniya.webp"
                                            alt="Thaniya"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Thaniya</cite>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="md:col-span-1 bg-blue-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg font-medium mb-4">"It felt like talking to someone who actually gets what parenting is like."</p>

                                <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Aswathy%20Sambath.webp"
                                            alt="Aswathy Sambath"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>AS</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Aswathy Sambath</cite>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Testimonial card 6 */}
                            <div className="bg-purple-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg mb-4">"The team was kind, patient, and explained everything clearly. I felt supported as a parent too."</p>

                                <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Athullya.webp"
                                            alt="Athullya Nair"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>AN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">Athullya Nair</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Testimonial card 7 */}
                            <div className="bg-teal-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg mb-4">"My son actually looks forward to his sessions now. That says everything."</p>

                                <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Gayathri.webp"
                                            alt="Gayathri"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>G</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">Gayathri</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Additional card 1 */}
                            <div className="bg-pink-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg mb-4">"They really understood my child instead of just giving advice. It felt personal and warm."</p>

                                <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Faisal.webp"
                                            alt="Faisal Vysam Purath"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>FVP</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">Faisal Vysam Purath</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Additional card 2 */}
                            <div className="bg-indigo-100 rounded-2xl p-6 min-w-[300px] md:min-w-0 flex flex-col">
                                <p className="text-lg mb-4">"I was nervous at first, but the therapist made both of us comfortable from day one."</p>

                                <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Aswathy%20Raman.webp"
                                            alt="Aswathy Usha Raman"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>AUR</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">Aswathy Usha Raman</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

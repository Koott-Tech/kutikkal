"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from "next/image";

export default function Testimonials() {
    return (
        <div className="px-[50px]">
            <section className="w-full mt-6 md:mt-8 mb-6 md:mb-8">
                <div className="h-[100vh] w-full rounded-2xl overflow-hidden bg-white">
                    <div className="h-full w-full p-8">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h2 className="text-[2.5rem] md:text-4xl lg:text-5xl font-medium mb-2 tracking-[-0.125rem] md:tracking-normal leading-[110%] md:leading-normal">Hear from our patients</h2>
                            <p className="text-[1.125rem] md:text-lg text-gray-600 tracking-[-0.03375rem] md:tracking-normal leading-[154%] md:leading-normal">We're making online therapy work the way it should.</p>
                        </div>

                        {/* Grid Cards Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 h-[calc(100%-120px)] overflow-x-auto md:overflow-x-visible">
                            {/* Left side - Text content card (top half) */}
                            <div className="md:col-span-1 bg-green-100 rounded-2xl p-6 min-w-[300px] md:min-w-0">
                                <div className="h-6 w-fit bg-green-200 rounded px-3 py-1 mb-4">
                                    <span className="text-sm font-medium text-green-800">Verified Patient</span>
                                </div>
                                <blockquote className="space-y-4">
                                    <p className="text-lg font-medium">Rula was the only way I was able to find a therapist. Everywhere else I was running into barriers. At a time when I was really struggling, finding help seemed impossible. Rula made it possible.</p>

                                    <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                        <Avatar className="size-12">
                                            <AvatarImage
                                                src="/hero.png"
                                                alt="Rula Patient"
                                                height="400"
                                                width="400"
                                                loading="lazy"
                                            />
                                            <AvatarFallback>RP</AvatarFallback>
                                        </Avatar>

                                        <div>
                                            <cite className="text-sm font-medium">Rula Patient</cite>
                                            <span className="text-muted-foreground block text-sm">Verified User</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </div>
                            
                            {/* Content card (bottom half) */}
                            <div className="md:col-span-1 bg-amber-100 rounded-2xl p-6 min-w-[300px] md:min-w-0">
                                <div className="h-6 w-fit bg-amber-200 rounded px-3 py-1 mb-4">
                                    <span className="text-sm font-medium text-amber-800">Success Story</span>
                                </div>
                                <blockquote className="space-y-4">
                                    <p className="text-lg font-medium">Through consistent therapy sessions, I've learned valuable coping mechanisms and gained a deeper understanding of myself. The progress I've made is truly life-changing.</p>

                                    <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                        <Avatar className="size-12">
                                            <AvatarImage
                                                src="/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
                                                alt="Rula Patient"
                                                height="400"
                                                width="400"
                                                loading="lazy"
                                            />
                                            <AvatarFallback>RP</AvatarFallback>
                                        </Avatar>

                                        <div>
                                            <cite className="text-sm font-medium">Rula Patient</cite>
                                            <span className="text-muted-foreground block text-sm">Verified User</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </div>
                            
                            {/* Right side - Two separate cards instead of one large video card */}
                            <div className="md:col-span-1 rounded-2xl overflow-hidden min-w-[300px] md:min-w-0">
                                <video
                                    src="/lg-video-card-ashley-1.mp4"
                                    className="h-full w-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            </div>
                            
                            <div className="md:col-span-1 bg-blue-100 rounded-2xl p-6 min-w-[300px] md:min-w-0">
                                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                    <p className="text-lg font-medium">Finding mental healthcare through insurance can be a daunting task, but Rula made it easy to find a therapist who meets my needs and takes my insurance.</p>

                                    <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                        <Avatar className="size-12">
                                            <AvatarImage
                                                src="/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
                                                alt="Rula Patient"
                                                height="400"
                                                width="400"
                                                loading="lazy"
                                            />
                                            <AvatarFallback>RP</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <cite className="text-sm font-medium">Rula Patient</cite>
                                            <span className="text-muted-foreground block text-sm">Verified User</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </div>
                            
                            {/* Image card 1 */}
                            <div className="rounded-2xl overflow-hidden">
                                <Image
                                    src="/kids.png"
                                    alt="Children in therapy session"
                                    width={400}
                                    height={400}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            
                            {/* Image card 2 */}
                            <div className="rounded-2xl overflow-hidden">
                                <Image
                                    src="/treatment-plan.webp"
                                    alt="Therapy treatment plan"
                                    width={400}
                                    height={400}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            
                            {/* Additional card 1 */}
                            <div className="bg-pink-100 rounded-2xl p-6">
                                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                    <p className="text-lg">I love how easy it is to schedule sessions and the flexibility of online therapy. My therapist is amazing and I've made significant progress in just a few months.</p>

                                    <div className="grid grid-cols-[auto_1fr] gap-3">
                                        <Avatar className="size-12">
                                            <AvatarImage
                                                src="/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
                                                alt="Rula Patient"
                                                height="400"
                                                width="400"
                                                loading="lazy"
                                            />
                                            <AvatarFallback>RP</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">Rula Patient</p>
                                            <span className="text-muted-foreground block text-sm">Verified User</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </div>
                            
                            {/* Additional card 2 */}
                            <div className="bg-indigo-100 rounded-2xl p-6">
                                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                    <p className="text-lg">The quality of care I've received through Rula has been exceptional. My therapist truly understands my needs and has helped me develop better coping strategies.</p>

                                    <div className="grid grid-cols-[auto_1fr] gap-3">
                                        <Avatar className="size-12">
                                            <AvatarImage
                                                src="/hero.png"
                                                alt="Rula Patient"
                                                height="400"
                                                width="400"
                                                loading="lazy"
                                            />
                                            <AvatarFallback>RP</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">Rula Patient</p>
                                            <span className="text-muted-foreground block text-sm">Verified User</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}



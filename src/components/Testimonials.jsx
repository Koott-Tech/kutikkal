"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from "next/image";

export default function Testimonials() {
    return (
        <section className="h-screen w-full bg-white flex items-center justify-center mt-32">
            <div className="mx-auto max-w-6xl space-y-6 px-6 md:space-y-12 h-full flex flex-col justify-center">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-4xl font-medium lg:text-5xl">Hear from our patients</h2>
                    <p className="text-lg text-gray-600">We're making online therapy work the way it should.</p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2 flex-1">
                    {/* Left side - Text content card */}
                    <div className="sm:col-span-1 lg:row-span-2 bg-green-100 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                            <div className="h-6 w-fit bg-green-200 rounded px-3 py-1 mb-4">
                                <span className="text-sm font-medium text-green-800">Verified Patient</span>
                            </div>
                            <blockquote className="space-y-6">
                                <p className="text-xl font-medium">Rula was the only way I was able to find a therapist. Everywhere else I was running into barriers. At a time when I was really struggling, finding help seemed impossible. Rula made it possible.</p>

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
                    </div>
                    
                    {/* Right side - Video card */}
                    <div className="sm:col-span-1 lg:row-span-2 rounded-2xl overflow-hidden">
                        <video
                            src="/lg-video-card-ashley-1.mp4"
                            className="h-full w-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    </div>
                    
                    <div className="md:col-span-2 bg-blue-100 rounded-2xl p-6">
                        <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                            <p className="text-xl font-medium">Finding mental healthcare through insurance can be a daunting task, but Rula made it easy to find a therapist who meets my needs and takes my insurance.</p>

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
                    
                    <div className="bg-gradient-to-b from-purple-100 to-white rounded-2xl p-6">
                        <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                            <p>I was hesitant to go the online therapy route. But I am so glad I did. It was all an easy process and I absolutely adore my therapist. I've learned and grown so much.</p>

                            <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
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
                    
                    <div className="bg-yellow-100 rounded-2xl p-6">
                        <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                            <p>The platform is easy to use in that I can see what each therapist specializes in and make my choice accordingly. I am not just simply given a provider, I get to choose one.</p>

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
                </div>
            </div>
        </section>
    )
}



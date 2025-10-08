"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from 'react';
import { FaGithub } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io";

const teamMembers = [
    { id: 1, name: "Anshuman Mahato", role: "Full Stack Developer", github: "https://github.com/AnshumanMahato", linkedin: "https://www.linkedin.com/in/anshuman-mahato/", imgSource: "/images/team/anshuman-mahato.jpeg" },
    { id: 2, name: "Vinay Kumar", role: "Full Stack Developer", github: "https://github.com/vkumar8192449", linkedin: "https://www.linkedin.com/in/vk8192449/", imgSource: "/images/team/vinay-kumar.jpeg" },
    { id: 3, name: "Subrajeet Maharana", role: "Full Stack Developer", github: "https://github.com/subrajeet-maharana", linkedin: "https://www.linkedin.com/in/subrajeet-maharana/", imgSource: "/images/team/subrajeet-maharana.jpeg" }
];

const TeamMembers: React.FC = () => {
    return (
        <section id="team" className="py-16 bg-secondary/10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="flex justify-center">
                            <Card className="w-full max-w-xs shadow-sm">
                                <CardContent className="p-0 text-center">
                                    <Image src={member.imgSource} width="80" height="80" alt={member.name} className="mx-auto mt-6 rounded-full object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg">{member.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">{member.role}</p>
                                        <div className="flex justify-center space-x-4">
                                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                                <FaGithub size={20} />
                                            </a>
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                                <IoLogoLinkedin size={22} />
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamMembers;

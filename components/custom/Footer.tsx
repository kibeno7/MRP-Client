import React from 'react';

import { FaGithub } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary/10 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0 text-center md:text-left">
                        <h3 className="text-2xl font-bold">MRP</h3>
                        <p className="text-sm text-muted-foreground">Real Interview Experiences</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <FaGithub size={24} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <IoLogoLinkedin size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <FaXTwitter size={24} />
                        </a>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} MRP. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
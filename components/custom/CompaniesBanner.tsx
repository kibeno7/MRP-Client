"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const companies = [
    { name: 'walmart', imgSrc: '/images/companies/walmart.svg' },
    { name: 'visa', imgSrc: '/images/companies/visa.svg' },
    { name: 'siemens', imgSrc: '/images/companies/siemens.svg' },
    { name: 'samsung', imgSrc: '/images/companies/samsung.svg' },
    { name: 'oracle', imgSrc: '/images/companies/oracle.svg' },
    { name: 'nvidia', imgSrc: '/images/companies/nvidia.svg' },
    { name: 'nokia', imgSrc: '/images/companies/nokia.svg' },
    { name: 'microsoft', imgSrc: '/images/companies/microsoft.svg' },
    { name: 'mastercard', imgSrc: '/images/companies/mastercard.svg' },
    { name: 'ibm', imgSrc: '/images/companies/ibm.svg' },
    { name: 'ge', imgSrc: '/images/companies/ge.svg' },
    { name: 'flipkart', imgSrc: '/images/companies/flipkart.svg' },
    { name: 'amazon', imgSrc: '/images/companies/amazon.svg' },
];

const CompaniesBanner: React.FC = () => {
    return (
        <div className="py-12 bg-secondary/10">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-semibold text-center mb-8">Our Alumni Work At</h2>
                <div className="overflow-hidden">
                    <motion.div
                        className="flex space-x-8"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    >
                        {[...companies].map((company, index) => (
                            <div key={index} className="flex-shrink-0">
                                <Image src={company.imgSrc} alt={company.name} width="80" height="80" className="h-20 mx-4" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CompaniesBanner;
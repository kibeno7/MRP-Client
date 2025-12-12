"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const companies = [
  { name: "msci", imgSrc: "/images/companies/msci.png" },
  { name: "anchanto", imgSrc: "/images/companies/anchanto.png" },
  { name: "visa", imgSrc: "/images/companies/visa.png" },
  {
    name: "texas instruments",
    imgSrc: "/images/companies/texas-instruments.png",
  },
  { name: "walmart", imgSrc: "/images/companies/walmart.png" },
  { name: "optum", imgSrc: "/images/companies/optum.png" },
  { name: "google", imgSrc: "/images/companies/google.png" },
  { name: "samsung", imgSrc: "/images/companies/samsung.png" },
  { name: "oracle", imgSrc: "/images/companies/oracle.png" },
  { name: "nvidia", imgSrc: "/images/companies/nvidia.png" },
  { name: "siemens", imgSrc: "/images/companies/siemens.png" },
  { name: "morgan-stanley", imgSrc: "/images/companies/morganstanley.png" },
  { name: "nokia", imgSrc: "/images/companies/nokia.png" },
  { name: "genpact", imgSrc: "/images/companies/genpact.png" },
  { name: "flipkart", imgSrc: "/images/companies/flipkart.jpeg" },
  { name: "goldman-sachs", imgSrc: "/images/companies/goldman.png" },
  { name: "amazon", imgSrc: "/images/companies/amazon.png" },
  { name: "microsoft", imgSrc: "/images/companies/microsoft.png" },
  { name: "blue yonder", imgSrc: "/images/companies/blue-yonder.png" },
  { name: "mastercard", imgSrc: "/images/companies/mastercard.png" },
  { name: "ibm", imgSrc: "/images/companies/IBM.png" },
  { name: "fastenal", imgSrc: "/images/companies/fastenal.png" },
  { name: "delloite", imgSrc: "/images/companies/delloite.png" },
  { name: "ge", imgSrc: "/images/companies/ge.png" },
  { name: "jpmorgan", imgSrc: "/images/companies/jpmorgan.png" },
  { name: "infosys", imgSrc: "/images/companies/infosys.png" },
  { name: "amdocs", imgSrc: "/images/companies/amdocs.jpeg" },
];

const CompaniesBanner: React.FC = () => {
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="py-12 bg-secondary/10 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 text-center">
          Our Alumni Work At
        </h2>
      </div>

      <div
        className="relative w-full flex overflow-hidden"
        style={{
          // Fade-out effect on left and right edges
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <motion.div
          className="flex flex-nowrap gap-12"
          animate={{ x: "-50%" }}
          initial={{ x: 0 }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 50,
          }}
        >
          {duplicatedCompanies.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="relative flex-shrink-0 w-40 h-24 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <Image
                src={company.imgSrc}
                alt={company.name}
                fill
                sizes="(max-width: 768px) 100px, 160px"
                className="object-contain p-2"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CompaniesBanner;

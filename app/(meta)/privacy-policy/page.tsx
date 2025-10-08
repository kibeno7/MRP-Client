import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-4 text-center">Last updated: October 13, 2024</p>
            <ScrollArea className="w-[80vw] lg:w-[40vw] rounded-md border p-4 mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Interpretation and Definitions</AccordionTrigger>
                        <AccordionContent>
                            <h3 className="text-xl font-semibold mb-2">Interpretation</h3>
                            <p className="mb-4">The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

                            <h3 className="text-xl font-semibold mb-2">Definitions</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Account:</strong> A unique account created for You to access our Service or parts of our Service.</li>
                                <li><strong>Affiliate:</strong> An entity that controls, is controlled by or is under common control with a party, where control means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
                                {/* Add more definitions here */}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>Collecting and Using Your Personal Data</AccordionTrigger>
                        <AccordionContent>
                            <h3 className="text-xl font-semibold mb-2">Types of Data Collected</h3>
                            <h4 className="text-lg font-medium mb-2">Personal Data</h4>
                            <p className="mb-2">While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Email address</li>
                                <li>First name and last name</li>
                                <li>Usage Data</li>
                            </ul>

                            <h4 className="text-lg font-medium mt-4 mb-2">Usage Data</h4>
                            <p className="mb-2">Usage Data is collected automatically when using the Service.</p>
                            {/* Add more content about usage data here */}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Use of Your Personal Data</AccordionTrigger>
                        <AccordionContent>
                            <p className="mb-2">The Company may use Personal Data for the following purposes:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>To provide and maintain our Service,</strong> including to monitor the usage of our Service.</li>
                                <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
                                {/* Add more uses of personal data here */}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Add more AccordionItems for other sections */}

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Contact Us</AccordionTrigger>
                        <AccordionContent>
                            <p className="mb-2">If you have any questions about this Privacy Policy, You can contact us:</p>
                            <ul className="list-disc pl-5">
                                <li>By visiting this page on our website: <a href="https://mrp-nitjsr.vercel.app/#contact" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://mrp-nitjsr.vercel.app/#contact</a></li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ScrollArea>
        </div>
    );
};

export default PrivacyPolicy;
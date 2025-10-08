import CompaniesBanner from '@/components/custom/CompaniesBanner';
import ContactForm from '@/components/custom/ContactForm';
import Footer from '@/components/custom/Footer';
import HeroSection from '@/components/custom/HeroSection';
import Navbar from '@/components/custom/Navbar';
import TeamMembers from '@/components/custom/TeamMembers';
import UserReviews from '@/components/custom/UserReviews';
import React from 'react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <HeroSection />
            <CompaniesBanner />
            <UserReviews />
            <TeamMembers />
            <ContactForm />
            <Footer />
        </div>
    );
};

export default LandingPage;
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CommunitySection } from "@/components/layout/sections/community";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { PricingSection } from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";
import { SponsorsSection } from "@/components/layout/sections/sponsors";
import { TeamSection } from "@/components/layout/sections/team";
import { TestimonialSection } from "@/components/layout/sections/testimonial";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Example of how to use the auth information
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // User is authenticated, we can access their information
        console.log(`Welcome back, ${user.name}!`);
        console.log(`User ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
      } else {
        // User is not authenticated
        console.log("User is not logged in");
      }
    }
  }, [user, isAuthenticated, isLoading]);

  return (
    <>
      {/* Optional: Display a welcome message for authenticated users */}
      {isAuthenticated && user && (
        <div className="bg-primary/10 py-2 px-4 text-center">
          <p className="text-sm">
            Welcome back, <span className="font-semibold">{user.name}</span>!
          </p>
        </div>
      )}

      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialSection />
      <TeamSection />
      <CommunitySection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}

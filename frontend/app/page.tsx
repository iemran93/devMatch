"use client"

// import { useAuth } from "@/context/auth-context";
import { HeroSection } from "@/components/layout/sections/hero"
import { Projects } from "@/components/layout/sections/Project"

export default function Home() {
  return (
    <>
      <HeroSection />
      <Projects />
      {/* <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialSection />
      <TeamSection />
      <CommunitySection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <FooterSection /> */}
    </>
  )
}

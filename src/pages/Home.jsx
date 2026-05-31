import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import ServicesSection from '../components/landing/ServicesSection';
import DetailedServicesSection from '../components/landing/DetailedServicesSection';
import ApproachSection from '../components/landing/ApproachSection';
import ClientsSection from '../components/landing/ClientsSection';
import PhilosophySection from '../components/landing/PhilosophySection';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <DetailedServicesSection />
      <ApproachSection />
      <ClientsSection />
      <PhilosophySection />
      <ContactSection />
      <Footer />
    </div>
  );
}
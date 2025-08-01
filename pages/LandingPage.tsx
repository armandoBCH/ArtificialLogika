import React from 'react';
import Header from '../components/Header';
import NeuralBackground from '../components/NeuralBackground';
import Hero from '../components/Hero';
import Services from '../components/Services';
import ValueProposition from '../components/ValueProposition';
import ProcessSteps from '../components/ProcessSteps';
import FeaturedProjects from '../components/FeaturedProjects';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import ConnectionStatus from '../components/ConnectionStatus';

const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-x-hidden">
      {/* SEO Meta Tags and Structured Data */}
      <SEOHead 
        title="Artificial Lógika - Automatización de Negocios con IA | ROI Garantizado"
        description="Consultora boutique especializada en automatizar procesos de negocio con IA. Ahorra 15+ horas semanales, aumenta conversiones 3x. Solo 2 clientes nuevos por mes. Consulta gratuita."
        canonical="https://artificiallogika.com"
      />
      
      {/* Fondo dinámico con red neuronal */}
      <NeuralBackground />
      
      {/* Header de navegación */}
      <Header />
      
      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />
        
        {/* Services Section */}
        <Services />
        
        {/* Value Proposition Section */}
        <ValueProposition />
        
        {/* Process Steps Section */}
        <ProcessSteps />
        
        {/* Featured Projects Section */}
        <FeaturedProjects />
        
        {/* Testimonials Section */}
        <Testimonials />
        
        {/* Pricing Section */}
        <Pricing />
        
        {/* FAQ Section */}
        <FAQ />
        
        {/* Final CTA Section */}
        <FinalCTA />
        
        {/* Footer */}
        <Footer />
      </div>
      
      {/* Connection Status - Compact version for landing page */}
      <ConnectionStatus variant="compact" />
    </div>
  );
};

export default LandingPage;
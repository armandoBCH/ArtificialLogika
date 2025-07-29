import React from 'react';
import { useEditableContent } from '../contexts/EditableContentContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article';
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  canonical = 'https://artificiallogika.com',
  type = 'website' 
}) => {
  const { content } = useEditableContent();
  
  const defaultTitle = `${content.company.name} - ${content.company.tagline}`;
  const defaultDescription = "Consultora boutique de software e IA que automatiza negocios ambiciosos. Transformamos procesos manuales en sistemas automáticos con ROI garantizado en 90 días.";
  
  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  
  React.useEffect(() => {
    // Update document title
    document.title = seoTitle;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seoDescription);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);
    
    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:type', content: type },
      { property: 'og:url', content: canonical },
      { property: 'og:site_name', content: content.company.name },
      { property: 'og:locale', content: 'es_ES' }
    ];
    
    ogTags.forEach(tag => {
      let ogMeta = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', tag.property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.setAttribute('content', tag.content);
    });
    
    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seoTitle },
      { name: 'twitter:description', content: seoDescription }
    ];
    
    twitterTags.forEach(tag => {
      let twitterMeta = document.querySelector(`meta[name="${tag.name}"]`);
      if (!twitterMeta) {
        twitterMeta = document.createElement('meta');
        twitterMeta.setAttribute('name', tag.name);
        document.head.appendChild(twitterMeta);
      }
      twitterMeta.setAttribute('content', tag.content);
    });
    
    // Structured data for local business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": content.company.name,
      "description": seoDescription,
      "url": canonical,
      "telephone": content.company.phone,
      "email": content.company.email,
      "address": {
        "@type": "PostalAddress", 
        "addressLocality": content.company.address.split(',')[0],
        "addressCountry": "ES"
      },
      "sameAs": [
        content.company.socialMedia.linkedin,
        content.company.socialMedia.twitter
      ],
      "serviceType": "Software Development & AI Automation",
      "areaServed": "Spain",
      "founder": {
        "@type": "Person",
        "name": content.company.founderName,
        "jobTitle": content.company.founderTitle
      }
    };
    
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);
    
    // Basic conversion tracking setup (Google Analytics placeholder)
    const trackingId = 'GA_MEASUREMENT_ID'; // Replace with actual GA4 ID
    
    // Google Analytics gtag
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${trackingId}"]`)) {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(gtagScript);
      
      const gtagConfig = document.createElement('script');
      gtagConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}', {
          page_title: '${seoTitle}',
          page_location: '${canonical}'
        });
      `;
      document.head.appendChild(gtagConfig);
    }
    
  }, [seoTitle, seoDescription, canonical, type, content]);
  
  return null; // This component doesn't render anything
};

export default SEOHead;
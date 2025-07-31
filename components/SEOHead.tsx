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
  canonical = 'https://artificial-logika.com',
  type = 'website' 
}) => {
  const { content } = useEditableContent();
  
  const defaultTitle = `${content.company.name} - ${content.company.tagline}`;
  const defaultDescription = "Armando Beato - Desarrollador especializado en software e IA. Creo páginas web, ecommerce, chatbots y automatizaciones desde cero. Soluciones 100% autogestionables para tu negocio.";
  
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

    // Add meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'Armando Beato, desarrollador web, inteligencia artificial, chatbots, automatización, ecommerce, páginas web, landing pages, Buenos Aires, Argentina, desarrollo software');

    // Add robots meta
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // Add viewport meta
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.setAttribute('name', 'viewport');
      document.head.appendChild(metaViewport);
    }
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');

    // Add language meta
    let metaLanguage = document.querySelector('meta[http-equiv="content-language"]');
    if (!metaLanguage) {
      metaLanguage = document.createElement('meta');
      metaLanguage.setAttribute('http-equiv', 'content-language');
      document.head.appendChild(metaLanguage);
    }
    metaLanguage.setAttribute('content', 'es-ES');

    // Add preconnect for performance
    const preconnects = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ];
    
    preconnects.forEach(url => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        if (url.includes('gstatic')) link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
    
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
      { property: 'og:locale', content: 'es_ES' },
      { property: 'og:image', content: `${canonical}/og-image.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: `${content.company.name} - Desarrollador de Software e IA` }
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
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: `${canonical}/og-image.jpg` },
      { name: 'twitter:creator', content: '@armando_beato' },
      { name: 'twitter:site', content: '@armando_beato' }
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
    
    // Enhanced structured data
    const structuredData = [
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": content.company.name,
        "alternateName": "Armando Beato Developer",
        "description": seoDescription,
        "url": canonical,
        "telephone": content.company.phone,
        "email": content.company.email,
        "address": {
          "@type": "PostalAddress", 
          "addressLocality": content.company.address.split(',')[0] || "Olavarría",
          "addressCountry": "AR"
        },
        "sameAs": [
          content.company.socialMedia.linkedin,
          content.company.socialMedia.twitter
        ],
        "serviceType": ["Software Development", "AI Automation", "Web Development", "E-commerce Development"],
        "areaServed": {
          "@type": "Country",
          "name": "Argentina"
        },
        "founder": {
          "@type": "Person",
          "name": content.company.founderName,
          "jobTitle": content.company.founderTitle
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "ratingCount": "15",
          "bestRating": "5",
          "worstRating": "1"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Servicios de Software e IA",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Desarrollo Web",
                "description": "Páginas web y landing pages autogestionables"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "Service",
                "name": "E-commerce",
                "description": "Tiendas online completas con gestión autónoma"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service", 
                "name": "Chatbots e IA",
                "description": "Asistentes inteligentes y automatizaciones"
              }
            }
          ]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": content.company.name,
        "url": canonical,
        "logo": `${canonical}/logo.png`,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": content.company.phone,
          "contactType": "customer service",
          "email": content.company.email,
          "availableLanguage": "Spanish"
        },
        "foundingDate": "2024",
        "numberOfEmployees": "1-10",
        "slogan": content.company.tagline
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": content.company.name,
        "url": canonical,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${canonical}?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ];
    
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
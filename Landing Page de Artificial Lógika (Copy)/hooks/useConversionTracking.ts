import { useCallback } from 'react';

interface ConversionEvent {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const useConversionTracking = () => {
  
  // Track conversion events
  const trackEvent = useCallback((event: ConversionEvent) => {
    // Google Analytics 4 tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event_name, {
        event_category: event.event_category,
        event_label: event.event_label,
        value: event.value,
        ...event.custom_parameters
      });
    }
    
    // Facebook Pixel tracking (if available)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', event.event_name, {
        value: event.value,
        currency: 'EUR',
        ...event.custom_parameters
      });
    }
    
    // Console log for debugging (remove in production)
    console.log('Conversion tracked:', event);
  }, []);

  // Pre-defined conversion tracking functions
  const trackCTAClick = useCallback((cta_location: string, cta_text?: string) => {
    trackEvent({
      event_name: 'cta_click',
      event_category: 'engagement',
      event_label: cta_location,
      custom_parameters: {
        cta_text,
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  const trackFormStart = useCallback((form_name: string) => {
    trackEvent({
      event_name: 'form_start',
      event_category: 'lead_generation',
      event_label: form_name,
      custom_parameters: {
        form_name,
        page_location: window.location.href
      }
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((form_name: string, lead_value?: number) => {
    trackEvent({
      event_name: 'form_submit',
      event_category: 'lead_generation', 
      event_label: form_name,
      value: lead_value || 100, // Default lead value
      custom_parameters: {
        form_name,
        lead_value: lead_value || 100,
        conversion_type: 'lead'
      }
    });
  }, [trackEvent]);

  const trackSectionView = useCallback((section_name: string) => {
    trackEvent({
      event_name: 'section_view',
      event_category: 'engagement',
      event_label: section_name,
      custom_parameters: {
        section_name,
        scroll_depth: Math.round((window.scrollY / document.body.scrollHeight) * 100)
      }
    });
  }, [trackEvent]);

  const trackPricingView = useCallback((plan_name: string) => {
    trackEvent({
      event_name: 'pricing_view',
      event_category: 'consideration',
      event_label: plan_name,
      custom_parameters: {
        plan_name,
        page_section: 'pricing'
      }
    });
  }, [trackEvent]);

  const trackCallBooking = useCallback(() => {
    trackEvent({
      event_name: 'call_booking_intent',
      event_category: 'conversion',
      event_label: 'consultation_booking',
      value: 500, // High-intent lead value
      custom_parameters: {
        conversion_type: 'high_intent_lead',
        lead_source: 'website'
      }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackCTAClick,
    trackFormStart,
    trackFormSubmit,
    trackSectionView,
    trackPricingView,
    trackCallBooking
  };
};
export interface SiteConfig {
    id: string;
    key: string;
    value: string;
    type: "string" | "number" | "boolean" | "json";
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface PricingPlan {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    original_price: number | null;
    currency: string;
    payment_type: string;
    price_note: string | null;
    features: PricingFeature[];
    is_featured: boolean;
    featured_label: string | null;
    cta_text: string;
    cta_style: "primary" | "secondary" | "default";
    header_bg: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PricingFeature {
    text: string;
    icon: string;
    is_highlighted: boolean;
    icon_bg: string;
}

export interface ServiceFeature {
    text: string;
    visible: boolean;
    order: number;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price_from: string;
    icon: string;
    icon_color: string;
    accent_color: string;
    features: ServiceFeature[];
    is_popular: boolean;
    popular_label: string | null;
    cta_text: string;
    cta_style: "primary" | "secondary" | "default";
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PortfolioProject {
    id: string;
    title: string;
    category: string;
    external_url: string | null;
    applied_services: string[];
    applied_features: string[];
    is_sample: boolean;
    tags: string[];
    description: string;
    description_long: string;
    image_url: string;
    image_alt: string;
    accent_color: string;
    stats: PortfolioStat[];
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PortfolioStat {
    value: string;
    label: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    quote: string;
    avatar_url: string;
    badge_text: string;
    badge_color: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ContactLead {
    id: string;
    name: string;
    contact: string;
    business_type: string;
    message: string;
    created_at: string;
}

// Helper type for site config as key-value map
export type SiteConfigMap = Record<string, string>;

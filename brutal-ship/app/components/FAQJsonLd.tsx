import type { FAQ } from "@/lib/types/database";

interface FAQJsonLdProps {
    faqs: FAQ[];
}

export default function FAQJsonLd({ faqs }: FAQJsonLdProps) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs
            .filter((faq) => faq.is_active)
            .map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                },
            })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(faqSchema),
            }}
        />
    );
}

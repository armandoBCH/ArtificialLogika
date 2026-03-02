import { createClient } from "@/lib/supabase/server";
import type { FAQ } from "@/lib/types/database";

const DEFAULT_FAQS: FAQ[] = [
    {
        id: "1",
        question: "¿Cuánto tarda en estar lista mi web?",
        answer: "Para una Landing Page, entre 1 y 2 semanas. Para sitios institucionales o e-commerce, entre 2 y 4 semanas. Te damos un plazo concreto desde el día uno y siempre lo cumplimos.",
        display_order: 1,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "2",
        question: "¿Tengo que saber de tecnología?",
        answer: "No, para nada. Nosotros nos encargamos de absolutamente todo: diseño, desarrollo, que funcione en celulares, que aparezca en Google, dominio, hosting y certificado de seguridad. Vos solo nos contás qué necesitás.",
        display_order: 2,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "3",
        question: "¿El precio incluye dominio y hosting?",
        answer: "Te ayudamos a configurar todo: dominio (.com o .com.ar), hosting, emails profesionales y certificado de seguridad (el candadito verde). El costo del dominio y hosting es aparte (generalmente menos de $20 USD/año), pero nosotros lo tramitamos por vos.",
        display_order: 3,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "4",
        question: "¿Qué pasa si necesito algo más complejo?",
        answer: "Los precios que ves son la base. Si tu proyecto necesita funciones extra (reservas online, sistema de turnos, integración con software, idiomas múltiples, etc.), te armamos un presupuesto personalizado. Siempre sabés el precio total antes de arrancar.",
        display_order: 4,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "5",
        question: "¿Tengo que pagar mantenimiento mensual?",
        answer: "No es obligatorio. Te entregamos la web terminada y funcionando con 1 mes de soporte incluido. Si después querés que nos encarguemos de actualizaciones y cambios, tenemos planes opcionales muy accesibles.",
        display_order: 5,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "6",
        question: "¿Para qué tipo de negocio trabajan?",
        answer: "Para todos. Peluquerías, restaurantes, clínicas, estudios contables, tiendas de ropa, profesionales independientes, PyMEs y emprendedores. Si tenés un negocio o proyecto, te hacemos tu web.",
        display_order: 6,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "7",
        question: "¿Cómo es la forma de pago?",
        answer: "Trabajamos con un 50% de seña para arrancar y el 50% restante al entregar. Si no te gusta el diseño inicial, te devolvemos la seña. Aceptamos transferencia bancaria y podemos armar un plan de pago si lo necesitás.",
        display_order: 7,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
    {
        id: "8",
        question: "¿Mi web va a aparecer en Google?",
        answer: "Sí. Todas nuestras webs están configuradas para que Google las encuentre y las muestre cuando alguien busque tu tipo de negocio. Esto se llama SEO y viene incluido en todos los planes.",
        display_order: 8,
        is_active: true,
        created_at: "",
        updated_at: "",
    },
];

export async function getFaqs(): Promise<FAQ[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("faqs")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true });

        if (error || !data || data.length === 0) {
            return DEFAULT_FAQS;
        }

        return data as FAQ[];
    } catch {
        return DEFAULT_FAQS;
    }
}

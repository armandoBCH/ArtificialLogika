import { createClient } from "@/lib/supabase/server";
import type { SiteConfigMap } from "@/lib/types/database";

const DEFAULT_CONFIG: SiteConfigMap = {
    whatsapp_number: "5492284638361",
    whatsapp_message: "Hola! Quiero consultar por una web para mi negocio",
    email: "",
    location: "Buenos Aires, Argentina",
    instagram_url: "",
    response_time: "48hs",
};

export async function getSiteConfig(): Promise<SiteConfigMap> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("site_config")
            .select("key, value")
            .eq("is_active", true);

        if (error || !data || data.length === 0) {
            return DEFAULT_CONFIG;
        }

        const configMap: SiteConfigMap = { ...DEFAULT_CONFIG };
        for (const row of data) {
            configMap[row.key] = row.value;
        }
        return configMap;
    } catch {
        return DEFAULT_CONFIG;
    }
}

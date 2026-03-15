import { NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/analytics";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const data = await getAnalyticsData();
        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "private, max-age=300", // 5 min cache
            },
        });
    } catch (error) {
        console.error("[Analytics API]", error);
        return NextResponse.json(
            {
                configured: false,
                error: "Error al obtener datos de Analytics",
                kpis: {
                    activeUsers: 0,
                    sessions: 0,
                    pageViews: 0,
                    bounceRate: 0,
                    avgSessionDuration: 0,
                    activeUsersChange: 0,
                    sessionsChange: 0,
                    pageViewsChange: 0,
                    bounceRateChange: 0,
                },
                dailyVisitors: [],
                topPages: [],
                trafficSources: [],
            },
            { status: 200 } // Return 200 so the UI can handle it gracefully
        );
    }
}

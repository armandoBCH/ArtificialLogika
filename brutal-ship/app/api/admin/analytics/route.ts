import { NextResponse, type NextRequest } from "next/server";
import { getAnalyticsData } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const days = parseInt(searchParams.get("days") || "30", 10);
        
        // Ensure days is one of the allowed values to prevent abuse
        const allowedDays = [7, 30, 90];
        const validDays = allowedDays.includes(days) ? days : 30;

        const data = await getAnalyticsData(validDays);
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
                deviceCategories: [],
                days: 30,
            },
            { status: 200 } // Return 200 so the UI can handle it gracefully
        );
    }
}

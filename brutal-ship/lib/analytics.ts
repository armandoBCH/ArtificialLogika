import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA_PROPERTY_ID;
const clientEmail = process.env.GA_CLIENT_EMAIL;
const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n");

function getClient() {
    if (!propertyId || !clientEmail || !privateKey) {
        return null;
    }
    return new BetaAnalyticsDataClient({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
    });
}

export interface AnalyticsKPI {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    // Comparison with previous period
    activeUsersChange: number;
    sessionsChange: number;
    pageViewsChange: number;
    bounceRateChange: number;
}

export interface DailyVisitors {
    date: string;
    visitors: number;
}

export interface TopPage {
    path: string;
    views: number;
}

export interface TrafficSource {
    source: string;
    sessions: number;
    percentage: number;
}

export interface AnalyticsData {
    kpis: AnalyticsKPI;
    dailyVisitors: DailyVisitors[];
    topPages: TopPage[];
    trafficSources: TrafficSource[];
    configured: boolean;
}

function calcChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
    const client = getClient();

    if (!client) {
        return {
            configured: false,
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
        };
    }

    const [kpiResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            { startDate: "30daysAgo", endDate: "today" },
            { startDate: "60daysAgo", endDate: "31daysAgo" },
        ],
        metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
        ],
    });

    const currentRow = kpiResponse.rows?.[0];
    const previousRow = kpiResponse.rows?.[1];

    const getMetric = (row: typeof currentRow, idx: number) =>
        parseFloat(row?.metricValues?.[idx]?.value ?? "0");

    const kpis: AnalyticsKPI = {
        activeUsers: getMetric(currentRow, 0),
        sessions: getMetric(currentRow, 1),
        pageViews: getMetric(currentRow, 2),
        bounceRate: Math.round(getMetric(currentRow, 3) * 100),
        avgSessionDuration: Math.round(getMetric(currentRow, 4)),
        activeUsersChange: calcChange(getMetric(currentRow, 0), getMetric(previousRow, 0)),
        sessionsChange: calcChange(getMetric(currentRow, 1), getMetric(previousRow, 1)),
        pageViewsChange: calcChange(getMetric(currentRow, 2), getMetric(previousRow, 2)),
        bounceRateChange: calcChange(
            Math.round(getMetric(currentRow, 3) * 100),
            Math.round(getMetric(previousRow, 3) * 100)
        ),
    };

    // Daily visitors (last 30 days)
    const [dailyResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const dailyVisitors: DailyVisitors[] =
        dailyResponse.rows?.map((row) => ({
            date: row.dimensionValues?.[0]?.value ?? "",
            visitors: parseInt(row.metricValues?.[0]?.value ?? "0", 10),
        })) ?? [];

    // Top pages
    const [pagesResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
    });

    const topPages: TopPage[] =
        pagesResponse.rows?.map((row) => ({
            path: row.dimensionValues?.[0]?.value ?? "",
            views: parseInt(row.metricValues?.[0]?.value ?? "0", 10),
        })) ?? [];

    // Traffic sources
    const [sourcesResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 6,
    });

    const totalSessions = kpis.sessions || 1;
    const trafficSources: TrafficSource[] =
        sourcesResponse.rows?.map((row) => {
            const sessions = parseInt(row.metricValues?.[0]?.value ?? "0", 10);
            return {
                source: row.dimensionValues?.[0]?.value ?? "(unknown)",
                sessions,
                percentage: Math.round((sessions / totalSessions) * 100),
            };
        }) ?? [];

    return {
        configured: true,
        kpis,
        dailyVisitors,
        topPages,
        trafficSources,
    };
}

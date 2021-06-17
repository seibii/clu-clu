export interface AnalyticsData {
  analyticsEventName: string;
  analyticsProperties: string;
}

export const analyticsData = (eventName: string, properties?: Record<string, string | number>): AnalyticsData => ({
  analyticsEventName: eventName,
  analyticsProperties: JSON.stringify(properties)
});

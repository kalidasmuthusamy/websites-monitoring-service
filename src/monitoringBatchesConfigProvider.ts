import { BatchConfig, DEFAULT_CONFIG } from "./types";
import dotenv from "dotenv";

dotenv.config();

/**
 * Monitoring Batch Configuration
 *
 * Default values (can be overridden):
 * - Timezone: UTC
 * - Max Concurrent Requests: 5
 *
 * Default Endpoint settings (can be overridden):
 * - Method: GET
 * - Timeout: 5000ms
 * - Expected Response Time: 2000ms
 * - Expected Status Code: 200
 */

// Helper function to get environment variables with defaults
const getEnvVar = (name: string, defaultValue: string): string => {
  return process.env[name] || defaultValue;
};

export const monitoringBatchesConfig: BatchConfig[] = [
  {
    id: "public-websites",
    name: "Public Websites Monitoring",
    description: "Monitor public websites for availability",
    schedule: "*/1 * * * *", // Every 1 minutes
    timezone: DEFAULT_CONFIG.TIMEZONE,
    enabled: true,
    endpoints: [
      {
        name: "Google Search",
        url: "https://www.google.com",
        method: DEFAULT_CONFIG.ENDPOINT.method,
        expectedStatusCode: DEFAULT_CONFIG.ENDPOINT.expectedStatusCode,
        expectedResponseTime: 1000, // Expect faster response from Google
        timeout: DEFAULT_CONFIG.ENDPOINT.timeout,
      },
      {
        name: "GitHub",
        url: "https://github.com",
        method: DEFAULT_CONFIG.ENDPOINT.method,
        expectedStatusCode: DEFAULT_CONFIG.ENDPOINT.expectedStatusCode,
        expectedResponseTime: DEFAULT_CONFIG.ENDPOINT.expectedResponseTime,
        timeout: DEFAULT_CONFIG.ENDPOINT.timeout,
      },
      {
        name: "NPM",
        url: "https://www.npmjs.com",
        method: DEFAULT_CONFIG.ENDPOINT.method,
        expectedStatusCode: DEFAULT_CONFIG.ENDPOINT.expectedStatusCode,
        expectedResponseTime: DEFAULT_CONFIG.ENDPOINT.expectedResponseTime,
        timeout: DEFAULT_CONFIG.ENDPOINT.timeout,
      },
    ],
    maxConcurrentRequests: DEFAULT_CONFIG.MAX_CONCURRENT_REQUESTS,
    notification: {
      emails: getEnvVar(
        "NOTIFICATION_EMAIL_ADDRESSES",
        "admin@example.com"
      ).split(","),
    },
    tags: ["public", "websites"],
  },
];

import type { Method as HttpMethod } from 'axios';

export interface MonitoringEndpoint {
  name: string;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  expectedResponseTime?: number;
  expectedStatusCode?: number;
  timeout?: number;
}

export interface NotificationConfig {
  emails: string[];
  customSubject?: string;
}

export interface BatchConfig {
  id: string;
  name: string;
  description?: string;
  schedule: string;
  timezone?: string;
  enabled: boolean;
  endpoints: MonitoringEndpoint[];
  notification: NotificationConfig;
  tags?: string[];
  maxConcurrentRequests?: number;
}

export interface MonitoringResult {
  url: string;
  statusCode: number;
  responseTime: number;
  success: boolean;
  error?: string;
  timestamp: Date;
  name: string;
  batchId: string;
}

export const DEFAULT_CONFIG = {
  TIMEZONE: 'UTC',
  MAX_CONCURRENT_REQUESTS: 5,
  ENDPOINT: {
    method: 'GET' as HttpMethod,
    expectedStatusCode: 200,
    expectedResponseTime: 2000,
    timeout: 5000
  }
} as const;

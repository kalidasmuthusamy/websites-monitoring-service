import dotenv from 'dotenv';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import nodemailer from 'nodemailer';
import { CronJob } from 'cron';
import { generateEmailHTML } from './emailHtmlGenerator';
import { logColoredResults } from './logger';
import { segragateResponseResults } from './responseSegregator';
import { getResultCSVPath, writeResponseResultsToCsv } from './csvManager';
import { monitoringBatchesConfig } from './monitoringBatchesConfigProvider';
import { getMonitoringBatchesWithCronMatchingDateTime, convertTimeZoneForDate } from './cronHelpers';
import { MonitoringResult, BatchConfig, MonitoringEndpoint, DEFAULT_CONFIG } from './types';

dotenv.config();

const PROCESS_TIME_ZONE = 'Asia/Kolkata'; // Required for CRON Configuration

const requiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
};

// Create axios instance with default configuration
const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    timeout: DEFAULT_CONFIG.ENDPOINT.timeout
  });
};

interface RequestsPromiseParams {
  endpoints: MonitoringEndpoint[];
  axiosInstance: AxiosInstance;
}

const getRequestsPromiseResults = async ({
  endpoints,
  axiosInstance
}: RequestsPromiseParams): Promise<PromiseSettledResult<AxiosResponse>[]> => {
  const requests = endpoints.map(endpoint => {
    const config = {
      timeout: endpoint.timeout,
      headers: endpoint.headers
    };
    return axiosInstance.request({
      method: endpoint.method,
      url: endpoint.url,
      ...config
    });
  });

  return Promise.allSettled(requests);
};

const getReadableResultObjects = (
  promiseResults: PromiseSettledResult<AxiosResponse>[],
  endpoints: MonitoringEndpoint[],
  batchId: string
): MonitoringResult[] => {
  return promiseResults.map((result, index) => {
    const endpoint = endpoints[index];
    const startTime = Date.now(); // For response time calculation

    if (result.status === 'fulfilled') {
      const responseTime = Date.now() - startTime;
      const withinExpectedTime = !endpoint.expectedResponseTime || responseTime <= endpoint.expectedResponseTime;
      const correctStatusCode = !endpoint.expectedStatusCode || result.value.status === endpoint.expectedStatusCode;

      return {
        url: endpoint.url,
        name: endpoint.name,
        statusCode: result.value.status,
        responseTime,
        success: withinExpectedTime && correctStatusCode,
        error: !withinExpectedTime ? 'Response time exceeded expected time' :
               !correctStatusCode ? 'Unexpected status code' : undefined,
        timestamp: new Date(),
        batchId
      };
    }

    return {
      url: endpoint.url,
      name: endpoint.name,
      statusCode: 0,
      responseTime: Date.now() - startTime,
      success: false,
      error: result.reason?.message || 'Request failed',
      timestamp: new Date(),
      batchId
    };
  });
};

const sendReportEmail = async (
  statusSegregatedResponseResults: { successResults: MonitoringResult[]; errorResults: MonitoringResult[] },
  resultCSVPath: string,
  notification: { emails: string[]; customSubject?: string }
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: requiredEnvVar('MAIL_HOST'),
    port: parseInt(requiredEnvVar('MAIL_HOST_PORT'), 10),
    auth: {
      user: requiredEnvVar('MAIL_USER_NAME'),
      pass: requiredEnvVar('MAIL_USER_PASSWORD'),
    },
  });

  const emailObject = {
    from: requiredEnvVar('MAIL_FROM_ADDRESS'),
    to: notification.emails.join(', '),
    subject: `${notification.customSubject || 'Website Monitoring Report'} - ${new Date().toLocaleString()}`,
    html: generateEmailHTML({ statusSegregatedResponseResults }),
    attachments: [{ path: resultCSVPath }]
  };

  await transporter.sendMail(emailObject);
};

const processMonitoringBatch = async (batch: BatchConfig): Promise<void> => {
  if (!batch.enabled) return;

  const axiosInstance = createAxiosInstance();
  const resultCSVPath = getResultCSVPath();

  try {
    const promiseResults = await getRequestsPromiseResults({
      endpoints: batch.endpoints,
      axiosInstance
    });

    const responsesResult = getReadableResultObjects(promiseResults, batch.endpoints, batch.id);
    const statusSegregatedResponseResults = segragateResponseResults(responsesResult);

    logColoredResults(statusSegregatedResponseResults);
    await writeResponseResultsToCsv(responsesResult, resultCSVPath);

    if (statusSegregatedResponseResults.errorResults.length > 0) {
      await sendReportEmail(
        statusSegregatedResponseResults,
        resultCSVPath,
        batch.notification
      );
    }
  } catch (error) {
    console.error(`Error processing batch ${batch.name}:`, error);
  }
};

const jobTicker = (): void => {
  const currentDateTime = convertTimeZoneForDate(new Date(), PROCESS_TIME_ZONE);

  const processableMonitoringBatches = getMonitoringBatchesWithCronMatchingDateTime({
    monitoringBatchesConfig,
    dateTime: currentDateTime,
  });

  processableMonitoringBatches.forEach(processMonitoringBatch);
};

const job = new CronJob(
  '* * * * *', // Every minute
  jobTicker,
  null,
  false,
  PROCESS_TIME_ZONE
);

// Start the monitoring
job.start();

require("dotenv").config();

const axios = require("axios").default;
const nodemailer = require("nodemailer");
const tunnel = require("tunnel");

const CronJob = require("cron").CronJob;

const { generateEmailHTML } = require("./emailHtmlGenerator");
const { logColoredResults } = require("./logger");
const { segragateResponseResults } = require("./responseSegregator");
const { resultCSVPath, writeResponseResultsToCsv } = require("./csvManager");
const {
  monitoringBatchesConfig,
} = require("./monitoringBatchesConfigProvider");

const {
  getMonitoringBatchesConfiguredForCurrentDateTime,
} = require("./cronHelpers");

const agent = tunnel.httpsOverHttp({
  proxy: {
    host: process.env.PROXY_HOST,
    port: process.env.PROXY_HOST_PORT,
  },
});

const publicAxiosInstance = axios.create();
const proxiedAxiosInstance = axios.create({
  httpsAgent: agent,
  proxy: false,
});

const getRequestsPromiseResults = async ({
  publicURLs = [],
  proxyRestrictedURLs = [],
}) => {
  const getRequestPromise = (url, axiosInstance) => axiosInstance.get(url);

  const publicWebsiteResults = await Promise.allSettled(
    publicURLs.map((url) => getRequestPromise(url, publicAxiosInstance))
  );

  const proxyRestrictedWebsiteResults = await Promise.allSettled(
    proxyRestrictedURLs.map((url) =>
      getRequestPromise(url, proxiedAxiosInstance)
    )
  );

  return [...publicWebsiteResults, ...proxyRestrictedWebsiteResults];
};

const getReadableResultObjects = (promiseResults) =>
  promiseResults.map((requestResult) => ({
    url: (requestResult.value || requestResult.reason).config.url,
    running: requestResult.status === "fulfilled" ? "Yes" : "No",
    reason:
      requestResult.status !== "fulfilled"
        ? requestResult.reason.name + " " + requestResult.reason.message
        : "",
  }));

const sendReportEmail = async ({
  statusSegregatedResponseResults,
  resultCSVPath,
  recipientEmailAddresses = [],
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_HOST_PORT,
    auth: {
      user: process.env.MAIL_USER_NAME,
      pass: process.env.MAIL_USER_PASSWORD,
    },
  });

  const emailObject = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: recipientEmailAddresses.join(", "),
    subject: `Website Monitoring Result - ${new Date().toLocaleString()}`,
    html: generateEmailHTML({ statusSegregatedResponseResults }),
    attachments: [
      {
        path: resultCSVPath,
      },
    ],
  };

  await transporter.sendMail(emailObject);
};

const processMonitoringBatch = (monitoringBatchConfig) => {
  const {
    urls: {
      public: publicURLs = [],
      proxyRestricted: proxyRestrictedURLs = [],
    },
    recipientEmailAddresses,
  } = monitoringBatchConfig;

  getRequestsPromiseResults({
    publicURLs,
    proxyRestrictedURLs,
  }).then((promiseResults) => {
    const responsesResult = getReadableResultObjects(promiseResults);
    const statusSegregatedResponseResults =
      segragateResponseResults(responsesResult);

    logColoredResults(statusSegregatedResponseResults);

    writeResponseResultsToCsv(responsesResult).then(() => {
      if (statusSegregatedResponseResults.errorResults.length > 0) {
        sendReportEmail({
          statusSegregatedResponseResults,
          resultCSVPath,
          recipientEmailAddresses,
        });
      }
    });
  });
};

const jobTicker = () => {
  const processableMonitoringBatches =
    getMonitoringBatchesConfiguredForCurrentDateTime(monitoringBatchesConfig);

  processableMonitoringBatches.forEach(processMonitoringBatch);
};

const job = new CronJob(
  "0 * * * * *", // CRON Timer for this master job (should be LCM of all cron schedules defined in monitoring batch - to cover all)
  jobTicker, // Function which will be executed on CRON Timings
  null, //no oncomplete callback
  false, //start implicitly
  "Asia/Kolkata" //CRON Job Timing should be based on IST timezone (Useful when server's system time is not IST)
);

job.start();

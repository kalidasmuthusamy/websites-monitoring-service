require("dotenv").config();

const axios = require("axios").default;
const nodemailer = require("nodemailer");

const { generateEmailHTML } = require("./emailHtmlGenerator");
const { logColoredResults } = require("./logger");
const { segragateResponseResults } = require("./responseSegregator");
const { getResultCSVPath, writeResponseResultsToCsv } = require("./csvManager");

const urls = {
  public: [
    "https://portal.uiic.in/GCWebPortal/login/LoginAction.do?p=login",
    "https://portal.uiic.in/GCWebPort/login/LoginAction.do?p=login",
  ],
  proxyRestricted: [
    "https://portal.uiic.in/GCWebPortal/login/LoginAction.do?p=login",
  ],
};

const publicAxiosInstance = axios.create();
const proxiedAxiosInstance = axios.create({
  proxy: {
    host: process.env.PROXY_HOST,
    port: process.env.PROXY_HOST_PORT,
  },
});

const getRequestsPromiseResults = async () => {
  const getRequestPromise = (url, axiosInstance) => axiosInstance.get(url);

  const publicWebsiteResults = await Promise.allSettled(
    urls.public.map((url) => getRequestPromise(url, publicAxiosInstance))
  );

  const proxyRestrictedWebsiteResults = await Promise.allSettled(
    urls.proxyRestricted.map((url) =>
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
  segregatedResponseResults,
  resultCSVPath,
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
    to: process.env.MAIL_RECIPIENT_ADDRESSES,
    subject: `Website Monitoring Result - ${new Date().toLocaleString()}`,
    html: generateEmailHTML({ segregatedResponseResults }),
    attachments: [
      {
        path: resultCSVPath,
      },
    ],
  };

  await transporter.sendMail(emailObject);
};

getRequestsPromiseResults().then((promiseResults) => {
  const responsesResult = getReadableResultObjects(promiseResults);
  const segregatedResponseResults = segragateResponseResults(responsesResult);

  logColoredResults(segregatedResponseResults);

  writeResponseResultsToCsv(responsesResult).then(() => {
    resultCSVPath = getResultCSVPath();
    sendReportEmail({ segregatedResponseResults, resultCSVPath });
  });
});

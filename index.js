const axios = require("axios").default;
const ObjectsToCsv = require("objects-to-csv");
const { exec } = require("child_process");
const os = require("os");
const { Table: ConsoleTable } = require("console-table-printer");

const urls = [
  "https://portal.uiic.in/GCWebPortal/login/LoginAction.do?p=login",
];

const proxiedAxiosInstance = axios.create({
  proxy: {
    host: "10.211.36.180",
    port: 3128,
  },
});

const getResultCSVPath = () => `${__dirname}/result.csv`;

const getRequestsPromiseResults = async () => {
  const getRequestPromise = (url) => proxiedAxiosInstance.get(url);

  const result = await Promise.allSettled(
    urls.map((url) => getRequestPromise(url))
  );

  return result;
};

const getReadableResultObjects = (promiseResults) =>
  promiseResults.map((requestResult, resultIndex) => ({
    url: urls[resultIndex],
    running: requestResult.status === "fulfilled" ? "Yes" : "No",
    reason:
      requestResult.status !== "fulfilled"
        ? requestResult.reason.name + " " + requestResult.reason.message
        : "",
  }));

const writeResponseResultsToCsv = async (responsesResult) => {
  const csv = new ObjectsToCsv(responsesResult);
  await csv.toDisk(getResultCSVPath());
};

const openResultCsv = () => {
  if (os.type() == "Windows_NT") {
    exec(`explorer ${getResultCSVPath()}`);
  } else {
    exec(`open ${getResultCSVPath()}`);
  }
};

const logColoredResults = (responsesResult) => {
  const table = new ConsoleTable();

  const [successResults, errorResults] = [[], []];

  responsesResult.forEach((responseResult) => {
    if (responseResult.running === "Yes") {
      successResults.push(responseResult);
    } else {
      errorResults.push(responseResult);
    }
  });

  table.addRows(successResults, { color: "green" });
  table.addRows(errorResults, { color: "red" });

  table.printTable();
};

getRequestsPromiseResults().then((promiseResults) => {
  const responsesResult = getReadableResultObjects(promiseResults);

  logColoredResults(responsesResult);

  writeResponseResultsToCsv(responsesResult).then(() => {
    openResultCsv();
  });
});

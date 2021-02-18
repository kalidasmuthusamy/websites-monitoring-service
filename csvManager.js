const ObjectsToCsv = require("objects-to-csv");
const { exec } = require("child_process");
const os = require("os");

const getResultCSVPath = () => `${__dirname}/result.csv`;

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

module.exports = {
  getResultCSVPath,
  writeResponseResultsToCsv,
  openResultCsv,
};

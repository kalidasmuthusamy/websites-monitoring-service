const ObjectsToCsv = require("objects-to-csv");
const { exec } = require("child_process");
const os = require("os");
const getResultCSVPath = () => {
  const currentDateTime = new Date();
  // month-date-year format
  const readableDateStr = currentDateTime
    .toLocaleDateString()
    .replace(/\//g, "_");
  const readableTimeStr = currentDateTime
    .toLocaleTimeString("en-IN", { hour12: false })
    .replace(/:/g, "_");

  return `${__dirname}/result_${readableDateStr}_${readableTimeStr}.csv`;
};
const resultCSVPath = getResultCSVPath();

const writeResponseResultsToCsv = async (responsesResult) => {
  const csv = new ObjectsToCsv(responsesResult);
  await csv.toDisk(resultCSVPath, { append: true, bom: true });
};

const openResultCsv = () => {
  if (os.type() == "Windows_NT") {
    exec(`explorer ${resultCSVPath}`);
  } else {
    exec(`open ${resultCSVPath}`);
  }
};

module.exports = {
  resultCSVPath,
  writeResponseResultsToCsv,
  openResultCsv,
};

const { Table: ConsoleTable } = require("console-table-printer");

const logColoredResults = ({ successResults, errorResults }) => {
  const table = new ConsoleTable();

  table.addRows(successResults, { color: "green" });
  table.addRows(errorResults, { color: "red" });

  table.printTable();
};

module.exports = {
  logColoredResults,
};

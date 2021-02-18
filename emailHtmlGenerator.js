// https://github.com/wankdanker/node-tableify
// https://www.npmjs.com/package/tableify
// https://github.com/ly-tools/html-tableify#readme
// https://dev.to/boxofcereal/how-to-generate-a-table-from-json-data-with-es6-methods-2eel
// https://www.npmjs.com/package/@tillhub/tableify

const tableify = require("@tillhub/tableify");

const generateHTMLTable = (arrayData) => {
  const tableOptions = {
    bodyCellClass: function (_row, col, content) {
      if (col === "running") {
        if (content === "Yes") {
          return "green statusColumn";
        } else {
          return "red statusColumn";
        }
      }
    },
  };

  return tableify(arrayData, tableOptions);
};

const generateEmailHTML = ({
  segregatedResponseResults: { successResults, errorResults },
}) => {
  const indexedResponseResults = [...successResults, ...errorResults].map(
    (responseResult, index) => ({
      index: index + 1,
      ...responseResult,
    })
  );

  const htmlTableContent = generateHTMLTable(indexedResponseResults);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Arvind Website Monitoring Service</title>
        <style type="text/css">
          table {
            background-color: black;
            color: white;
            font-weight: 400;
            border: solid 1px white;
          }
          th,
          td {
            border: solid 1px white;
          }
          td.statusColumn {
            text-align: center;
          }
          td.green {
            background-color: green;
          }
          td.red {
            background-color: red;
          }
        </style>
      </head>
      <body>
        ${htmlTableContent}
      </body>
    </html>
  `;
};

module.exports = {
  generateEmailHTML,
};

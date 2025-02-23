import { MonitoringResult } from "./types";

interface StatusSegregatedResults {
  successResults: MonitoringResult[];
  errorResults: MonitoringResult[];
}

interface GenerateEmailHTMLParams {
  statusSegregatedResponseResults: StatusSegregatedResults;
  batchId: string;
}

type ColumnConfig = {
  key: keyof MonitoringResult;
  header: string;
  width?: string;
  formatter?: (value: any) => string;
};

const columns: ColumnConfig[] = [
  { key: "name", header: "Name", width: "20%" },
  { key: "url", header: "URL", width: "35%" },
  { key: "statusCode", header: "Status Code", width: "15%" },
  {
    key: "success",
    header: "Status",
    width: "15%",
    formatter: (value: boolean) => (value ? "Success" : "Failed"),
  },
  { key: "error", header: "Error", width: "15%" },
];

const generateHTMLTable = (data: MonitoringResult[]): string => {
  const tableStyle =
    "width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Arial, sans-serif;";
  const thStyle =
    "background-color: #f8f9fa; color: #2c3e50; padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: 600;";
  const tdStyle = "padding: 12px; text-align: left; border: 1px solid #ddd;";

  const headerRow = columns
    .map(
      (col) =>
        `<th style="${thStyle}${col.width ? ` width: ${col.width};` : ""}">${
          col.header
        }</th>`
    )
    .join("");

  const rows = data
    .map((item) => {
      const cells = columns
        .map((col) => {
          const value = item[col.key];
          const displayValue = col.formatter
            ? col.formatter(value)
            : value?.toString() || "";

          let cellStyle = tdStyle;
          if (col.key === "success") {
            const statusStyle = value
              ? "background-color: #d4edda; color: #28a745;"
              : "background-color: #f8d7da; color: #dc3545;";
            cellStyle += statusStyle;
          }

          return `<td style="${cellStyle}">${displayValue}</td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <table style="${tableStyle}">
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

export const generateEmailHTML = ({
  statusSegregatedResponseResults: { successResults, errorResults },
  batchId,
}: GenerateEmailHTMLParams): string => {
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
        <title>[Batch: ${batchId}] Website Monitoring Service</title>
        <style type="text/css">
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
            line-height: 1.6;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            background-color: white;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            font-weight: 600;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          tr:hover {
            background-color: #f5f5f5;
          }
          td.statusColumn {
            text-align: center;
            font-weight: 600;
          }
          td.green {
            color: #28a745;
            background-color: #d4edda;
          }
          td.red {
            color: #dc3545;
            background-color: #f8d7da;
          }
          h1 {
            color: #2c3e50;
            margin-bottom: 30px;
          }
        </style>
      </head>
      <body>
        <h1>[Batch: ${batchId}] Website Monitoring Service</h1>
        ${htmlTableContent}
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Generated at ${new Date().toLocaleString()}
        </p>
      </body>
    </html>
  `;
};

import tableify, { TableifyOptions } from '@tillhub/tableify';
import { MonitoringResult } from './types';

type TableOptions = Required<Pick<TableifyOptions<MonitoringResult>, 'bodyCellClass'>> & 
  Omit<TableifyOptions<MonitoringResult>, 'bodyCellClass'>;

interface StatusSegregatedResults {
  successResults: MonitoringResult[];
  errorResults: MonitoringResult[];
}

interface GenerateEmailHTMLParams {
  statusSegregatedResponseResults: StatusSegregatedResults;
}

const generateHTMLTable = (arrayData: MonitoringResult[]): string => {
  const tableOptions: TableOptions = {
    bodyCellClass: (_row: MonitoringResult, col: string, content: unknown): string | undefined => {
      if (col === 'success') {
        return content === true ? 'green statusColumn' : 'red statusColumn';
      }
      return undefined;
    },
    headerText: (col: string): string => {
      // Convert camelCase to Title Case
      return col
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    }
  };

  return tableify(arrayData, tableOptions);
};

export const generateEmailHTML = ({
  statusSegregatedResponseResults: { successResults, errorResults },
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
        <title>Website Monitoring Service</title>
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
        <h1>Website Monitoring Results</h1>
        ${htmlTableContent}
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Generated at ${new Date().toLocaleString()}
        </p>
      </body>
    </html>
  `;
};

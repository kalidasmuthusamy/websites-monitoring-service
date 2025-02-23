import { Table as ConsoleTable } from 'console-table-printer';
import { MonitoringResult } from './types';

interface LogResults {
  successResults: MonitoringResult[];
  errorResults: MonitoringResult[];
}

export const logColoredResults = ({ successResults, errorResults }: LogResults): void => {
  const table = new ConsoleTable();

  table.addRows(successResults, { color: 'green' });
  table.addRows(errorResults, { color: 'red' });

  table.printTable();
};

import ObjectsToCsv from 'objects-to-csv';
import { exec } from 'child_process';
import { MonitoringResult } from './types';
import path from 'path';

export const getResultCSVPath = (): string => {
  const currentDateTime = new Date();
  // month-date-year format
  const readableDateStr = currentDateTime
    .toLocaleDateString()
    .replace(/\//g, '_');
  const readableTimeStr = currentDateTime
    .toLocaleTimeString('en-IN', { hour12: false })
    .replace(/:/g, '_');

  return path.join(__dirname, `result_${readableDateStr}_${readableTimeStr}.csv`);
};

export const writeResponseResultsToCsv = async (
  responsesResult: MonitoringResult[],
  resultCSVPath: string
): Promise<void> => {
  const csv = new ObjectsToCsv(responsesResult);
  await csv.toDisk(resultCSVPath, { append: true, bom: true });
};

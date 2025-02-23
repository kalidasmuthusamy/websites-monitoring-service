import { MonitoringResult } from './types';

interface SegregatedResults {
  successResults: MonitoringResult[];
  errorResults: MonitoringResult[];
}

export const segragateResponseResults = (responsesResult: MonitoringResult[]): SegregatedResults => {
  const [successResults, errorResults] = [[], []] as [MonitoringResult[], MonitoringResult[]];

  responsesResult.forEach((responseResult) => {
    if (responseResult.success) {
      successResults.push(responseResult);
    } else {
      errorResults.push(responseResult);
    }
  });

  return {
    successResults,
    errorResults,
  };
};

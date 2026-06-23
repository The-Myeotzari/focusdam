export type DataExportFormat = 'csv' | 'pdf';

export type RequestDataExportInput = {
  format: DataExportFormat;
};

export type RequestDataExportResult = {
  message: string;
  mode: 'api' | 'mock';
  success: boolean;
};

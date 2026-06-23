// 데이터 삭제 기간 타입
export type DeleteDataRecordsInput = {
  endDate: string;
  startDate: string;
};

export type DeleteDataRecordsResult = {
  message: string;
  mode: 'api' | 'mock';
  success: boolean;
};

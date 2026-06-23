// 선택 동의 관리 타입 정의
export type ConsentSettings = {
  analysisUsage: boolean;
  emotionRecord: boolean;
  spendingRecord: boolean;
};

// ConsentSettings의 각 항목에 대한 ID 타입 정의
export type ConsentSettingId = keyof ConsentSettings;

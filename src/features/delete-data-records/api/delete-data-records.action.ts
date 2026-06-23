// 데이터 기록 삭제 액션

'use server';

import type {
  DeleteDataRecordsInput,
  DeleteDataRecordsResult,
} from '../model/delete-data-records.types';

function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());
}

function isValidDateRange({ endDate, startDate }: DeleteDataRecordsInput) {
  if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
    return false;
  }

  return new Date(startDate).getTime() <= new Date(endDate).getTime();
}

export async function deleteDataRecords(
  input: DeleteDataRecordsInput,
): Promise<DeleteDataRecordsResult> {
  if (!isValidDateRange(input)) {
    return {
      success: false,
      mode: 'mock',
      message: '삭제할 기간을 다시 확인해주세요.',
    };
  }

  const endpoint = process.env.DATA_RECORDS_DELETE_API_URL;

  if (!endpoint) {
    return {
      success: true,
      mode: 'mock',
      message: 'API 연결 전 임시 삭제 요청을 확인했습니다.',
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        mode: 'api',
        message: '기록 삭제를 요청하지 못했습니다.',
      };
    }

    return {
      success: true,
      mode: 'api',
      message: '기록 삭제를 요청했습니다.',
    };
  } catch {
    return {
      success: false,
      mode: 'api',
      message: '네트워크 상태를 확인한 뒤 다시 시도해주세요.',
    };
  }
}

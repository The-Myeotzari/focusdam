// 데이터 내보내기 액션

'use server';

import type {
  RequestDataExportInput,
  RequestDataExportResult,
} from '../model/request-data-export.types';

const SUPPORTED_EXPORT_FORMATS = ['csv', 'pdf'];

function isSupportedExportFormat(format: string): format is RequestDataExportInput['format'] {
  return SUPPORTED_EXPORT_FORMATS.includes(format);
}

export async function requestDataExport(
  input: RequestDataExportInput,
): Promise<RequestDataExportResult> {
  if (!isSupportedExportFormat(input.format)) {
    return {
      success: false,
      mode: 'mock',
      message: '내보내기 파일 형식을 다시 선택해주세요.',
    };
  }

  const endpoint = process.env.DATA_EXPORT_API_URL;

  if (!endpoint) {
    return {
      success: true,
      mode: 'mock',
      message: `${input.format.toUpperCase()} 내보내기 요청을 확인했습니다.`,
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
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
        message: '데이터 내보내기를 요청하지 못했습니다.',
      };
    }

    return {
      success: true,
      mode: 'api',
      message: '데이터 내보내기를 요청했습니다.',
    };
  } catch {
    return {
      success: false,
      mode: 'api',
      message: '네트워크 상태를 확인한 뒤 다시 시도해주세요.',
    };
  }
}

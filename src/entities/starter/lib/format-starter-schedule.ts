export function formatStarterSchedule(
  startedAt: string,
  durationMinutes: number
) {
  const formattedTime = new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Seoul'
  }).format(new Date(startedAt));

  return `${formattedTime} · ${durationMinutes}분`;
}
import { z } from 'zod';

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().refine((url) => {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === 'https:' ||
      (parsedUrl.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsedUrl.hostname))
    );
  }, 'Supabase URL은 HTTPS여야 합니다. 로컬 개발 주소는 HTTP를 허용합니다.'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const siteEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
});

function formatEnvError(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
}

export function getSupabaseEnv() {
  const result = supabaseEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!result.success) {
    throw new Error(`Supabase 환경변수 설정이 올바르지 않습니다. ${formatEnvError(result.error)}`);
  }

  return {
    url: result.data.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: result.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function getSiteEnv() {
  const result = siteEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!result.success) {
    throw new Error(`사이트 환경변수 설정이 올바르지 않습니다. ${formatEnvError(result.error)}`);
  }

  return {
    siteUrl: result.data.NEXT_PUBLIC_SITE_URL ?? '',
  };
}

import { NextResponse } from "next/server";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

import { apiError } from "@/shared/lib/api/api-error";
import { getUser } from "@/shared/lib/api/get-user";
import { parseJsonBody } from "@/shared/lib/api/request-validation";
import type { Database } from "@/shared/types/database.types";

const deleteAccountSchema = z.object({
  confirmation: z.literal("계정 삭제")
});

const EXPORT_BUCKET = "data-exports";
const STORAGE_PAGE_SIZE = 100;

export async function DELETE(request: Request) {
  const parsed = await parseJsonBody(request, deleteAccountSchema);

  if (!parsed.success) {
    return parsed.response;
  }

  const auth = await getUser(request);

  if (!auth.ok) {
    return auth.response;
  }

  const storageError = await removeExportFiles(auth.supabase, auth.user.id);

  if (storageError) {
    return apiError(request, "ACCOUNT_DELETE_FAILED", 500, storageError);
  }

  const { error: deleteError } = await auth.supabase.rpc("delete_current_user_account");

  if (deleteError) {
    if (deleteError.code === "PGRST202") {
      return apiError(
        request,
        "ACCOUNT_DELETE_NOT_CONFIGURED",
        503,
        "계정 삭제용 데이터베이스 설정이 아직 적용되지 않았습니다."
      );
    }

    return apiError(request, "ACCOUNT_DELETE_FAILED", 500, deleteError.message);
  }

  await auth.supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}

async function removeExportFiles(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const paths: string[] = [];
  const listingError = await collectExportFilePaths(supabase, userId, paths);

  if (listingError) {
    return listingError;
  }

  for (let index = 0; index < paths.length; index += STORAGE_PAGE_SIZE) {
    const batch = paths.slice(index, index + STORAGE_PAGE_SIZE);
    const { error } = await supabase.storage.from(EXPORT_BUCKET).remove(batch);

    if (error) {
      return error.message;
    }
  }

  return null;
}

async function collectExportFilePaths(
  supabase: SupabaseClient<Database>,
  prefix: string,
  paths: string[]
): Promise<string | null> {
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(EXPORT_BUCKET).list(prefix, {
      limit: STORAGE_PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" }
    });

    if (error) {
      return error.message;
    }

    for (const item of data) {
      const itemPath = `${prefix}/${item.name}`;

      if (item.id) {
        paths.push(itemPath);
      } else {
        const nestedError = await collectExportFilePaths(
          supabase,
          itemPath,
          paths
        );

        if (nestedError) {
          return nestedError;
        }
      }
    }

    if (data.length < STORAGE_PAGE_SIZE) {
      break;
    }

    offset += STORAGE_PAGE_SIZE;
  }

  return null;
}

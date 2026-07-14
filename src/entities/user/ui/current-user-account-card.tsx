"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUserClient } from "@/entities/user/api/current-user.client";
import { UserAccountCard } from "@/entities/user/ui/user-account-card";
import { QUERY_KEYS } from "@/shared/constants/query-key";

export function CurrentUserAccountCard() {
  const { data, error, isPending } = useQuery({
    queryKey: QUERY_KEYS.user.current,
    queryFn: getCurrentUserClient,
  });

  if (isPending) {
    return <p role="status">계정 정보를 불러오는 중입니다.</p>;
  }

  if (error) {
    return <p role="alert">계정 정보를 불러오지 못했습니다.</p>;
  }

  return <UserAccountCard user={data.user} />;
}

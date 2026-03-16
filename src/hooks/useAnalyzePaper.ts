"use client";

import { useMutation } from "@tanstack/react-query";
import { analyzePaper, ApiRequestError } from "@/api/query";

export function useAnalyzePaper() {
  return useMutation<Awaited<ReturnType<typeof analyzePaper>>, ApiRequestError, File>({
    mutationKey: ["analyzePaper"],
    mutationFn: analyzePaper
  });
}

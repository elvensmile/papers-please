"use client";

import { useMutation } from "@tanstack/react-query";
import { analyzePaper } from "@/api/query";

export function useAnalyzePaper() {
  return useMutation({
    mutationKey: ["analyzePaper"],
    mutationFn: analyzePaper
  });
}

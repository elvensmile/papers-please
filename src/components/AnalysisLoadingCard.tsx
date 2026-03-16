"use client";

import { Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconLoader2, IconSparkles } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/components/UiLanguageProvider";

const STAGE_KEYS = [
  "upload.loadingStages.ingestion",
  "upload.loadingStages.summary",
  "upload.loadingStages.startups",
  "upload.loadingStages.ranking",
  "upload.loadingStages.imaging"
] as const;

const DETAIL_KEYS = [
  "upload.loadingDetails.abstract",
  "upload.loadingDetails.methods",
  "upload.loadingDetails.commercial",
  "upload.loadingDetails.defensibility",
  "upload.loadingDetails.packaging"
] as const;

export function AnalysisLoadingCard() {
  const t = useTranslation();
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [activeDetailIndex, setActiveDetailIndex] = useState(0);

  useEffect(() => {
    const stageTimer = window.setInterval(() => {
      setActiveStageIndex((current) => (current + 1) % STAGE_KEYS.length);
    }, 2800);

    const detailTimer = window.setInterval(() => {
      setActiveDetailIndex((current) => (current + 1) % DETAIL_KEYS.length);
    }, 1900);

    return () => {
      window.clearInterval(stageTimer);
      window.clearInterval(detailTimer);
    };
  }, []);

  return (
    <Paper className="section-card analysis-loading-card" p={{ base: "lg", md: "xl" }} radius={20}>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" gap="md">
          <Group gap="md" wrap="nowrap" align="flex-start">
            <ThemeIcon
              variant="light"
              color="teal"
              size={44}
              radius="xl"
              className="analysis-loading-icon"
            >
              <IconLoader2 size={22} className="analysis-loading-spinner" />
            </ThemeIcon>
            <Stack gap={4}>
              <Text fw={600} fz="sm">
                {t("upload.loadingTitle")}
              </Text>
              <Text c="dimmed" fz="sm" maw={620}>
                {t("upload.loadingCopy")}
              </Text>
            </Stack>
          </Group>
          <ThemeIcon variant="light" color="orange" radius="xl" size={34}>
            <IconSparkles size={16} stroke={1.7} />
          </ThemeIcon>
        </Group>

        <div className="analysis-loading-stage">
          <Text className="analysis-loading-label">
            {t("upload.loadingStageLabel")}
          </Text>
          <Text className="analysis-loading-stage-text" key={STAGE_KEYS[activeStageIndex]}>
            {t(STAGE_KEYS[activeStageIndex])}
          </Text>
        </div>

        <div className="analysis-loading-track" aria-hidden="true">
          {STAGE_KEYS.map((stageKey, index) => (
            <div
              key={stageKey}
              className={
                index === activeStageIndex
                  ? "analysis-loading-track-step is-active"
                  : index < activeStageIndex
                    ? "analysis-loading-track-step is-complete"
                    : "analysis-loading-track-step"
              }
            />
          ))}
        </div>

        <Paper radius="lg" p="md" className="analysis-loading-detail">
          <Stack gap={6}>
            <Text className="analysis-loading-label">
              {t("upload.loadingDetailLabel")}
            </Text>
            <Text fz="sm" key={DETAIL_KEYS[activeDetailIndex]} className="analysis-loading-detail-text">
              {t(DETAIL_KEYS[activeDetailIndex])}
            </Text>
          </Stack>
        </Paper>

        <Group gap="sm" align="stretch">
          <div
            className="loading-shimmer analysis-loading-skeleton"
            style={{ width: "58%", animationDelay: "0s" }}
          />
          <div
            className="loading-shimmer analysis-loading-skeleton"
            style={{ width: "26%", animationDelay: "0.18s" }}
          />
          <div
            className="loading-shimmer analysis-loading-skeleton"
            style={{ width: "16%", animationDelay: "0.34s" }}
          />
        </Group>
      </Stack>
    </Paper>
  );
}

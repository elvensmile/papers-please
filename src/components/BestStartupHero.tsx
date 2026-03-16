"use client";

import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconAward, IconTargetArrow } from "@tabler/icons-react";
import { useTranslation } from "@/components/UiLanguageProvider";
import type { BestStartup, RankedStartup, StartupCandidate } from "@/types/analysis";

type WinnerDetails = {
  candidate: StartupCandidate;
  ranking: RankedStartup | null;
} | null;

type BestStartupHeroProps = {
  bestStartup: BestStartup;
  winnerDetails: WinnerDetails;
};

export function BestStartupHero({
  bestStartup,
  winnerDetails
}: BestStartupHeroProps) {
  const t = useTranslation();

  return (
    <Paper
      radius={20}
      p={{ base: "lg", md: "xl" }}
      style={{
        background:
          "linear-gradient(135deg, rgba(13, 148, 136, 0.06) 0%, rgba(6, 182, 212, 0.04) 50%, rgba(245, 158, 11, 0.06) 100%)",
        border: "1px solid rgba(13, 148, 136, 0.12)",
        boxShadow: "var(--shadow-md)"
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Group gap="xs" className="section-heading">
              <IconAward size={16} stroke={1.5} />
              <Text fw={600} fz="sm" c="teal.7">
                {t("bestStartup.title")}
              </Text>
            </Group>
            <Title order={2} fz={{ base: 24, md: 28 }} lts={-0.5} fw={700}>
              {bestStartup.name}
            </Title>
          </Stack>
          {winnerDetails?.ranking != null ? (
            <Badge color="teal" size="lg" variant="light" radius="sm">
              {t("bestStartup.topScore", {
                score: winnerDetails.ranking.totalScore
              })}
            </Badge>
          ) : null}
        </Group>

        <Text fz="md" lh={1.7} c="dimmed">
          {bestStartup.reason}
        </Text>

        <Paper
          radius="md"
          p="md"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            border: "1px solid var(--surface-border)"
          }}
        >
          <Stack gap={6}>
            <Group gap="xs">
              <IconTargetArrow size={14} stroke={1.5} />
              <Text fw={600} fz="sm">
                {t("bestStartup.whyItResonates")}
              </Text>
            </Group>
            <Text c="dimmed" fz="sm" lh={1.6}>
              {winnerDetails?.candidate.description ??
                t("bestStartup.fallbackReason")}
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
}

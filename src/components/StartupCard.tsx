"use client";

import { Badge, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { useTranslation } from "@/components/UiLanguageProvider";
import type { RankedStartup, StartupCandidate } from "@/types/analysis";

type StartupCardProps = {
  candidate: StartupCandidate;
  ranking: RankedStartup | null;
};

function scoreTone(totalScore: number) {
  if (totalScore >= 80) {
    return "teal";
  }

  if (totalScore >= 70) {
    return "orange";
  }

  return "gray";
}

export function StartupCard({ candidate, ranking }: StartupCardProps) {
  const t = useTranslation();

  return (
    <Paper
      p="lg"
      radius={16}
      style={{
        background: "var(--surface-soft)",
        border: "1px solid var(--surface-border)",
        transition: "all var(--transition)"
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Text fw={700} fz="md" lts={-0.2}>
              {candidate.name}
            </Text>
            <Text c="dimmed" fz="sm" lh={1.5}>
              {candidate.description}
            </Text>
          </Stack>
          {ranking != null ? (
            <Badge
              color={scoreTone(ranking.totalScore)}
              variant="light"
              size="md"
              radius="sm"
            >
              {t("startups.score", { score: ranking.totalScore })}
            </Badge>
          ) : null}
        </Group>

        <Stack gap={4}>
          <Text fw={600} fz="xs" tt="uppercase" lts={0.5} c="dimmed">
            {t("startups.problem")}
          </Text>
          <Text fz="sm" lh={1.6}>
            {candidate.problem}
          </Text>
        </Stack>

        <Stack gap={4}>
          <Text fw={600} fz="xs" tt="uppercase" lts={0.5} c="dimmed">
            {t("startups.solution")}
          </Text>
          <Text fz="sm" lh={1.6}>
            {candidate.solution}
          </Text>
        </Stack>

        <Group gap={6}>
          {candidate.customers.map((customer) => (
            <Badge key={customer} variant="light" color="gray" size="sm" radius="sm">
              {customer}
            </Badge>
          ))}
        </Group>

        <Divider color="rgba(0,0,0,0.05)" />

        <Stack gap={4}>
          <Text fw={600} fz="xs" tt="uppercase" lts={0.5} c="dimmed">
            {t("startups.businessModel")}
          </Text>
          <Text fz="sm" lh={1.6}>
            {candidate.businessModel}
          </Text>
        </Stack>

        <Stack gap={4}>
          <Text fw={600} fz="xs" tt="uppercase" lts={0.5} c="dimmed">
            {t("startups.whyNow")}
          </Text>
          <Text fz="sm" lh={1.6}>
            {candidate.whyNow}
          </Text>
        </Stack>

        {ranking != null ? (
          <>
            <Divider color="rgba(0,0,0,0.05)" />
            <Stack gap={4}>
              <Text fw={600} fz="xs" tt="uppercase" lts={0.5} c="dimmed">
                {t("startups.improvedPositioning")}
              </Text>
              <Text fz="sm" lh={1.6}>
                {ranking.improvedPositioning}
              </Text>
            </Stack>
            <Stack gap={4}>
              <Text fw={600} fz="xs" tt="uppercase" lts={0.5} c="dimmed">
                {t("startups.keyRisks")}
              </Text>
              {ranking.risks.map((risk) => (
                <Text fz="sm" lh={1.6} key={risk}>
                  <Text span c="dimmed" fz="sm">
                    &bull;
                  </Text>{" "}
                  {risk}
                </Text>
              ))}
            </Stack>
          </>
        ) : null}
      </Stack>
    </Paper>
  );
}

"use client";

import { Paper, Stack, Text } from "@mantine/core";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer
} from "recharts";
import { useTranslation } from "@/components/UiLanguageProvider";
import type { FeasibilityScores } from "@/types/analysis";

type FeasibilityRadarProps = {
  scores: FeasibilityScores;
};

export function FeasibilityRadar({ scores }: FeasibilityRadarProps) {
  const t = useTranslation();
  const data = [
    {
      metric: t("radar.metrics.technicalDifficulty"),
      value: scores.technicalDifficulty
    },
    { metric: t("radar.metrics.timeToMarket"), value: scores.timeToMarket },
    { metric: t("radar.metrics.marketSize"), value: scores.marketSize },
    { metric: t("radar.metrics.defensibility"), value: scores.defensibility },
    {
      metric: t("radar.metrics.revenuePotential"),
      value: scores.revenuePotential
    },
    { metric: t("radar.metrics.executionRisk"), value: scores.executionRisk }
  ];

  return (
    <Paper
      className="section-card"
      p={{ base: "lg", md: "xl" }}
      radius={20}
    >
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={600} fz="sm">
            {t("radar.title")}
          </Text>
          <Text c="dimmed" fz="sm">
            {t("radar.description")}
          </Text>
        </Stack>
        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="rgba(0, 0, 0, 0.08)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
              />
              <Radar
                name={t("radar.chartName")}
                dataKey="value"
                stroke="#0d9488"
                fill="#0d9488"
                fillOpacity={0.18}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Paper>
  );
}

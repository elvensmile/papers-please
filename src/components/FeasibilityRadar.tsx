"use client";

import { Paper, Stack, Text } from "@mantine/core";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer
} from "recharts";
import type { FeasibilityScores } from "@/types/analysis";

type FeasibilityRadarProps = {
  scores: FeasibilityScores;
};

export function FeasibilityRadar({ scores }: FeasibilityRadarProps) {
  const data = [
    { metric: "Tech difficulty", value: scores.technicalDifficulty },
    { metric: "Time to market", value: scores.timeToMarket },
    { metric: "Market size", value: scores.marketSize },
    { metric: "Defensibility", value: scores.defensibility },
    { metric: "Revenue", value: scores.revenuePotential },
    { metric: "Execution risk", value: scores.executionRisk }
  ];

  return (
    <Paper className="section-card" p={{ base: "lg", md: "xl" }} radius="xl">
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={700}>Startup feasibility radar</Text>
          <Text c="dimmed">
            Normalized 0-100 scoring for the winning startup concept.
          </Text>
        </Stack>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="rgba(72, 53, 29, 0.18)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#65574a", fontSize: 13 }}
              />
              <Radar
                name="Feasibility"
                dataKey="value"
                stroke="#0d7a5f"
                fill="#0d7a5f"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Paper>
  );
}

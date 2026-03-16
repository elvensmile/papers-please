import { Badge, Divider, Group, Paper, Stack, Text } from "@mantine/core";
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
  return (
    <Paper className="section-card" p="lg" radius="xl">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text fw={800} fz="lg">
              {candidate.name}
            </Text>
            <Text c="dimmed">{candidate.description}</Text>
          </Stack>
          {ranking != null ? (
            <Badge color={scoreTone(ranking.totalScore)} variant="light" size="lg">
              Score {ranking.totalScore}
            </Badge>
          ) : null}
        </Group>

        <Stack gap={6}>
          <Text fw={700}>Problem</Text>
          <Text c="dimmed">{candidate.problem}</Text>
        </Stack>

        <Stack gap={6}>
          <Text fw={700}>Solution</Text>
          <Text c="dimmed">{candidate.solution}</Text>
        </Stack>

        <Group gap="xs">
          {candidate.customers.map((customer) => (
            <Badge key={customer} variant="light" color="dark">
              {customer}
            </Badge>
          ))}
        </Group>

        <Divider />

        <Stack gap={6}>
          <Text fw={700}>Business model</Text>
          <Text c="dimmed">{candidate.businessModel}</Text>
        </Stack>

        <Stack gap={6}>
          <Text fw={700}>Why now</Text>
          <Text c="dimmed">{candidate.whyNow}</Text>
        </Stack>

        {ranking != null ? (
          <>
            <Divider />
            <Stack gap={6}>
              <Text fw={700}>Improved positioning</Text>
              <Text c="dimmed">{ranking.improvedPositioning}</Text>
            </Stack>
            <Stack gap={6}>
              <Text fw={700}>Key risks</Text>
              {ranking.risks.map((risk) => (
                <Text c="dimmed" key={risk}>
                  • {risk}
                </Text>
              ))}
            </Stack>
          </>
        ) : null}
      </Stack>
    </Paper>
  );
}

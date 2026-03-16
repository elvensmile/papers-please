import { Badge, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconAward, IconTargetArrow } from "@tabler/icons-react";
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
  return (
    <Paper
      radius="xl"
      p={{ base: "lg", md: "xl" }}
      style={{
        background:
          "linear-gradient(135deg, rgba(13, 122, 95, 0.14), rgba(216, 139, 53, 0.18))",
        border: "1px solid rgba(72, 53, 29, 0.12)",
        boxShadow: "var(--shadow-md)"
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Group gap="xs">
              <IconAward size={18} />
              <Text fw={700}>Best startup</Text>
            </Group>
            <Title order={2}>{bestStartup.name}</Title>
          </Stack>
          {winnerDetails?.ranking != null ? (
            <Badge color="teal" size="lg" variant="filled">
              Top score {winnerDetails.ranking.totalScore}
            </Badge>
          ) : null}
        </Group>

        <Text fz="lg" lh={1.7}>
          {bestStartup.reason}
        </Text>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Paper radius="lg" p="md" bg="rgba(255, 250, 240, 0.68)">
            <Stack gap={6}>
              <Group gap="xs">
                <IconTargetArrow size={16} />
                <Text fw={700}>Why it resonates</Text>
              </Group>
              <Text c="dimmed">
                {winnerDetails?.candidate.description ??
                  "This concept pairs the paper's differentiated technical insight with a commercially clear buyer problem."}
              </Text>
            </Stack>
          </Paper>
          <Paper radius="lg" p="md" bg="rgba(255, 250, 240, 0.68)">
            <Stack gap={6}>
              <Text fw={700}>Image prompt direction</Text>
            </Stack>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}

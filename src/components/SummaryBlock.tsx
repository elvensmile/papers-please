import { Group, Paper, Stack, Text } from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";

type SummaryBlockProps = {
  summary: string;
  coreInnovation?: string;
};

export function SummaryBlock({ summary, coreInnovation }: SummaryBlockProps) {
  return (
    <Paper className="section-card" p={{ base: "lg", md: "xl" }} radius="xl">
      <Stack gap="lg">
        <Group gap="xs">
          <IconNotes size={18} />
          <Text fw={700}>Paper summary</Text>
        </Group>
        <Text lh={1.8}>{summary}</Text>
        {coreInnovation != null && coreInnovation.length > 0 ? (
          <Paper
            radius="lg"
            p="md"
            style={{ background: "rgba(13, 122, 95, 0.08)", border: "1px solid rgba(13, 122, 95, 0.12)" }}
          >
            <Stack gap={4}>
              <Text fw={700}>Core innovation</Text>
              <Text>{coreInnovation}</Text>
            </Stack>
          </Paper>
        ) : null}
      </Stack>
    </Paper>
  );
}

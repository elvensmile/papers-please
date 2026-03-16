"use client";

import { Group, Paper, Stack, Text } from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";
import { useTranslation } from "@/components/UiLanguageProvider";

type SummaryBlockProps = {
  summary: string;
  coreInnovation?: string;
};

export function SummaryBlock({ summary, coreInnovation }: SummaryBlockProps) {
  const t = useTranslation();

  return (
    <Paper
      className="section-card"
      p={{ base: "lg", md: "xl" }}
      radius={20}
    >
      <Stack gap="lg">
        <Group gap="xs" className="section-heading">
          <IconNotes size={16} stroke={1.5} />
          <Text fw={600} fz="sm">
            {t("summary.title")}
          </Text>
        </Group>
        <Text lh={1.75} fz="sm">
          {summary}
        </Text>
        {coreInnovation != null && coreInnovation.length > 0 ? (
          <Paper
            radius="md"
            p="md"
            style={{
              background: "var(--accent-soft)",
              border: "1px solid rgba(13, 148, 136, 0.10)"
            }}
          >
            <Stack gap={4}>
              <Text fw={600} fz="sm" c="teal.7">
                {t("summary.innovationTitle")}
              </Text>
              <Text fz="sm" lh={1.65}>
                {coreInnovation}
              </Text>
            </Stack>
          </Paper>
        ) : null}
      </Stack>
    </Paper>
  );
}

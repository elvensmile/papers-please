"use client";

import {
  Alert,
  Badge,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@mantine/core";
import {
  IconArrowRight,
  IconBulb,
  IconFileAnalytics,
  IconRocket,
  IconSparkles
} from "@tabler/icons-react";
import { useState } from "react";
import { PdfUploader } from "@/components/PdfUploader";
import { SummaryBlock } from "@/components/SummaryBlock";
import { BestStartupHero } from "@/components/BestStartupHero";
import { IdeaImage } from "@/components/IdeaImage";
import { FeasibilityRadar } from "@/components/FeasibilityRadar";
import { StartupCard } from "@/components/StartupCard";
import { OpportunityMap } from "@/components/OpportunityMap";
import { useAnalyzePaper } from "@/hooks/useAnalyzePaper";
import type { RankedStartup, StartupCandidate } from "@/types/analysis";

function mergeCandidatesWithRanking(
  candidates: StartupCandidate[],
  ranked: RankedStartup[]
) {
  return candidates
    .map((candidate) => ({
      candidate,
      ranking: ranked.find((item) => item.name === candidate.name) ?? null
    }))
    .sort(
      (left, right) =>
        (right.ranking?.totalScore ?? 0) - (left.ranking?.totalScore ?? 0)
    );
}

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutateAsync, isPending: isAnalyzing, error, data: result, isError } = useAnalyzePaper();

  const rankedCandidates =
    result == null
      ? []
      : mergeCandidatesWithRanking(
          result.stage1.startupCandidates,
          result.stage2.rankedStartups
        );

  const handleAnalyze = async () => {
    if (selectedFile == null) {
      return;
    }

    await mutateAsync(selectedFile);
  };

  return (
    <div className="app-shell">
      <Container size="lg">
        <Stack gap="xl">
          <Paper className="glass-panel" radius={32} p={{ base: "xl", md: 36 }}>
            <Stack gap="lg">
              <Badge
                variant="light"
                color="teal"
                size="lg"
                leftSection={<IconSparkles size={14} />}
              >
                Research-to-startup pipeline
              </Badge>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" verticalSpacing="xl">
                <Stack gap="md">
                  <Title
                    order={1}
                    fz={{ base: 34, md: 52 }}
                    maw={640}
                    ff='Georgia, "Iowan Old Style", serif'
                    lh={1.02}
                  >
                    Turn one academic PDF into a fundable startup thesis.
                  </Title>
                  <Text c="dimmed" fz="lg" maw={600}>
                    Upload a paper and get a research summary, six startup concepts,
                    ranked opportunities, a concept visual, and an interactive
                    opportunity map in one pass.
                  </Text>
                  <Group gap="sm" wrap="wrap">
                    <Badge color="dark" variant="white">
                      6 startup ideas
                    </Badge>
                    <Badge color="teal" variant="white">
                      Feasibility scoring
                    </Badge>
                    <Badge color="orange" variant="white">
                      Visual opportunity graph
                    </Badge>
                  </Group>
                </Stack>
                <Stack gap="md" justify="center">
                  {[
                    ["1", "Direct PDF analysis", "The backend sends the original PDF to AI."],
                    ["2", "Opportunity ranking", "Each idea is scored for novelty, feasibility, monetization, and fit."],
                    ["3", "Founder-ready output", "You get a best concept, image prompt, radar, and market map."]
                  ].map(([index, title, copy]) => (
                    <Group key={index} align="flex-start" wrap="nowrap">
                      <ThemeIcon
                        radius="xl"
                        size={42}
                        color="teal"
                        variant="light"
                      >
                        {index}
                      </ThemeIcon>
                      <Stack gap={4}>
                        <Text fw={700}>{title}</Text>
                        <Text c="dimmed">{copy}</Text>
                      </Stack>
                    </Group>
                  ))}
                </Stack>
              </SimpleGrid>
            </Stack>
          </Paper>

          <Paper className="section-card" p={{ base: "lg", md: "xl" }} radius="xl">
            <Stack gap="lg">
              <Group justify="space-between" align="flex-start">
                <Stack gap={4}>
                  <Group gap="xs">
                    <IconFileAnalytics size={18} />
                    <Text fw={700}>Upload paper</Text>
                  </Group>
                  <Text c="dimmed">
                    PDF only, up to 20MB. We analyze one paper at a time for a clean
                    MVP flow.
                  </Text>
                </Stack>
                <Button
                  onClick={handleAnalyze}
                  disabled={selectedFile == null}
                  loading={isAnalyzing}
                  rightSection={<IconArrowRight size={16} />}
                  color="teal"
                  radius="xl"
                >
                  Analyze paper
                </Button>
              </Group>

              <PdfUploader
                disabled={isAnalyzing}
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
              />

              {isError ? (
                <Alert color="red" radius="lg" title="Analysis failed">
                  {error.message}
                </Alert>
              ) : null}

              {result == null && !isAnalyzing ? (
                <Alert color="teal" radius="lg" variant="light" title="What you will get">
                  Summary, best startup recommendation, concept image, feasibility
                  radar, ranked idea cards, and an opportunity map.
                </Alert>
              ) : null}
            </Stack>
          </Paper>

          {isAnalyzing ? (
            <Paper className="section-card" p={{ base: "lg", md: "xl" }} radius="xl">
              <Stack gap="md">
                <Group>
                  <ThemeIcon variant="light" color="teal" size={40} radius="xl">
                    <IconBulb size={20} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text fw={700}>Building the opportunity thesis</Text>
                    <Text c="dimmed">
                      Reading the paper, generating startups, ranking ideas, and
                      drafting the concept image.
                    </Text>
                  </Stack>
                </Group>
              </Stack>
            </Paper>
          ) : null}

          {result != null ? (
            <Stack gap="xl">
              <SummaryBlock
                summary={result.stage1.summary}
                coreInnovation={result.stage1.coreInnovation}
              />

              <BestStartupHero
                bestStartup={result.stage2.bestStartup}
                winnerDetails={
                  rankedCandidates.find(
                    ({ candidate }) =>
                      candidate.name === result.stage2.bestStartup.name
                  ) ?? null
                }
              />

              <IdeaImage
                imageUrl={result.imageUrl}
                imageError={result.imageError}
                startupName={result.stage2.bestStartup.name}
              />

              <FeasibilityRadar scores={result.stage2.feasibilityScores} />

              <Paper className="section-card" p={{ base: "lg", md: "xl" }} radius="xl">
                <Stack gap="lg">
                  <Group gap="xs">
                    <IconRocket size={18} />
                    <Text fw={700}>Other startup ideas</Text>
                  </Group>
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    {rankedCandidates.map(({ candidate, ranking }) => (
                      <StartupCard
                        key={candidate.name}
                        candidate={candidate}
                        ranking={ranking}
                      />
                    ))}
                  </SimpleGrid>
                </Stack>
              </Paper>

              <OpportunityMap graph={result.stage1.opportunityMap} />
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </div>
  );
}

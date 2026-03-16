"use client";

import {
  Alert,
  Badge,
  Button,
  Container,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@mantine/core";
import {
  IconArrowRight,
  IconFileAnalytics,
  IconLanguage,
  IconLoader2,
  IconRocket,
  IconSparkles
} from "@tabler/icons-react";
import { useState } from "react";
import { BestStartupHero } from "@/components/BestStartupHero";
import { FeasibilityRadar } from "@/components/FeasibilityRadar";
import { IdeaImage } from "@/components/IdeaImage";
import { OpportunityMap } from "@/components/OpportunityMap";
import { PdfUploader } from "@/components/PdfUploader";
import { StartupCard } from "@/components/StartupCard";
import { SummaryBlock } from "@/components/SummaryBlock";
import {
  useTranslation,
  useUiLanguage
} from "@/components/UiLanguageProvider";
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
  const t = useTranslation();
  const { language, setLanguage } = useUiLanguage();
  const {
    mutateAsync,
    isPending: isAnalyzing,
    error,
    data: result,
    isError
  } = useAnalyzePaper();

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

  const heroSteps = [
    {
      title: t("hero.steps.analysis.title"),
      copy: t("hero.steps.analysis.copy"),
      num: "1"
    },
    {
      title: t("hero.steps.ranking.title"),
      copy: t("hero.steps.ranking.copy"),
      num: "2"
    },
    {
      title: t("hero.steps.output.title"),
      copy: t("hero.steps.output.copy"),
      num: "3"
    }
  ];

  return (
    <div className="app-shell">
      <header className="topbar-shell">
        <Container size="xl">
          <div className="topbar-inner">
            <Group justify="space-between" align="center" wrap="wrap" gap="md">
              <Group gap="sm" wrap="nowrap">
                <div className="topbar-mark" />
                <Stack gap={0}>
                  <Text fw={700} fz="md" lts={-0.3}>
                    {t("topbar.productName")}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {t("topbar.productTag")}
                  </Text>
                </Stack>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <Group gap={6} className="topbar-language-label" wrap="nowrap">
                  <IconLanguage size={14} stroke={1.5} />
                  <Text size="xs" c="dimmed">
                    {t("language.label")}
                  </Text>
                </Group>
                <SegmentedControl
                  value={language}
                  onChange={(value) => setLanguage(value as "en" | "ja")}
                  data={[
                    { value: "en", label: t("language.options.en") },
                    { value: "ja", label: t("language.options.ja") }
                  ]}
                  radius="xl"
                  size="xs"
                />
              </Group>
            </Group>
          </div>
        </Container>
      </header>

      <Container size="lg" mt="xl">
        <Stack gap={28}>
          <Paper
            className="glass-panel hero-panel"
            radius={24}
            p={{ base: "xl", md: 40 }}
          >
            <Stack gap="lg" style={{ position: "relative", zIndex: 1 }}>
              <Badge
                variant="light"
                color="teal"
                size="md"
                radius="sm"
                leftSection={<IconSparkles size={12} stroke={1.5} />}
              >
                {t("hero.badge")}
              </Badge>
              <SimpleGrid
                cols={{ base: 1, md: 2 }}
                spacing={40}
                verticalSpacing="xl"
                className="hero-grid"
              >
                <Stack gap="md">
                  <Title
                    order={1}
                    fz={{ base: 32, md: 46 }}
                    maw={580}
                    lh={1.08}
                    lts={-1}
                    fw={700}
                  >
                    {t("hero.title")}
                  </Title>
                  <Text c="dimmed" fz="md" maw={520} lh={1.65}>
                    {t("hero.description")}
                  </Text>
                  <Group gap={8} wrap="wrap" mt={4}>
                    <Badge
                      color="dark"
                      variant="light"
                      size="md"
                      radius="sm"
                    >
                      {t("hero.badges.ideas")}
                    </Badge>
                    <Badge
                      color="teal"
                      variant="light"
                      size="md"
                      radius="sm"
                    >
                      {t("hero.badges.feasibility")}
                    </Badge>
                    <Badge
                      color="orange"
                      variant="light"
                      size="md"
                      radius="sm"
                    >
                      {t("hero.badges.map")}
                    </Badge>
                  </Group>
                </Stack>
                <Stack gap={12} justify="center">
                  {heroSteps.map((step) => (
                    <Group
                      key={step.title}
                      align="flex-start"
                      wrap="nowrap"
                      className="hero-step-card"
                    >
                      <ThemeIcon
                        radius="md"
                        size={36}
                        color="teal"
                        variant="light"
                        style={{ fontSize: 13, fontWeight: 700 }}
                      >
                        {step.num}
                      </ThemeIcon>
                      <Stack gap={2}>
                        <Text fw={600} fz="sm">
                          {step.title}
                        </Text>
                        <Text c="dimmed" fz="sm" lh={1.5}>
                          {step.copy}
                        </Text>
                      </Stack>
                    </Group>
                  ))}
                </Stack>
              </SimpleGrid>
            </Stack>
          </Paper>

          <Paper
            className="section-card"
            p={{ base: "lg", md: "xl" }}
            radius={20}
          >
            <Stack gap="lg">
              <Group justify="space-between" align="flex-start">
                <Stack gap={4}>
                  <Group gap="xs" className="section-heading">
                    <IconFileAnalytics size={16} stroke={1.5} />
                    <Text fw={600} fz="sm">
                      {t("upload.title")}
                    </Text>
                  </Group>
                  <Text c="dimmed" fz="sm">
                    {t("upload.description")}
                  </Text>
                </Stack>
                <Button
                  onClick={handleAnalyze}
                  disabled={selectedFile == null}
                  loading={isAnalyzing}
                  rightSection={<IconArrowRight size={15} stroke={1.5} />}
                  color="teal"
                  radius="lg"
                  size="sm"
                >
                  {t("upload.analyzeButton")}
                </Button>
              </Group>

              <PdfUploader
                disabled={isAnalyzing}
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
              />

              {isError ? (
                <Alert
                  color="red"
                  radius="lg"
                  title={t("upload.analyzeErrorTitle")}
                  variant="light"
                >
                  {error.message}
                </Alert>
              ) : null}

              {result == null && !isAnalyzing ? (
                <Alert
                  color="gray"
                  radius="lg"
                  variant="light"
                  title={t("upload.emptyStateTitle")}
                >
                  {t("upload.emptyStateCopy")}
                </Alert>
              ) : null}
            </Stack>
          </Paper>

          {isAnalyzing ? (
            <Paper
              className="section-card"
              p={{ base: "lg", md: "xl" }}
              radius={20}
            >
              <Group gap="md">
                <ThemeIcon variant="light" color="teal" size={40} radius="md">
                  <IconLoader2 size={20} className="pulse-dot" />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text fw={600} fz="sm">
                    {t("upload.loadingTitle")}
                  </Text>
                  <Text c="dimmed" fz="sm">
                    {t("upload.loadingCopy")}
                  </Text>
                </Stack>
              </Group>
              <Group gap="sm" mt="md">
                <div
                  className="loading-shimmer"
                  style={{ height: 12, width: "70%", borderRadius: 6 }}
                />
                <div
                  className="loading-shimmer"
                  style={{
                    height: 12,
                    width: "45%",
                    borderRadius: 6,
                    animationDelay: "0.15s"
                  }}
                />
              </Group>
            </Paper>
          ) : null}

          {result != null ? (
            <Stack gap={28} className="fade-in">
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

              <Paper
                className="section-card"
                p={{ base: "lg", md: "xl" }}
                radius={20}
              >
                <Stack gap="lg">
                  <Group gap="xs" className="section-heading">
                    <IconRocket size={16} stroke={1.5} />
                    <Text fw={600} fz="sm">
                      {t("startups.title")}
                    </Text>
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

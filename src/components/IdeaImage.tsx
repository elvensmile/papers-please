"use client";

import Image from "next/image";
import { Alert, Paper, Stack, Text } from "@mantine/core";
import { IconPhoto, IconPhotoOff } from "@tabler/icons-react";
import { useTranslation } from "@/components/UiLanguageProvider";

type IdeaImageProps = {
  imageUrl: string | null;
  imageError: string | null;
  startupName: string;
};

export function IdeaImage({
  imageUrl,
  imageError,
  startupName
}: IdeaImageProps) {
  const t = useTranslation();

  return (
    <Paper
      className="section-card"
      p={{ base: "lg", md: "xl" }}
      radius={20}
    >
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={600} fz="sm">
            {t("image.title")}
          </Text>
          <Text c="dimmed" fz="sm">
            {t("image.description", { startupName })}
          </Text>
        </Stack>

        {imageUrl != null ? (
          <div className="image-frame">
            <Image
              src={imageUrl}
              alt={`${startupName} concept illustration`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 900px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <Alert
            color="gray"
            variant="light"
            radius="md"
            icon={
              imageError == null ? (
                <IconPhoto size={16} stroke={1.5} />
              ) : (
                <IconPhotoOff size={16} stroke={1.5} />
              )
            }
          >
            <Text fz="sm">{imageError ?? t("image.fallback")}</Text>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}

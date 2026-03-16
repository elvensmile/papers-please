import Image from "next/image";
import { Alert, Paper, Stack, Text } from "@mantine/core";
import { IconPhoto, IconPhotoOff } from "@tabler/icons-react";

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
  return (
    <Paper className="section-card" p={{ base: "lg", md: "xl" }} radius="xl">
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={700}>Concept image</Text>
          <Text c="dimmed">
            A visual direction for {startupName}, generated after the winning idea is
            selected.
          </Text>
        </Stack>

        {imageUrl != null ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "3 / 2",
              overflow: "hidden",
              borderRadius: 24
            }}
          >
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
            radius="lg"
            icon={imageError == null ? <IconPhoto size={18} /> : <IconPhotoOff size={18} />}
          >
            {imageError ?? "No image was returned, so this section is using a text-only fallback."}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}

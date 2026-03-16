"use client";

import {
  Alert,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconFileCheck,
  IconFileTypePdf,
  IconUpload,
  IconX
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useTranslation } from "@/components/UiLanguageProvider";
import { ACCEPTED_PDF_MIME_TYPES, MAX_PDF_SIZE_BYTES } from "@/config/constants";

type PdfUploaderProps = {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
  sampleFiles?: Array<{
    label: string;
    url: string;
    fileName: string;
  }>;
};

function validatePdf(file: File, invalidPdf: string, invalidSize: string) {
  if (
    !ACCEPTED_PDF_MIME_TYPES.includes(
      file.type as (typeof ACCEPTED_PDF_MIME_TYPES)[number]
    )
  ) {
    return invalidPdf;
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return invalidSize;
  }

  return null;
}

export function PdfUploader({
  onFileSelect,
  selectedFile,
  disabled = false,
  sampleFiles = []
}: PdfUploaderProps) {
  const t = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  const commitFile = (file: File | null) => {
    if (file == null) {
      onFileSelect(null);
      return;
    }

    const validationError = validatePdf(
      file,
      t("uploader.invalidPdf"),
      t("uploader.invalidSize")
    );
    if (validationError != null) {
      notifications.show({
        color: "red",
        title: t("uploader.invalidTitle"),
        message: validationError,
        icon: <IconX size={16} />
      });
      return;
    }

    onFileSelect(file);
  };

  const handleSampleSelect = async (sample: {
    label: string;
    url: string;
    fileName: string;
  }) => {
    try {
      setLoadingSample(sample.fileName);
      const response = await fetch(sample.url);

      if (!response.ok) {
        throw new Error("Sample file could not be loaded.");
      }

      const blob = await response.blob();
      commitFile(
        new File([blob], sample.fileName, {
          type: "application/pdf"
        })
      );
    } catch (error) {
      notifications.show({
        color: "red",
        title: t("uploader.invalidTitle"),
        message:
          error instanceof Error
            ? error.message
            : "Sample file could not be loaded."
      });
    } finally {
      setLoadingSample(null);
    }
  };

  return (
    <Stack gap="md">
      <Paper
        radius={16}
        p="xl"
        withBorder
        className={selectedFile == null ? "upload-dropzone" : "upload-dropzone upload-dropzone-active"}
        style={{
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: isDragging
            ? "var(--accent)"
            : selectedFile == null
              ? "rgba(13, 148, 136, 0.22)"
              : "rgba(13, 148, 136, 0.28)",
          background: isDragging
            ? "linear-gradient(135deg, rgba(13, 148, 136, 0.10), rgba(245, 158, 11, 0.07))"
            : selectedFile == null
              ? "linear-gradient(135deg, rgba(13, 148, 136, 0.05), rgba(245, 158, 11, 0.04))"
              : "linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(13, 148, 136, 0.03))",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all var(--transition)",
          boxShadow: isDragging
            ? "0 10px 30px rgba(13, 148, 136, 0.10)"
            : "0 8px 24px rgba(13, 148, 136, 0.05)"
        }}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);

          if (disabled) {
            return;
          }

          const file = event.dataTransfer.files.item(0);
          commitFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          hidden
          disabled={disabled}
          onChange={(event) => {
            commitFile(event.currentTarget.files?.item(0) ?? null);
          }}
        />

        <Stack align="center" gap="sm">
          <ThemeIcon
            size={54}
            radius="xl"
            variant="filled"
            color={selectedFile == null ? "teal" : "green"}
          >
            {selectedFile == null ? (
              <IconUpload size={22} stroke={1.5} />
            ) : (
              <IconFileCheck size={22} stroke={1.5} />
            )}
          </ThemeIcon>
          <Text fw={600} ta="center" fz="md">
            {selectedFile == null ? t("uploader.dropPrompt") : selectedFile.name}
          </Text>
          <Text c="dimmed" ta="center" maw={420} fz="sm">
            {t("uploader.helper")}
          </Text>
        </Stack>
      </Paper>

      {selectedFile == null ? (
        <Stack gap="md">
          <Alert
            color="teal"
            radius="md"
            variant="light"
            icon={<IconFileTypePdf size={16} stroke={1.5} />}
          >
            <Text fz="sm">{t("uploader.pdfOnly")}</Text>
          </Alert>

          {sampleFiles.length > 0 ? (
            <Paper
              p="md"
              radius="md"
              className="upload-samples"
              style={{
                background:
                  "linear-gradient(180deg, rgba(20, 91, 79, 0.04), rgba(245, 158, 11, 0.03))",
                border: "1px solid rgba(20, 91, 79, 0.10)"
              }}
            >
              <Stack gap="sm">
                <Stack gap={2}>
                  <Text fw={700} fz="sm">
                    {t("uploader.sampleTitle")}
                  </Text>
                  <Text c="dimmed" fz="sm">
                    {t("uploader.sampleDescription")}
                  </Text>
                </Stack>
                <Group gap="sm" wrap="wrap">
                  {sampleFiles.map((sample) => (
                    <Button
                      key={sample.fileName}
                      variant="light"
                      color={sample.fileName.includes("cancer") ? "orange" : "teal"}
                      radius="xl"
                      size="sm"
                      disabled={disabled}
                      loading={loadingSample === sample.fileName}
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleSampleSelect(sample);
                      }}
                    >
                      {sample.label}
                    </Button>
                  ))}
                </Group>
              </Stack>
            </Paper>
          ) : null}
        </Stack>
      ) : (
        <Group
          justify="space-between"
          p="sm"
          px="md"
          style={{
            background: "var(--surface-soft)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--surface-border)"
          }}
        >
          <Text size="sm" c="dimmed">
            {t("uploader.selectedSize", {
              size: (selectedFile.size / 1024 / 1024).toFixed(2)
            })}
          </Text>
          <Text
            component="button"
            type="button"
            c="teal"
            size="sm"
            fw={500}
            style={{ background: "transparent", border: 0, cursor: "pointer" }}
            onClick={() => commitFile(null)}
          >
            {t("uploader.clear")}
          </Text>
        </Group>
      )}
    </Stack>
  );
}

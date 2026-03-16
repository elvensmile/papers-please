"use client";

import {
  Alert,
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
  disabled = false
}: PdfUploaderProps) {
  const t = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <Stack gap="md">
      <Paper
        radius={16}
        p="xl"
        withBorder
        style={{
          borderStyle: "dashed",
          borderWidth: 1.5,
          borderColor: isDragging
            ? "var(--mantine-color-teal-5)"
            : "rgba(0, 0, 0, 0.10)",
          background: isDragging
            ? "rgba(13, 148, 136, 0.04)"
            : "var(--surface-soft)",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all var(--transition)"
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
          <ThemeIcon size={48} radius="md" variant="light" color="teal">
            {selectedFile == null ? (
              <IconUpload size={22} stroke={1.5} />
            ) : (
              <IconFileCheck size={22} stroke={1.5} />
            )}
          </ThemeIcon>
          <Text fw={600} ta="center" fz="md">
            {selectedFile == null ? t("uploader.dropPrompt") : selectedFile.name}
          </Text>
          <Text c="dimmed" ta="center" maw={400} fz="sm">
            {t("uploader.helper")}
          </Text>
        </Stack>
      </Paper>

      {selectedFile == null ? (
        <Alert
          color="gray"
          radius="md"
          variant="light"
          icon={<IconFileTypePdf size={16} stroke={1.5} />}
        >
          <Text fz="sm">{t("uploader.pdfOnly")}</Text>
        </Alert>
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

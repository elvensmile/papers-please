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
import { ACCEPTED_PDF_MIME_TYPES, MAX_PDF_SIZE_BYTES } from "@/config/constants";

type PdfUploaderProps = {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
};

function validatePdf(file: File) {
  if (!ACCEPTED_PDF_MIME_TYPES.includes(file.type as (typeof ACCEPTED_PDF_MIME_TYPES)[number])) {
    return "Please choose a PDF file.";
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return "That PDF is larger than 20MB.";
  }

  return null;
}

export function PdfUploader({
  onFileSelect,
  selectedFile,
  disabled = false
}: PdfUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const commitFile = (file: File | null) => {
    if (file == null) {
      onFileSelect(null);
      return;
    }

    const validationError = validatePdf(file);
    if (validationError != null) {
      notifications.show({
        color: "red",
        title: "Invalid file",
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
        radius="xl"
        p="xl"
        withBorder
        style={{
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: isDragging ? "var(--mantine-color-teal-6)" : "rgba(72, 53, 29, 0.18)",
          background: isDragging ? "rgba(13, 122, 95, 0.08)" : "rgba(255, 250, 240, 0.7)",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 160ms ease"
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
          <ThemeIcon size={54} radius="xl" variant="light" color="teal">
            {selectedFile == null ? <IconUpload size={24} /> : <IconFileCheck size={24} />}
          </ThemeIcon>
          <Text fw={700} ta="center">
            {selectedFile == null
              ? "Drag in a research paper or click to browse"
              : selectedFile.name}
          </Text>
        </Stack>
      </Paper>

      {selectedFile == null ? (
        <Alert color="gray" radius="lg" variant="light" icon={<IconFileTypePdf size={18} />}>
          PDF only, maximum 20MB.
        </Alert>
      ) : (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB selected
          </Text>
          <Text
            component="button"
            type="button"
            c="teal"
            size="sm"
            style={{ background: "transparent", border: 0, cursor: "pointer" }}
            onClick={() => commitFile(null)}
          >
            Clear file
          </Text>
        </Group>
      )}
    </Stack>
  );
}

"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";

const maximumImageSize = 5 * 1024 * 1024;

export function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (image: string) => void;
  label: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    if (file.size > maximumImageSize) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set("image", file);
      const response = await fetch("/api/v1/staff/content/images", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        image?: string;
        error?: string;
      };

      if (!response.ok || !result.image) {
        throw new Error(result.error ?? "The image could not be uploaded.");
      }

      onChange(result.image);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The image could not be uploaded.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  const src = value.startsWith("/") ? value : `/${value}`;

  return (
    <div className="space-y-3">
      <label className="block space-y-2 text-sm font-medium">
        {label}
        <input
          accept="image/jpeg,image/png,image/webp"
          className="block min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:font-medium"
          disabled={isUploading}
          onChange={uploadImage}
          required={!value}
          type="file"
        />
      </label>
      <p className="text-xs text-muted-foreground">
        JPEG, PNG, or WebP. Maximum file size: 5 MB.
      </p>
      {isUploading && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Uploading image…
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {value && (
        <div className="relative aspect-[16/9] max-w-lg overflow-hidden rounded-md border border-border bg-muted">
          <Image
            alt={`Current ${label.toLowerCase()}`}
            className="object-contain"
            fill
            sizes="(max-width: 700px) 100vw, 512px"
            src={src}
            unoptimized
          />
        </div>
      )}
    </div>
  );
}

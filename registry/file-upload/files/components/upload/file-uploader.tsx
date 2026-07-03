"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

export function FileUploader() {
  const [status, setStatus] = useState<string | null>(null);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("Preparing upload...");
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });
    if (!response.ok) {
      setStatus("Upload failed.");
      return;
    }

    const { url } = (await response.json()) as { url: string };
    setStatus("Uploading...");
    const put = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    setStatus(put.ok ? "Uploaded." : "Upload failed.");
  }

  return (
    <div className="space-y-2">
      <input type="file" onChange={onChange} aria-label="Upload a file" className="text-sm" />
      {status && (
        <p className="text-muted-foreground text-sm" role="status">
          {status}
        </p>
      )}
    </div>
  );
}

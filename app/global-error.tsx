"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100dvh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 1rem",
        }}
      >
        <h1>Something went wrong</h1>
        <button onClick={reset} style={{ textDecoration: "underline" }}>
          Try again
        </button>
      </body>
    </html>
  );
}

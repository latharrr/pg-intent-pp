"use client";

import { Button } from "@/components/Button";

export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-lg font-semibold text-ink">Something didn&apos;t load right.</h1>
      <p className="max-w-[32ch] text-sm text-muted-foreground">
        Your plan is safe. Nothing was lost. Give it another try.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}

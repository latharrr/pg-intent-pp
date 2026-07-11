"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.replace("/admin");
      router.refresh();
      return;
    }

    setIsSubmitting(false);
    setError("Incorrect password");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6">
      <h1 className="text-lg font-semibold text-ink">Picapool Admin</h1>
      <form onSubmit={onSubmit} className="flex w-full max-w-[280px] flex-col gap-3">
        <Input
          type="password"
          inputMode="numeric"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!error}
          autoFocus
        />
        {error && <p className="text-[13px] text-note">{error}</p>}
        <Button type="submit" disabled={isSubmitting || !password}>
          {isSubmitting ? "Checking..." : "Enter"}
        </Button>
      </form>
    </div>
  );
}

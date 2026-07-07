import Link from "next/link";
import { Button } from "@/components/Button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-lg font-semibold text-ink">This page wandered off.</h1>
      <p className="max-w-[32ch] text-sm text-muted-foreground">
        Let&apos;s get you back to planning your move.
      </p>
      <Link href={ROUTES.home}>
        <Button>Back to start</Button>
      </Link>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function DepositWatch({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;
    let stopped = false;

    async function tick() {
      if (stopped) return;
      try {
        await fetch("/api/deposits/watch");
      } catch {
        return;
      }
      if (!stopped) router.refresh();
    }

    void tick();
    const id = setInterval(() => void tick(), 15_000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [active, router]);

  return null;
}

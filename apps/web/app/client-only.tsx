"use client";

import { defaultSetOptions } from "@/lib/cookies";
import { useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <CookiesProvider defaultSetOptions={defaultSetOptions}>
      {children}
    </CookiesProvider>
  );
}

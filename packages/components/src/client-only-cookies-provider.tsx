"use client";

import { useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";

const defaultSetOptions = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export function ClientOnlyCookiesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

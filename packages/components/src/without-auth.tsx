"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export function withoutAuth(Component: any) {
  return function WithoutAuth(props: any) {
    const [hasMounted, setHasMounted] = useState(false);
    const [cookies] = useCookies(["access_token"]);

    useEffect(() => {
      setHasMounted(true);
      if (cookies.access_token) {
        window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL}/`;
      }
    }, [cookies.access_token]);

    if (!hasMounted) {
      return null;
    }

    if (cookies.access_token) {
      return null;
    }

    return <Component {...props} />;
  };
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export function withoutAuth(Component: any) {
  return function WithoutAuth(props: any) {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [cookies] = useCookies(["access_token"]);

    useEffect(() => {
      setHasMounted(true);
      if (cookies.access_token) {
        router.push("/");
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

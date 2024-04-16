"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-context";

export function withoutAuth(Component: any) {
  return function WithoutAuth(props: any) {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [{ isAuth }] = useAuth();

    useEffect(() => {
      setHasMounted(true);
      if (isAuth) {
        router.push("/");
      }
    }, [isAuth]);

    if (!hasMounted) {
      return null;
    }

    if (isAuth) {
      return null;
    }

    return <Component {...props} />;
  };
}

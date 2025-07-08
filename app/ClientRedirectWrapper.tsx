'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";

export default function ClientRedirectWrapper() {
  const searchParams = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const clientId = searchParams.get("client_id");

    if (!clientId) {
      window.location.replace("https://ciam-se-saas.onelogin.com");
    } else {
      setShowLogin(true);
    }
  }, [searchParams]);

  if (!showLogin) {
    return null;
  }

  return <LoginForm />;
}

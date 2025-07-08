"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";

export default function Page() {
  const searchParams = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const clientId = searchParams.get("client_id");

    if (!clientId) {
      // Redirect to OneLogin if client_id is not present
      window.location.replace("https://ciam-se-saas.onelogin.com");
    } else {
      setShowLogin(true); // Allow login form to render
    }
  }, [searchParams]);

  if (!showLogin) {
    return null; // Avoid rendering until we know what to do
  }

  return <LoginForm />;
}

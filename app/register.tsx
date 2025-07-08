"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [params, setParams] = useState({
    client_id: "",
    redirect_uri: "",
    state: "",
    scope: "",
    response_type: "",
    nonce: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setParams({
      client_id: searchParams.get("client_id") || "",
      redirect_uri: searchParams.get("redirect_uri") || "",
      state: searchParams.get("state") || "",
      scope: searchParams.get("scope") || "",
      response_type: searchParams.get("response_type") || "",
      nonce: searchParams.get("nonce") || "",
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          phoneNumber,
          password,
        }),
      });

      const result = await res.json();

      if (result.status?.code !== 200 || !result.data?.[0]?.session_token) {
        alert(result.status?.message || "Registration failed");
        return;
      }

      const sessionData = result.data[0];
      const sessionToken = sessionData.session_token;

      const codePayload = {
        nonce: params.nonce,
        session_token: sessionToken,
        email,
      };

      const code = Buffer.from(JSON.stringify(codePayload)).toString("base64");

      await fetch("/api/store-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          session_token: sessionToken,
          email,
          client_id: params.client_id,
        }),
      });

      const redirectUrl = new URL(params.redirect_uri);
      redirectUrl.searchParams.set("code", code);
      redirectUrl.searchParams.set("state", params.state);

      window.location.href = redirectUrl.toString();
    } catch (err) {
      console.error("Registration error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-gray-50 dark:bg-gray-900">
      <form
        id="register-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded shadow"
      >
        <div className="flex justify-center mb-4">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-4">
          Register
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none foc

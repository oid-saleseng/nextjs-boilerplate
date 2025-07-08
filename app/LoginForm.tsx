"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
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

  // 👇 Add keydown listener for Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const form = document.getElementById("login-form") as HTMLFormElement;
        if (form) {
          form.requestSubmit(); // triggers native submit
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      const result = await res.json();

      if (result.status?.code !== 200 || !result.data?.[0]?.session_token) {
        alert("Invalid username or password");
        return;
      }

      const sessionData = result.data[0];
      const sessionToken = sessionData.session_token;
      const userEmail = sessionData.user?.email || "";

      const codePayload = {
        nonce: params.nonce,
        session_token: sessionToken,
        email: userEmail,
      };

      const code = Buffer.from(JSON.stringify(codePayload)).toString("base64");

// Store code in KV via backend
await fetch("/api/store-code", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code,
    session_token: sessionToken,
    email: userEmail,
    client_id: params.client_id,
  }),
});
;

// Then redirect
const redirectUrl = new URL(params.redirect_uri);
redirectUrl.searchParams.set("code", code);
redirectUrl.searchParams.set("state", params.state);

window.location.href = redirectUrl.toString();

    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-gray-50 dark:bg-gray-900">
      <form
        id="login-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded shadow"
      >
        <div className="flex justify-center mb-4">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-4">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email/Phone Number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Login
        </button>

        <button
          type="button"
          className="w-full bg-white text-black border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition-colors"
          onClick={() => alert("Passkey login not implemented yet")}
        >
          Login with Passkey
        </button>

        <div className="text-center text-sm text-gray-500 mt-4 mb-1">
          Other Login Options
        </div>

        <div className="flex flex-col space-y-2">
          <button
            type="button"
            className="w-full bg-black text-white rounded-md px-4 py-2 hover:bg-gray-900 transition-colors flex items-center justify-center"
          >
             Continue with Apple
          </button>

          <button
            type="button"
            className="w-full bg-white text-black border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full bg-white text-black border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5 mr-2" />
            Continue with GitHub
          </button>
        </div>

        <div className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link
            href="./register"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Register here
          </Link>
        </div>
      </form>

      <footer className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
        Powered by{" "}
        <span className="font-semibold">OneLogin Authentication APIs </span>
      </footer>
    </div>
  );
}

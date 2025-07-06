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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const TEST_EMAIL = "user@example.com";
    const TEST_PASSWORD = "password123";

    if (email !== TEST_EMAIL || password !== TEST_PASSWORD) {
      alert("Invalid username or password");
      return;
    }

    const codePayload = { nonce: params.nonce };
    const code = Buffer.from(JSON.stringify(codePayload)).toString("base64");

    const redirectUrl = new URL(params.redirect_uri);
    redirectUrl.searchParams.set("code", code);
    redirectUrl.searchParams.set("state", params.state);

    window.location.href = redirectUrl.toString();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded shadow"
      >
        {/* Cool logo */}
        <div className="flex justify-center mb-4">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-4">
          Login
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
        >
          Log In
        </button>

        {/* Social login buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 rounded py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Image src="/apple.svg" alt="Apple" width={20} height={20} />
            Continue with Apple
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 rounded py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>
        </div>

        {/* Register link */}
        <div className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
            Register here
          </Link>
        </div>
      </form>

      <footer className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
        Powered by <span className="font-semibold">OneLogin API Authentication</span>
      </footer>
    </div>
  );
}

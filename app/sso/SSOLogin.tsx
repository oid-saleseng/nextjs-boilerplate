"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SSOLogin() {
  const searchParams = useSearchParams();
  const referrer = searchParams.get("ref") || "";

  const [email, setEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const lowerEmail = email.toLowerCase();
  if (lowerEmail.endsWith("@orga.com")) {
    const redirectUrl = `https://ciam-se-saas.onelogin.com/access/initiate?iss=https://se-b2b-org-a.onelogin.com/oidc/2&target_link_uri=https://ciam-se-saas.onelogin.com/start/4015637&login_hint=${encodeURIComponent(lowerEmail)}`;
    window.location.href = redirectUrl;
  } else {
    alert("Not a valid Enterprise customer");
  }
};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded shadow"
      >
        <div className="flex justify-center mb-4">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-2">
          B2B SSO Login
        </h2>

        {referrer && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">
            Referred by: <span className="font-medium">{referrer}</span>
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          required
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>

        <div className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Go to B2C Login?{" "}
          <Link
            href="https://ciam-se-saas.onelogin.com/access/initiate?iss=https://customlogin-ciam-demo.com&target_link_uri=https://ciam-se-saas.onelogin.com/start/4015637"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Return to Home
          </Link>
        </div>
      </form>

      <footer className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
        Powered by{" "}
        <span className="font-semibold">OneLogin API Authentication</span>
      </footer>
    </div>
  );
}

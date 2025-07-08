"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter an email address");
      return;
    }

    alert(`Login with email: ${email}`);
    // Add your login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
            >
              Continue with Email
            </button>
          </div>
        </form>

        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="w-full bg-black text-white rounded-md px-4 py-2 hover:bg-gray-900 transition-colors flex items-center justify-center"
            onClick={() => alert("Apple login not implemented yet")}
          >
             Continue with Apple
          </button>

          <button
            type="button"
            className="w-full bg-white text-black border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
            onClick={() => alert("Google login not implemented yet")}
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full bg-white text-black border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-center"
            onClick={() => alert("Passkey login not implemented yet")}
          >
            🔑 Continue with Passkey
          </button>
        </div>
      </div>
    </div>
  );
}

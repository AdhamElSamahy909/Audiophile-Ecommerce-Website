"use client";

import { useState } from "react";
import { signupAction } from "../actions";
import Link from "next/link";

export default function SignupForm() {
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError("");
    
    try {
      const result = await signupAction(formData);
      if (result?.error) {
        console.log(result);
        setError(result.error);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100/50 dark:from-black dark:via-zinc-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-accent">Audiophile</h1>
          </Link>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Join the premium audio experience
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-200 dark:border-zinc-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Create Account
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Start your journey with premium audio equipment
            </p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                disabled={isPending}
                minLength={3}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Choose a username (min. 3 characters)"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isPending}
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Create a strong password (min. 8 characters)"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-accent hover:bg-accent-light text-white dark:text-black font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                Already have an account?
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full text-center py-3 px-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 font-medium hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent transition-all duration-200"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-accent dark:hover:text-accent transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
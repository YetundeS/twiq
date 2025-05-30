"use client";

import { useState } from "react";
import { Header } from "@/components/landingPageComponents/Header";
import SignupForm from "@/components/authComponents/authForms/signupForm";
import LoginForm from "@/components/authComponents/authForms/login";
import RecoverPassword from "@/components/authComponents/authForms/recoverPass";
import Link from "next/link";

export default function Auth() {
  const [activeForm, setActiveForm] = useState("signup");

  return (
    <div className="animate-fade-in-up min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 transition-colors duration-300 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20">
      <Header />

      <div className="flex min-h-screen items-start justify-center pt-40 pb-8 md:pt-24">
        <div className="w-full max-w-md px-4">
          <div className="rounded-3xl border border-gray-200/50 bg-white p-8 shadow-2xl backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800">
            {/* Header */}
            <div className="mb-8">
              {activeForm === "password" ? (
                <h1 className="mb-2 text-xl leading-tight font-medium text-gray-900 sm:text-2xl lg:text-3xl dark:text-gray-100">
                  Reset your password
                </h1>
              ) : (
                <h1 className="mb-2 text-xl leading-tight font-medium text-gray-900 sm:text-2xl lg:text-3xl dark:text-gray-100">
                  {activeForm === "signup"
                    ? "Sign up to create your first script 💫"
                    : "Let's get you signed in"}
                </h1>
              )}
              <p className="text-gray-600 dark:text-gray-400">
                {activeForm === "signup" && (
                  <>
                    Already have an account{" "}
                    <button
                      onClick={() => setActiveForm("signin")}
                      className="cursor-pointer font-medium text-purple-600 hover:underline dark:text-purple-400"
                    >
                      Sign in
                    </button>
                  </>
                )}
                {activeForm === "signin" && (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveForm("signup")}
                      className="cursor-pointer font-medium text-purple-600 hover:underline dark:text-purple-400"
                    >
                      Sign up
                    </button>
                  </>
                )}
                {activeForm === "password" && (
                  <>
                    Go back to{" "}
                    <button
                      onClick={() => setActiveForm("signin")}
                      className="cursor-pointer font-medium text-purple-600 hover:underline dark:text-purple-400"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>

            {activeForm === "signup" && <SignupForm />}
            {activeForm === "signin" && <LoginForm />}
            {activeForm === "password" && <RecoverPassword />}

            {activeForm === "signin" && (
              <p className="mt-4 flex gap-1 justify-self-center text-sm text-gray-500 dark:text-gray-400">
                Forgot your password?
                <button
                  onClick={() => setActiveForm("password")}
                  className="cursor-pointer text-purple-600 hover:underline dark:text-purple-400"
                >
                  recover it
                </button>
              </p>
            )}

            {/* Terms */}
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              By signing up you agree to the{" "}
              <Link
                href="/terms-of-service"
                className="text-purple-600 hover:underline dark:text-purple-400"
              >
                Terms & Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

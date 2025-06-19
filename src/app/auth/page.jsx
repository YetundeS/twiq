"use client";

import AuthVisit from "@/components/authComponents/authForms/authVisit";
import "@/components/authComponents/authForms/authVisit.css";
import LoginForm from "@/components/authComponents/authForms/login";
import RecoverPassword from "@/components/authComponents/authForms/recoverPass";
import SignupForm from "@/components/authComponents/authForms/signupForm";
import TwiqBg from "@/components/dashboardComponent/twiqBg";
import GlowEffect from "@/components/landingPageComponents/GlowEffect";
import { Header } from "@/components/landingPageComponents/Header";
import { useState } from "react";
import "./auth.css";

export default function Auth() {
  const [activeForm, setActiveForm] = useState("visit");

  return (
    <div className="authPage min-h-screen ">
      <div className="innerauthPage animate-fade-in-up transition-colors duration-300">
        <Header />
        <TwiqBg />

        {activeForm == 'visit' ? (
          <>
            <AuthVisit setActiveForm={setActiveForm} />
          </>
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-full mt-[64px] max-w-md px-4">
              <GlowEffect>
                <div className="authFormTopWrapper rounded-3xl border border-gray-200/50 p-8 shadow-2xl backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800">
                  {/* Header */}
                  <div className="mb-8">
                    {activeForm === "password" ? (
                      <h1 className="formTitle mb-2 text-2xl leading-tight font-medium text-gray-900 md:text-3xl dark:text-gray-100">
                        Reset your password
                      </h1>
                    ) : (
                      <h1 className="formTitle mb-2 text-2xl leading-tight font-medium text-gray-900 md:text-3xl dark:text-gray-100">
                        {activeForm === "signup"
                          ? "Create New Account"
                          : "Let's get you signed in"}
                      </h1>
                    )}
                    <p className="subFormTitle text-sm text-gray-600 dark:text-gray-400">
                      {activeForm === "signup" && (
                        <>
                          Already registered{" "}
                          <button
                            onClick={() => setActiveForm("signin")}
                            className="cursor-pointer font-medium underline"
                          >
                            Log in
                          </button>
                        </>
                      )}
                      {activeForm === "signin" && (
                        <>
                          Don't have an account?{" "}
                          <button
                            onClick={() => setActiveForm("signup")}
                            className="cursor-pointer font-medium underline"
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
                            className="cursor-pointer font-medium underline"
                          >
                            Sign in
                          </button>
                        </>
                      )}
                    </p>
                  </div>

                  {activeForm === "signup" && <SignupForm />}
                  {activeForm === "signin" && <LoginForm setActiveForm={setActiveForm} />}
                  {activeForm === "password" && <RecoverPassword />}

                  {/* Terms */}
                  <div className="mt-8 text-center text-sm">
                    <p className="needHelp">need help?</p>
                  </div>
                </div>
              </GlowEffect >
            </div >
          </div >
        )}
      </div >
    </div>
  );
}

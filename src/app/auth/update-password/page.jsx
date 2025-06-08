"use client";

import UpdatePasswordForm from "@/components/authComponents/authForms/updatePasswordForm";
import GlowEffect from "@/components/landingPageComponents/GlowEffect";
import { Header } from "@/components/landingPageComponents/Header";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import "../auth.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const getSessionFromURL = async () => {
  //     if (typeof window !== "undefined") {
  //       const hashParams = new URLSearchParams(
  //         window.location.hash.substring(1),
  //       );
  //       const accessToken = hashParams.get("access_token");
  //       const refreshToken = hashParams.get("refresh_token");

  //       if (accessToken && refreshToken) {
  //         const { error } = await supabase.auth.setSession({
  //           access_token: accessToken,
  //           refresh_token: refreshToken,
  //         });

  //         if (error) {
  //           setError("Invalid or expired link.");
  //         } else {
  //           setError(null);
  //         }
  //       } else {
  //         setError("Access and Refresh Tokens Needed.");
  //       }

  //       setLoading(false);
  //     }
  //   };

  //   getSessionFromURL();
  // }, []);

  const handlePasswordUpdate = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: "Something went wrong." };
      }

      if (data) {
        return { message: "Password has been updated successfully!" };
      }
    } catch (error) {
      return { error: "Something went wrong." };
    }
  };

  return (
    <div className="authPage min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 transition-colors duration-300 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20">
      <Header />
      <div className="flex min-h-screen items-start justify-center pt-40 pb-8 md:pt-24">
        <div className="w-full max-w-md px-4">
          <GlowEffect>
            <div className="authFormTopWrapper rounded-3xl border border-gray-200/50 bg-white p-8 shadow-2xl backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800">
              {loading && (
                <h3 className="align-self-center text-2xl font-medium text-gray-700 md:text-3xl dark:text-gray-200">
                  Verifying...
                </h3>
              )}
              {error && (
                <h3 className="align-self-center text-2xl font-medium text-red-600 md:text-3xl dark:text-red-400">
                  {error}
                </h3>
              )}
              {!loading && !error && (
                <>
                  <h3 className="formTitle align-self-center mb-2 text-2xl font-medium text-gray-900 md:text-3xl dark:text-gray-100">
                    Update password
                  </h3>
                  <p className="subFormTitle align-self-center mb-6 text-gray-500 dark:text-gray-400">
                    Go back to{" "}
                    <a
                      href="/auth"
                      className="text-purple-600 hover:underline dark:text-purple-400"
                    >
                      login
                    </a>
                  </p>
                  <UpdatePasswordForm
                    handlePasswordUpdate={handlePasswordUpdate}
                  />
                </>
              )}

              {/* Terms */}
                  <div className="mt-8 text-center text-sm">
                    <p className="needHelp">need help?</p>
                  </div>
            </div>
          </GlowEffect>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;

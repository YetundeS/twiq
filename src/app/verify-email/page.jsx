"use client";

import { callVerifyEmailTokenAPI } from "@/apiCalls/authAPI";
import { Button } from "@/components/ui/button";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const rawToken = searchParams.get("token");
  const token = rawToken?.trim();
  const { user, updateUser } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [hasRun, setHasRun] = useState(false); // Local state instead of ref

  useEffect(() => {
    if (!token || hasRun) return;

    const verifyEmailToken = async () => {
      setHasRun(true); // Block future calls
      setLoading(true);

      const verifyResponse = await callVerifyEmailTokenAPI(token);

      if (verifyResponse?.error) {
        setError(verifyResponse.error);
        toast.error("Failed to verify email.", {
            description: verifyResponse.error,
        });
      } else {
          setVerified(true);
          toast.success("Your email has been verified", {
              description: "Happy TWIQing!",
          });

          if (user?.id) {
              updateUser({
                  ...user,
                  email_confirmed: true
              })

              const signString = generateSignString(user?.organization_name);

              if (!user?.is_active) {
                  openSubDialog();
                  router.push(`/platform/${signString}/settings`);
              } else {
                  router.push(`/platform/${signString}/`);
              }
          } else {
                router.push(`/`);
          }
      }

      setLoading(false);
    };

    verifyEmailToken();
  }, [token, hasRun, user, router]);

  return (
    <div className="w-full h-full min-h-[100vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full border border-[#5A0001]/20 rounded-lg shadow-md p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          {loading ? (
            <>
              <Loader2 className="animate-spin text-[#5A0001] h-6 w-6" />
              <h1 className="text-xl font-semibold text-[#5A0001]">
                Verifying your email...
              </h1>
              <p className="text-sm text-gray-600">
                Please wait while we confirm your email address.
              </p>
            </>
          ) : verified ? (
            <>
              <CheckCircle className="text-green-600 h-8 w-8" />
              <h1 className="text-xl font-semibold text-[#5A0001]">
                Email Verified!
              </h1>
              <p className="text-sm text-gray-600">
                Redirecting you shortly...
              </p>
            </>
          ) : (
            <>
              <XCircle className="text-red-600 h-8 w-8" />
              <h1 className="text-xl font-semibold text-[#5A0001]">
                Verification Failed
              </h1>
              <p className="text-sm text-gray-600">
                {error || "Something went wrong. Please try again later."}
              </p>
              <Button
                onClick={() => router.push("/")}
                className="mt-4 bg-[#5A0001] hover:bg-[#4a0000] text-white transition-colors duration-300"
              >
                Go to Home
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

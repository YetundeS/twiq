"use client";

import { callResendEmailAPI } from "@/apiCalls/authAPI";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import PlatformTop from "../platformTop";
import TwiqBg from "../twiqBg";
import "./dpc.css";


const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);


  const resendEmail = async () => {
    setLoading(true);

    const resendResponse = await callResendEmailAPI();

    if (resendResponse?.error) {
      toast.error("Failed to resend confirmation email.", {
        description: resendResponse.error,
      });
    } else {
      toast.success("Confirmation email sent!", {
        description: "Check your inbox or spam folder.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="db_page_content">
      <div className="db_pageTop">
        <PlatformTop hideAccount={true} db={true} />
      </div>
      <TwiqBg />
      <div
        className="db_pageBody w-full h-full flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
      >
        <div className="max-w-md w-full border border-[#5A0001]/20 rounded-lg shadow-md p-6"
          style={{ backgroundColor: "#fff" }}>
          <h2 className="text-2xl font-bold mb-3 text-[#5A0001]">Verify Your Email</h2>
          <p className="text-sm text-gray-600 mb-4">
            To continue using Twiq, please confirm your email address. A confirmation link was sent to your email during signup.
          </p>

          <Button
            onClick={resendEmail}
            disabled={loading}
            className="w-full cursor-pointer bg-[#5A0001] hover:bg-[#4a0000] text-white transition-colors duration-300"
          >
            {loading ? "Sending..." : "Resend Confirmation Email"}
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            Didn’t get the email? Try checking your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

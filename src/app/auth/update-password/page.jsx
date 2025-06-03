"use client";

import UpdatePasswordForm from "@/components/authComponents/authForms/updatePasswordForm";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import "../auth.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const UpdatePassword = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const getSessionFromURL = async () => {
    if (typeof window !== "undefined") {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setError("Invalid or expired link.");
          toast.error("Error validating your session", {
            description: error.message,
            style: {
              border: "none",
              color: "red",
            },
          });
        } else {
          setError(null);
        }
      } else {
        setError("Access and Refresh Tokens Needed.");
      }

      setLoading(false);
    }
  };

  getSessionFromURL();
}, []);


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
    <div className="authPage">
      <div className="form_component">
        <div className="form_carousel_container">
          <Image
            src={`/images/craft.png`}
            width={600}
            height={600}
            alt="login Image"
            className="loginImg"
          />
          <div className="loginCaption">
            <h3>
              Too Much Work? <span className="noProblem">No Problem</span>
            </h3>
          </div>
        </div>
        <div className="authForm_wrapper">
          {loading && <h3 className="formTitle">Verifying...</h3>}
          {error && <h3 className="formTitle">{error}</h3>}
          { (
            <>
              <h3 className="formTitle">Update password</h3>
              <p className="subTxt">
                Go back to{" "}
                <a href="/auth">
                  <span>login</span>
                </a>
              </p>
              <UpdatePasswordForm handlePasswordUpdate={handlePasswordUpdate} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;

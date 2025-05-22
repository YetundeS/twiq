"use client";

import { useState } from "react";
import "./auth.css";
import LoginForm from "@/components/authComponents/authForms/login";
import SignupForm from "@/components/authComponents/authForms/signupForm";
import RecoverPassword from "@/components/authComponents/authForms/recoverPass";
import Image from "next/image";

const Auth = () => {
  const [activeForm, setActiveForm] = useState("login"); // login, signup, recover
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
          {activeForm == "login" && (
            <h3 className="formTitle">Login to your account</h3>
          )}
          {activeForm == "signup" && (
            <h3 className="formTitle">Create an account</h3>
          )}
          {activeForm == "recover" && (
            <h3 className="formTitle">Reset your password</h3>
          )}
          {activeForm == "signup" && (
            <p className="subTxt">
              Already have an account?
              <span onClick={() => setActiveForm("login")}> log in</span>
            </p>
          )}
          {activeForm == "login" && (
            <p className="subTxt">
              Don't have an account?
              <span onClick={() => setActiveForm("signup")}> sign up</span>
            </p>
          )}
          {activeForm == "recover" && (
            <p className="subTxt">
              Go back to{" "}
              <span onClick={() => setActiveForm("login")}>login</span>
            </p>
          )}
          {activeForm == "login" && <LoginForm />}
          {activeForm == "signup" && <SignupForm />}
          {activeForm == "recover" && <RecoverPassword />}
          {activeForm == "login" && (
            <p className="subTxt forgot">
              Forgot your password?{" "}
              <span onClick={() => setActiveForm("recover")}>recover it</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

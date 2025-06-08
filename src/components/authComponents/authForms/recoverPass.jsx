"use client";
import { sendResetMail } from "@/apiCalls/authAPI";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import AuhVisitBtn from "./auhVisitBtn";
import "./authForms.css";

const RecoverPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });


  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ email: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setLoading(true);

      const response = await sendResetMail(formData?.email);

      setLoading(false);

      if (response.error) {
        toast.error("Error sending reset email.", {
          description: response.error || "Ensure your email is correct",
          style: {
            border: "none",
            color: "red",
          },
        });
      } else {
        toast.success("Reset password email sent Successful", {
          description:
            "Check your inbox (or spam folder) for the reset password link",
          duration: 10000, // 10 seconds
          style: {
            border: "none",
            color: "green",
          },
        });

        setFormData({ email: "" });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form className="authForm space-y-6">
      {/* Email */}
      <div>
        <Label
          htmlFor="email"
          className="font-medium text-gray-700"
        >
          Email
        </Label>
        <div className="relative mt-2">
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            className="formInput rounded-lg py-5 pr-4 pl-4 text-lg"
          />
        </div>
      </div>

      {/* Submit Button */}
      <AuhVisitBtn loading={loading} black onClick={handleSubmit} text="Reset"  />

      {errors?.email && <p className="textError">{errors?.email}</p>}
    </form>
  );
};

export default RecoverPassword;

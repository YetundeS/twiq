"use client";
import { useState } from "react";
import "./authForms.css";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { sendResetMail } from "@/apiCalls/authAPI";

const RecoverPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateUser = useAuthStore((state) => state.updateUser);

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
    <form onSubmit={handleSubmit} className="authForm">
      {/* Email */}
      <div className="authForm_field">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="formInput"
          placeholder="Enter your email"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="formBtn">
        {!loading ? (
          <p>Get reset email</p>
        ) : (
          <CircularProgress color="white" size="17px" />
        )}
      </button>
      {errors?.email && <p className="textError">{errors?.email}</p>}
    </form>
  );
};

export default RecoverPassword;

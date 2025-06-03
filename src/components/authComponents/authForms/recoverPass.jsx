"use client";
import { useState } from "react";
import "./authForms.css";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { sendResetMail } from "@/apiCalls/authAPI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <Label
          htmlFor="email"
          className="font-medium text-gray-700 dark:text-gray-300"
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
            className="rounded-lg border-gray-200 py-5 pr-4 pl-4 text-lg focus:border-purple-500 dark:border-gray-600 dark:focus:border-purple-400"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full cursor-pointer rounded-lg bg-gray-900 py-6 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
      >
        {!loading ? (
          <p>Reset password</p>
        ) : (
          <CircularProgress color="white" size="17px" />
        )}
      </Button>

      {errors?.email && <p className="textError">{errors?.email}</p>}
    </form>
  );
};

export default RecoverPassword;

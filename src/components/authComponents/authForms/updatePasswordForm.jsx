"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AuhVisitBtn from "./auhVisitBtn";
import "./authForms.css";

const UpdatePasswordForm = ({ handlePasswordUpdate }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.password = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setErrors(null);
      setLoading(true);

      const response = await handlePasswordUpdate(formData?.password);

      setLoading(false);

      if (response.error) {
        toast.error("Error updating password", {
          description: response.error || "Try again.",
          style: {
            border: "none",
            color: "red",
          },
        });
      } else {
        toast.success("Password succesfully updated", {
          description: "Don't loose your new one.",
          style: {
            border: "none",
            color: "green",
          },
        });

        setTimeout(() => {
          router.push("/auth");
        }, 1500);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form className="authForm space-y-6">
      {/* Password */}
      <div>
        <Label
          htmlFor="password"
          className="font-medium text-gray-700"
        >
          Password
        </Label>
        <div className="relative mt-2">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={"Set up a password"}
            value={formData.password}
            onChange={handleChange}
            className="formInput rounded-lg py-5 pr-4 pl-4 text-lg"
          />
          <Lock
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 transform text-white"
          />
        </div>
      </div>

      {/* Confirm Password */}

      <div>
        <Label
          htmlFor="password"
          className="font-medium text-gray-700"
        >
          Confirm Password
        </Label>
        <div className="relative mt-2">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder={"Confirm password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="formInput rounded-lg py-5 pr-4 pl-4 text-lg"
          />
          <Lock
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 transform text-white"
          />
        </div>
      </div>

      {/* Submit Button */}
      <AuhVisitBtn loading={loading} black onClick={handleSubmit} text="Update"  />
      {errors?.password && <p className="textError">{errors?.password}</p>}
    </form>
  );
};

export default UpdatePasswordForm;

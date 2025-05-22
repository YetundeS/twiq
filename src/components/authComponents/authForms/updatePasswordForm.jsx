"use client";
import { useState } from "react";
import "./authForms.css";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="authForm">
      {/* Password */}
      <div className="authForm_field">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="formInput"
          placeholder="password"
        />
        {showPassword ? (
          <EyeClosed
            onClick={() => setShowPassword(!showPassword)}
            className="passwordIcon"
          />
        ) : (
          <Eye
            onClick={() => setShowPassword(!showPassword)}
            className="passwordIcon"
          />
        )}
      </div>

      {/* Confirm Password */}
      <div className="authForm_field">
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="formInput"
          placeholder="Confirm password"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="formBtn">
        {!loading ? (
          <p>Update Password</p>
        ) : (
          <CircularProgress color="white" size="17px" />
        )}
      </button>
      {errors?.password && <p className="textError">{errors?.password}</p>}
    </form>
  );
};

export default UpdatePasswordForm;

"use client";
import { useState } from "react";
import "./authForms.css";
import CircularProgress from "@mui/material/CircularProgress";

import { createUser } from "@/apiCalls/authAPI";
import { toast } from "sonner";
import { Eye, EyeClosed } from "lucide-react";
import { validateForm } from "@/lib/utils";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    organization_name: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setLoading(true);
      const response = await createUser(formData);
      if (response.error) {
        toast.error("Error creating your account", {
          description: response?.error,
          style: {
            border: "none",
            color: "red",
          },
        });
      } else {
        toast.success("Account has been created", {
          description: "Verify your email to log in",
          style: {
            border: "none",
            color: "green",
          },
        });
      }
      setLoading(false);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="authForm">
      {/* Username */}
      <div className="authForm_field">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="formInput"
          placeholder="Username"
        />
      </div>

      {/* Organization Name */}
      <div className="authForm_field">
        <input
          type="text"
          name="organization_name"
          value={formData.organization_name}
          onChange={handleChange}
          className="formInput"
          placeholder="Name of your organization"
        />
      </div>

      {/* Email */}
      <div className="authForm_field">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="formInput"
          placeholder="email"
        />
      </div>

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
          className="passwordIcon" />

        ) : (
          <Eye 
          onClick={() => setShowPassword(!showPassword)}
          className="passwordIcon"
          />
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="formBtn">
        {!loading ? (
          <p>Sign Up</p>
        ) : (
          <CircularProgress color="white" size="17px" />
        )}
      </button>
      {(errors.username || errors?.email || errors?.password) && (
        <p className="textError">
          {errors?.username || errors?.email || errors?.password}
        </p>
      )}
    </form>
  );
};

export default SignupForm;

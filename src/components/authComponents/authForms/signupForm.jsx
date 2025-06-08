"use client";
import { createUser } from "@/apiCalls/authAPI";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateForm } from "@/lib/utils";
import { Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AuhVisitBtn from "./auhVisitBtn";
import "./authForms.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    organization_name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
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
    <form className="authForm space-y-6">
      {/* Username */}
      <div>
        <Label
          htmlFor="username"
          className="font-medium text-gray-700"
        >
          Username
        </Label>
        <div className="relative mt-2">
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="formInput rounded-lg py-5 pr-4 pl-4 text-lg"
          />
        </div>
      </div>

      {/* Organization Name */}
      <div>
        <Label
          htmlFor="organization"
          className="font-medium text-gray-700"
        >
          Organization
        </Label>
        <div className="relative mt-2">
          <Input
            id="organization"
            name="organization_name"
            type="text"
            placeholder="Name of your organization"
            value={formData.organization_name}
            onChange={handleChange}
            className="formInput rounded-lg py-5 pr-4 pl-4 text-lg"
            />
        </div>
      </div>

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
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            className="formInput rounded-lg py-5 pr-4 pl-4 text-lg"
            />
        </div>
      </div>

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

      {/* Submit Button */}
      <AuhVisitBtn loading={loading} black onClick={handleSubmit} text="Sign Up"  />

      {(errors.username ||
        errors?.organization_name ||
        errors?.email ||
        errors?.password) && (
        <p className="textError">
          {errors?.username ||
            errors?.organization_name ||
            errors?.email ||
            errors?.password}
        </p>
      )}

      {/* <SocialButtons /> */}
    </form>
  );
};

export default SignupForm;

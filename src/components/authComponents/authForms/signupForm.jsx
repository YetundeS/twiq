"use client";
import { useState } from "react";
import "./authForms.css";
import CircularProgress from "@mui/material/CircularProgress";
import { createUser } from "@/apiCalls/authAPI";
import { toast } from "sonner";
import SocialButtons from "@/components/authComponents/authForms/socialButtons";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { validateForm } from "@/lib/utils";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    organization_name: "",
  });

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username */}
      <div>
        <Label
          htmlFor="username"
          className="font-medium text-gray-700 dark:text-gray-300"
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
            className="rounded-xl border-gray-200 py-3 pr-4 pl-4 text-lg focus:border-purple-500 dark:border-gray-600 dark:focus:border-purple-400"
          />
        </div>
      </div>

      {/* Organization Name */}
      <div>
        <Label
          htmlFor="organization"
          className="font-medium text-gray-700 dark:text-gray-300"
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
            className="rounded-xl border-gray-200 py-3 pr-4 pl-4 text-lg focus:border-purple-500 dark:border-gray-600 dark:focus:border-purple-400"
          />
        </div>
      </div>

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
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl border-gray-200 py-3 pr-4 pl-4 text-lg focus:border-purple-500 dark:border-gray-600 dark:focus:border-purple-400"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <Label
          htmlFor="password"
          className="font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </Label>
        <div className="relative mt-2">
          <Input
            id="password"
            type="password"
            name="password"
            placeholder={"Set up a password"}
            value={formData.password}
            onChange={handleChange}
            className="rounded-xl border-gray-200 py-3 pr-12 pl-4 text-lg focus:border-purple-500 dark:border-gray-600 dark:focus:border-purple-400"
          />
          <Lock className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full cursor-pointer rounded-xl bg-gray-900 py-3 text-lg font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
      >
        {!loading ? (
          <p>Sign up</p>
        ) : (
          <CircularProgress color="white" size="17px" />
        )}
      </Button>

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

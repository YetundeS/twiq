"use client";
import { useState } from "react";
import "./authForms.css";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "sonner";
import { loginUser } from "@/apiCalls/authAPI";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { generateSignString } from "@/lib/utils";
import SocialButtons from "@/components/authComponents/authForms/socialButtons";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateUser = useAuthStore((state) => state.updateUser);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setLoading(true);
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      const response = await loginUser(formData);
      setLoading(false);

      if (response.error) {
        toast.error("Error signing in.", {
          description:
            response.error || "Ensure your email and password are correct",
          style: {
            border: "none",
            color: "red",
          },
        });
      } else {
        toast.success("Login Successful", {
          description: "Taking you to dashboard",
          style: {
            border: "none",
            color: "green",
          },
        });

        // update user state and route to dashboard
        updateUser(response.user);
        const signString = generateSignString(response.user?.organization_name);

        if (!signString) {
          toast.error("Error navigating you to dashboard.", {
            description: "your organization name is not available",
            style: {
              border: "none",
              color: "red",
            },
          });
        }

        if (response?.user.user_name === "admin") {
          setTimeout(() => {
            router.push(`/platform/${signString}/admin`);
          }, 1500);
        } else {
          setTimeout(() => {
            router.push(`/platform/${signString}/`);
          }, 1500);
        }
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
            placeholder={"Enter your password"}
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
          <p>Log in</p>
        ) : (
          <CircularProgress color="white" size="17px" />
        )}
      </Button>

      {(errors?.email || errors?.password) && (
        <p className="textError">{errors?.email || errors?.password}</p>
      )}

      {/* <SocialButtons /> */}
    </form>
  );
};

export default LoginForm;

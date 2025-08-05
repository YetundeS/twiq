"use client";
import { loginUser } from "@/apiCalls/authAPI";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import useSusbcriptionDialogStore from "@/store/useSusbcriptionDialogStore";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AuhVisitBtn from "./auhVisitBtn";
import "./authForms.css";

const LoginForm = ({ setActiveForm }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  }); 

  const router = useRouter();
    const { openSubDialog } = useSusbcriptionDialogStore();

  const [showPassword, setShowPassword] = useState(false);
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

        // Check if user is admin
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
        const isAdmin = response.user.is_admin || adminEmails.includes(response.user.email);

        if (isAdmin) {
          setTimeout(() => {
            router.push(`/platform/${signString}/admin`);
          }, 1000);
        } else if (!response?.user.email_confirmed) {
          setTimeout(() => {
            router.push(`/platform/${signString}/`);
          }, 1000);
        } else if(!response?.user.is_active) {
          setTimeout(() => {
            openSubDialog();
            router.push(`/platform/${signString}/settings`);
          }, 1000);
        } else {
          setTimeout(() => {
            router.push(`/platform/${signString}/`);
          }, 1000);
      }
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
          className="font-medium text-gray-700 "
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
          className="font-medium text-gray-700 "
        >
          Password
        </Label>
        <div className="relative mt-2">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={"Enter your password"}
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

      <p onClick={() => setActiveForm("password")} className="forgotPass mt-4 flex gap-1 align-self-center text-align-center border text-sm text-gray-500 dark:text-gray-400">
        Forgot your password?
      </p>

      {/* Submit Button */}
      <AuhVisitBtn loading={loading} black onClick={handleSubmit} text="Sign In" />

      {(errors?.email || errors?.password) && (
        <p className="textError">{errors?.email || errors?.password}</p>
      )}

      {/* <SocialButtons /> */}
    </form>
  );
};

export default LoginForm;

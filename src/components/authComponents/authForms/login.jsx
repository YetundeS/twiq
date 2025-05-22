"use client";
import { useState } from "react";
import "./authForms.css";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "sonner";
import { loginUser } from "@/apiCalls/authAPI";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { generateSignString } from "@/lib/utils";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
    <form onSubmit={handleSubmit} className="authForm">
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
            className="passwordIcon"
          />
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
          <p>Log in</p>
        ) : (
          <CircularProgress color="white" size="17px" />
        )}
      </button>
      {(errors?.email || errors?.password) && (
        <p className="textError">{errors?.email || errors?.password}</p>
      )}
    </form>
  );
};

export default LoginForm;

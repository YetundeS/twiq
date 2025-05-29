import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateSignString(orgName) {
  if (!orgName) return;
  return "@" + orgName.replace(/\s+/g, "");
}

export const validateForm = (formData) => {
  let newErrors = {};
  if (!formData.username) newErrors.username = "Username is required";
  if (!formData.organization_name)
    newErrors.organization_name = "The name of your organization is required";
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

export const addAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

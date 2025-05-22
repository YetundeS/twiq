import { addAuthHeader } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true, // 🔥 Ensures cookies are sent & received
});

export const createUser = async (formData) => {
  const { username: user_name, email, password, organization_name } = formData;
  try {
    const response = await API.post(`/user/signup`, {
      user_name,
      email,
      password,
      organization_name
    });

    return { status: response.status, user: response.data };
  } catch (err) {
    return {
      error:
        err?.response?.data?.error ||
        err?.message ||
        "Problem creating account - Try again.",
    };
  }
};

export const loginUser = async (formData) => {
  const { email, password } = formData;
  try {
    const response = await API.post(`/user/login`, { email, password })

    // Store token in localStorage
    localStorage.setItem("access_token", response.data.access_token);

    return { status: response.status, user: response.data?.user };
  } catch (err) {
    return {
      status: err?.response?.status || 500,
      error:
        err?.response?.data?.error ||
        err?.message ||
        "Problem signing in - Try again.",
    };
  }
};

export const logOutUser = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("access_token");

    // Send request to the logout endpoint (if token exists)
    if (token) {
      await API.post(
        `/user/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (err) {
    console.warn(
      "Logout request failed:",
      err?.response?.data?.error || err?.message
    );
  } finally {
    // ✅ Remove token from localStorage regardless of success or failure
    localStorage.removeItem("access_token");
  }

  return { status: 200, message: "Logged out locally." };
};

export const sendResetMail = async (email) => {
  try {
    const response = await API.post(`/user/reset-password`, {
      email,
    });

    return { status: response.status, user: response.data };
  } catch (err) {
    return {
      status: err?.response?.status || 500,
      error:
        err?.response?.data?.error ||
        err?.message ||
        "Problem signing in - Try again.",
    };
  }
};

export const fetchUser = async (updateUser) => {
  try {
    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.log("No access token found.");
      return;
    }

    
    // 🔹 Get auth headers
    const authHeader = addAuthHeader();

    // Send the access token to your backend to fetch the user
    const response = await API.get("/user/getUser", {
      headers: {
        "Content-Type": "application/json",
          ...authHeader,  // 🔥 Spread token header dynamically
      },
    });

      updateUser(response?.data.user);
  } catch (error) {
    console.log('err: ', error)
    toast.error("Error fetching user", {
      description: 'Error - fetching user',
      style: { border: "none", color: "red" },
    });
  }
};
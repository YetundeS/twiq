import { addAuthHeader } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

export const API = axios.create({
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
      organization_name,
    });

    // Store token in localStorage
    localStorage.setItem("twiq_access_token", response.data.access_token);
    localStorage.setItem("twiq_refresh_token", response.data.refresh_token);

    return { status: response.status, user: response.data?.user };
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
    const response = await API.post(`/user/login`, { email, password });

    // Store token in localStorage
    localStorage.setItem("twiq_access_token", response.data.access_token);
    localStorage.setItem("twiq_refresh_token", response.data.refresh_token);

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
    const token = localStorage.getItem("twiq_access_token");

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
    localStorage.removeItem("twiq_access_token");
  }

  return { status: 200, message: "Logged out locally." };
};

export const callResendEmailAPI = async () => {
  try {

    const authHeader = addAuthHeader();

    const response = await API.post(`/user/resend-email-confirmation`, {

    },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
      });

    return { message: response.data.message };
  } catch (err) {
    return {
      status: err?.response?.status || 500,
      error:
        err?.response?.data?.error ||
        err?.message ||
        "Problem sending confirmation email - Try again.",
    };
  }
};

export const callVerifyEmailTokenAPI = async (token) => {
  try {
    const authHeader = addAuthHeader();

    const response = await API.post(`/user/verify-email-token`, {
      token
    },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
      });

    return { message: response.data.message };
  } catch (err) {
    return {
      status: err?.response?.status || 500,
      error:
        err?.response?.data?.error ||
        err?.message ||
        "Problem sending confirmation email - Try again.",
    };
  }
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

export const fetchUser = async ({ updateUser, onUnauthorized }) => {
  try {
    const accessToken = localStorage.getItem("twiq_access_token");
    if (!accessToken) {
      console.warn("No access token found.");
      if (onUnauthorized) onUnauthorized();
      return;
    }

    const authHeader = addAuthHeader();

    const response = await API.get("/user/getUser", {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    });


    if (response?.data?.user) {
      updateUser(response.data.user);
    } else {
      throw new Error("User object missing in response");
    }
  } catch (error) {
    const isUnauthorized =
      error?.response?.status === 401 ||
      error?.response?.data?.error?.toLowerCase().includes("unauthorized");

    if (isUnauthorized && onUnauthorized) {
      onUnauthorized();
    }

    toast.error("Error fetching user", {
      description:
        error?.response?.data?.error || error?.message || "Something went wrong.",
      style: { border: "none", color: "red" },
    });
  }
};



export const saveProfilePicAPI = async (selectedImage, onUnauthorized) => {
  try {
    const accessToken = localStorage.getItem("twiq_access_token");
    if (!accessToken) {
      console.warn("No access token found.");
      if (onUnauthorized) onUnauthorized();
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedImage); // field name must match backend multer config

    const response = await API.post("/user/upload-avatar", formData, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response?.data?.avatar_url) {
      return response.data.avatar_url; // caller can use this to update UI/store
    } else {
      throw new Error("Upload succeeded but avatar_url missing");
    }

  } catch (error) {
    const isUnauthorized =
      error?.response?.status === 401 ||
      error?.response?.data?.error?.toLowerCase().includes("unauthorized");

    if (isUnauthorized && onUnauthorized) {
      onUnauthorized();
    }

    toast.error("Error uploading profile picture", {
      description:
        error?.response?.data?.error || error?.message || "Something went wrong.",
      style: { border: "none", color: "red" },
    });

    throw error;
  }
};


export const deleteUserAccountAPI = async () => {
  try {
    const accessToken = localStorage.getItem("twiq_access_token");
    if (!accessToken) {
      console.warn("No access token found.");
      if (onUnauthorized) onUnauthorized();
      return;
    }

    const authHeader = addAuthHeader();

    await API.get("/user/delete-account", {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    });


    return { message: 'Account deleted successfully'}
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

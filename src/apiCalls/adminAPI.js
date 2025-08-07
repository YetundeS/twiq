import { addAuthHeader } from "@/lib/utils";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URI;

// Get auth headers using the established pattern
const getAuthHeaders = () => {
  const authHeader = addAuthHeader();
  return {
    headers: {
      ...authHeader,
      "Content-Type": "application/json",
    },
  };
};

// Grant beta access to a user
export const grantBetaAccess = async ({ userEmail, betaPlan, startDate, durationDays }) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/beta-users`,
      { userEmail, betaPlan, startDate, durationDays },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error granting beta access:", error);
    throw error.response?.data || error;
  }
};

// Get all beta users
export const getBetaUsers = async (includeExpired = false) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/beta-users?includeExpired=${includeExpired}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching beta users:", error);
    throw error.response?.data || error;
  }
};

// Revoke beta access
export const revokeBetaAccess = async (userId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/beta-users/${userId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error revoking beta access:", error);
    throw error.response?.data || error;
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/dashboard-stats`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error.response?.data || error;
  }
};

// Get all users (for beta user selection)
export const getAllUsers = async (search = "") => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/users${search ? `?search=${search}` : ""}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error;
  }
};

// Process expired beta users
export const processExpiredBetaUsers = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/process-expired-beta`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error processing expired beta users:", error);
    throw error.response?.data || error;
  }
};

// Invite new user and grant beta access
export const inviteUser = async ({ userName, userEmail, organizationName, betaPlan, startDate, durationDays }) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/invite-user`,
      { userName, userEmail, organizationName, betaPlan, startDate, durationDays },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error inviting user:", error);
    throw error.response?.data || error;
  }
};
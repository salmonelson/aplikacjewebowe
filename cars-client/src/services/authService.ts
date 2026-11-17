import axios from "axios";
import type {
  AccountMessageResponse,
  LoginData,
  RegisterData,
  User,
} from "../models/Auth";
import { apiClient } from "../api/apiClient";

function getAuthError(error: unknown, fallback: string): Error {
  if (!axios.isAxiosError(error)) {
    return new Error(fallback, { cause: error });
  }

  const data = error.response?.data;
  if (Array.isArray(data)) {
    return new Error(data.join(" "));
  }
  if (typeof data === "string" && data.trim()) {
    return new Error(data);
  }
  if (data && typeof data === "object" && "message" in data) {
    return new Error(String(data.message));
  }

  return new Error(fallback, { cause: error });
}

export async function login(data: LoginData): Promise<User> {
  try {
    const response = await apiClient.post<User>("/account/login", data);
    return response.data;
  } catch (error) {
    throw getAuthError(error, "Logowanie nie powiodło się.");
  }
}

export async function register(data: RegisterData): Promise<AccountMessageResponse> {
  try {
    const response = await apiClient.post<AccountMessageResponse>("/account/register", data);
    return response.data;
  } catch (error) {
    throw getAuthError(error, "Rejestracja nie powiodła się.");
  }
}

export async function confirmEmail(userId: string, token: string): Promise<string> {
  const response = await apiClient.get("/account/confirm-email", {
    params: { userId, token },
  });
  return response.data?.message ?? "Adres e-mail został potwierdzony.";
}

export async function forgotPassword(email: string): Promise<AccountMessageResponse> {
  const response = await apiClient.post<AccountMessageResponse>("/account/forgot-password", { email });
  return response.data;
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string,
): Promise<string> {
  await apiClient.post("/account/reset-password", { email, token, newPassword });
  return "Hasło zostało zmienione.";
}

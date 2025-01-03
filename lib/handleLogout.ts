"use server";
import { cookies } from "next/headers";

export const handleLogout = async () => {
  // Clear all items from localStorage
  (await cookies()).delete("token");

  // Redirect to home page or login page
};
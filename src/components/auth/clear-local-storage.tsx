"use client";

export function ClearLocalStorage() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentProject");
  }

  return null;
}

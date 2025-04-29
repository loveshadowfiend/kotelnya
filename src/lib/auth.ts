"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = "secret";
const encodedKey = new TextEncoder().encode(secretKey);

export async function setAuthCookie(token: string) {
  const cookieStore = cookies();

  const { payload } = await jwtVerify(token, encodedKey, {
    algorithms: ["HS256"],
  });

  const expiresAt = new Date(payload.exp! * 1000);

  (await cookieStore).set("auth-token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteAuthCookie() {
  const cookieStore = cookies();
  (await cookieStore).delete("auth-token");
}

export async function getAuthToken() {
  const cookieStore = cookies();
  return (await cookieStore).get("auth-token")?.value;
}

export async function verifyAuth() {
  const token = await getAuthToken();

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.error("Ошибка верификации токена", error);
    return null;
  }
}

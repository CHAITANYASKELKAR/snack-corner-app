import { json, type RequestHandler, type Cookies } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { generateAuthToken } from "$lib/server/auth";
import type { AuthVerifyDTO, UserDTO } from "$lib/types";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { phoneNumber, otp } = (await request.json()) as AuthVerifyDTO;

  try {
    // Verify OTP (in production, this would validate against stored OTP)
    // For demo purposes, accept any 6-digit OTP
    if (!/^\d{6}$/.test(otp)) {
      return json({ error: "Invalid OTP format" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      return json({ error: "User not found" }, { status: 404 });
    }

    if (user.isBlocked) {
      return json({ error: "User is blocked" }, { status: 403 });
    }

    // Generate JWT token
    const token = generateAuthToken(user.id);

    // Set JWT in HTTP-only cookie
    cookies.set("authToken", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    });

    const userDTO: UserDTO = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name || undefined,
    };

    return json({ success: true, user: userDTO });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return json({ error: "Failed to verify OTP" }, { status: 500 });
  }
};

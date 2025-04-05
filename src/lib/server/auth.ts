import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import twilio from 'twilio';
import type { UserDTO } from '$lib/types';

// Set types for environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TWILIO_ACCOUNT_SID: string;
      TWILIO_AUTH_TOKEN: string;
      TWILIO_PHONE_NUMBER: string;
      JWT_SECRET: string;
    }
  }
}

const twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

interface JwtPayload {
  userId: string;
}

export async function sendOTP(phoneNumber: string): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP in database or cache with expiration (5 minutes)
  // For development/testing purposes, just log it:
  console.log(`OTP for ${phoneNumber}: ${otp}`);
  
  // In production, uncomment this to send actual SMS
  /*
  await twilioClient.messages.create({
    body: `Your Snack Corner verification code is: ${otp}`,
    from: env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
  */
  
  return otp;
}

export function generateAuthToken(userId: string): string {
  return jwt.sign({ userId } as JwtPayload, env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}
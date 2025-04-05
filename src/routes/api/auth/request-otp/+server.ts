import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { sendOTP } from '$lib/server/auth';
import type { AuthRequestDTO } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
  const { phoneNumber } = await request.json() as AuthRequestDTO;
  
  if (!phoneNumber || !/^\+\d{10,15}$/.test(phoneNumber)) {
    return json({ error: 'Invalid phone number format' }, { status: 400 });
  }
  
  try {
    // Create user if not exists
    let user = await prisma.user.findUnique({
      where: { phoneNumber }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: { phoneNumber }
      });
    }
    
    if (user.isBlocked) {
      return json({ error: 'User is blocked' }, { status: 403 });
    }
    
    const otp = await sendOTP(phoneNumber);
    // In production, store hashed OTP with expiration
    
    return json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP request failed:', error);
    return json({ error: 'Failed to send OTP' }, { status: 500 });
  }
};
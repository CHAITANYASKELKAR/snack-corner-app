import type { Handle } from '@sveltejs/kit';
import { verifyAuthToken } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';

export const handle: Handle = async ({ event, resolve }) => {
  // List of paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/api/auth/request-otp',
    '/api/auth/verify-otp'
  ];
  
  const isPublicPath = publicPaths.some(path => 
    event.url.pathname === path || event.url.pathname.startsWith(path + '/')
  );
  
  if (!isPublicPath) {
    // Check for authentication token
    const authToken = event.cookies.get('authToken');
    
    if (!authToken) {
      // Redirect to login if no token found
      if (event.url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response('Redirect', {
          status: 303,
          headers: { Location: '/login' }
        });
      }
    }
    
    // Verify token
    const payload = verifyAuthToken(authToken);
    
    if (!payload) {
      // Invalid or expired token
      event.cookies.delete('authToken', { path: '/' });
      
      if (event.url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response('Redirect', {
          status: 303,
          headers: { Location: '/login' }
        });
      }
    }
    
    // Check if user exists and is not blocked
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });
    
    if (!user || user.isBlocked) {
      event.cookies.delete('authToken', { path: '/' });
      
      if (event.url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response('Redirect', {
          status: 303,
          headers: { Location: '/login' }
        });
      }
    }
    
    // Set user in locals for use in routes
    event.locals.user = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name
    };
  }
  
  return resolve(event);
};
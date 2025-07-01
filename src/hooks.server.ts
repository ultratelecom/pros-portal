import type { Handle } from '@sveltejs/kit';
import { getAuthToken, verifyToken } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  const token = getAuthToken(event.cookies);
  
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      event.locals.user = payload;
    }
  }
  
  return resolve(event);
}; 
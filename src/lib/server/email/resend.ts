import { Resend } from 'resend';

import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

// necessary due to building bs
export const resend = (!building ? new Resend(env.RESEND_API_KEY) : null)!;

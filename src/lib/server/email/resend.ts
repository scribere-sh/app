import { Resend } from "resend";

import { building } from "$app/environment";
import { env } from "$env/dynamic/private";

// necessary due to building bs
export const resend = (!building ? new Resend(env.RESEND_API_KEY) : null)!;

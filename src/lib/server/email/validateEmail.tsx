import * as React from "react";

import { resend } from "./resend.ts";
import VerifyEmailTemplate from "./toxic-waste/validateEmail.tsx";

export const sendEmailValidationEmail = async (emailAddress: string, name: string, challengeUrl: string) => {
    return await resend.emails.send({
        from: "noreply@scribere.sh",
        to: emailAddress,

        subject: "Scribere - Change Password",
        react: <VerifyEmailTemplate challengeUrl={challengeUrl} name={name} />,
    });
};

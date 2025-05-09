import * as React from "react";

import { resend } from "./resend.ts";
import UpdatePasswordTemplate from "./toxic-waste/updatePassword.tsx";

export const sendUpdatePasswordEmail = async (emailAddress: string, name: string, challengeUrl: string) => {
    return await resend.emails.send({
        from: "noreply@scribere.sh",
        to: emailAddress,

        subject: "Scribere - Change Password",
        react: <UpdatePasswordTemplate challengeUrl={challengeUrl} name={name} />,
    });
};

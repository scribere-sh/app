import * as React from "react";

import { resend } from "./resend.ts";
import OnboardingTemplate from "./toxic-waste/onboarding.tsx";

export const sendOnboardingEmail = async (emailAddress: string, onboardingLink: string) => {
    return await resend.emails.send({
        from: "noreply@scribere.sh",
        to: emailAddress,

        subject: "Scribere Onboarding",
        react: <OnboardingTemplate onboardingUrl={onboardingLink} />,
    });
};

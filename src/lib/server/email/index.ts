import { sendOnboardingEmail } from "./onboarding.tsx";
import { sendUpdatePasswordEmail } from "./updatePassword.tsx";
import { sendEmailValidationEmail } from "./validateEmail.tsx";

export { sendEmailValidationEmail as sendVerifyEmailEmail, sendOnboardingEmail, sendUpdatePasswordEmail };

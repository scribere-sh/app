import OnboardingTemplate from './toxic-waste/onboarding.tsx';
import { resend } from './resend.ts';

export const sendOnboardingEmail = async (emailAddress: string, onboardingLink: string) => {
	return await resend.emails.send({
		from: 'noreply@scribere.sh',
		to: emailAddress,

		subject: 'Scribere Onboarding',
		react: <OnboardingTemplate onboardingUrl={onboardingLink} />
	});
};

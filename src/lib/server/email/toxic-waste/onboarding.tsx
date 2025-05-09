import * as React from "react";

import { Root } from "./root";

import { Button, Heading, Link, Text } from "@react-email/components";

export interface OnboardingEmailProps {
    onboardingUrl: string;
}

export default function Email({ onboardingUrl }: OnboardingEmailProps) {
    return (
        <Root preview="Welcome to Scribere">
            <Heading as="h1">Hey There!</Heading>

            <Heading as="h3">Welcome to Scribere!</Heading>

            <Text>
                You're receiving this email because someone (<em>hopefully you</em>), wants to sign up for Scribere.
            </Text>

            <Text>
                You'll want to be quick, this link expires in <strong>30 minutes</strong>.
            </Text>

            <Text>Click the link below to get started!</Text>

            <Button href={onboardingUrl} style={{ margin: "2rem 0" }}>
                Click Here to get Started
            </Button>

            <Text style={{ fontStyle: "italic", fontSize: "14px" }}>
                or if that doesn't work, copy-paste the link below
            </Text>

            <Link href={onboardingUrl} style={{ fontFamily: "monospace", fontSize: "14px" }}>
                {onboardingUrl}
            </Link>
        </Root>
    );
}

// preview props
Email.PreviewProps = {
    onboardingUrl: "https://example.com",
} satisfies Parameters<typeof Email>[0];

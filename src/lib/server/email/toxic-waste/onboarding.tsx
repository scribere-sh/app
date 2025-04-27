import * as React from "react";

import { Root } from "./root";

import { Button, Container, Heading, Img, Link, Preview, Section, Text } from "@react-email/components";

const header: React.CSSProperties = {
    maxWidth: "100%",
    backgroundColor: "#222",
    margin: "0 auto",
    zIndex: "999",
};

const body: React.CSSProperties = {
    color: "#222",
    padding: "30px",
    width: "648px",
    maxWidth: "100%",
};

const footer: React.CSSProperties = {
    maxWidth: "100%",
    backgroundColor: "#222",
    color: "#eee",
    margin: "0 auto",
    zIndex: "999",
};

export interface OnboardingEmailProps {
    onboardingUrl: string;
}

export default function Email({ onboardingUrl }: OnboardingEmailProps) {
    return (
        <Root>
            <Preview>Welcome to Scribere</Preview>
            <Section style={header}>
                <Section style={{ padding: "30px", maxWidth: "648px", width: "100%" }}>
                    <Img src="https://cdn.scribere.sh/logo.png" alt="Scribere logo" height="64px" />
                </Section>
            </Section>
            <Container style={body}>
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
            </Container>

            <Section style={footer}>
                <Section style={{ padding: "30px", maxWidth: "648px", width: "100%" }}>
                    Copyright &copy; 2025 | Scribere
                </Section>
            </Section>
        </Root>
    );
}

// preview props
Email.PreviewProps = {
    onboardingUrl: "https://example.com",
} satisfies Parameters<typeof Email>[0];

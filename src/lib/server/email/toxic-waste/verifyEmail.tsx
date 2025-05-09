import * as React from "react";

import { Root } from "./root";

import { Button, Heading, Link, Text } from "@react-email/components";

export interface VerifyEmailProps {
    challengeUrl: string;
    name: string;
}

export default function Email({
    challengeUrl,
    name,
}: VerifyEmailProps) {
    return (
        <Root preview="Verify your new Email">
            <Heading as="h1">Verify your new Email</Heading>

            <Text>
                Hey there <strong>{name}</strong>,
            </Text>

            <Text>
                This account has requested an email address change.
            </Text>

            <Text>
                If you did not make this request, we recommend that you change your password as soon as possible.
            </Text>

            <Text>
                If it was you who requested this change, please click the button below to continue.
            </Text>

            <Text>
                <em>
                    <strong>Note</strong>: this link expires in <strong>30 minutes</strong>{" "}
                    from the time the request was made.
                </em>
            </Text>

            <Button href={challengeUrl} style={{ margin: "2rem 0" }}>Click Here to verify Email</Button>

            <Text style={{ fontStyle: "italic", fontSize: "14px" }}>
                or if that doesn't work, copy-paste the link below
            </Text>

            <Link href={challengeUrl} style={{ fontFamily: "monospace", fontSize: "14px" }}>
                {challengeUrl}
            </Link>
        </Root>
    );
}

// preview props
Email.PreviewProps = {
    challengeUrl: "https://example.com",
    name: "Test User",
} satisfies Parameters<typeof Email>[0];

import * as React from "react";

import { Root } from "./root";

import { Button, Heading, Link, Text } from "@react-email/components";

export interface UpdatePasswordProps {
    challengeUrl: string;
    name: string;
}

export default function Email({
    challengeUrl,
    name,
}: UpdatePasswordProps) {
    return (
        <Root preview="Change your Password">
            <Heading as="h1">Change your Password</Heading>

            <Text>
                Hey there <strong>{name}</strong>,
            </Text>

            <Text>
                You're receiving this email because a password change request was submitted with this email (<em>
                    hopefully submitted by you<em>.)</em>
                </em>
            </Text>

            <Text>
                If it was you who requested this change, please click the button below to continue. Otherwise, you can
                disregard this email.
            </Text>

            <Text>
                <em>
                    <strong>Note</strong>: this link expires in <strong>30 minutes</strong>{" "}
                    from the time the request was made.
                </em>
            </Text>

            <Button href={challengeUrl} style={{ margin: "2rem 0" }}>Click Here to Change Password</Button>

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

import * as React from "react";

import { Body, Container, Head, Html, Img, Preview, Section } from "@react-email/components";

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

const bodyStyle: React.CSSProperties = {
    fontFamily: "\"Google Sans\",Roboto,RobotoDraft,Helvetica,Arial,sans-serif",
    backgroundColor: "#eee",
    margin: "0",
};

export const Root = ({ children, preview }: { children?: React.ReactNode; preview: string }) => {
    return (
        <Html>
            <Head />
            <Body style={bodyStyle}>
                <Preview>{preview}</Preview>
                <Section style={header}>
                    <Section style={{ padding: "30px", maxWidth: "648px", width: "100%" }}>
                        <Img src="https://cdn.scribere.sh/logo.png" alt="Scribere logo" height="64px" />
                    </Section>
                </Section>
                <Container style={body}>
                    {children}
                </Container>
                <Section style={footer}>
                    <Section style={{ padding: "30px", maxWidth: "648px", width: "100%" }}>
                        Copyright &copy; 2025 | Scribere
                    </Section>
                </Section>
            </Body>
        </Html>
    );
};

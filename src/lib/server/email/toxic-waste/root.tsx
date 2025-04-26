import { Body, Head, Html } from "@react-email/components";
import * as React from "react";

const bodyStyle: React.CSSProperties = {
    fontFamily: "\"Google Sans\",Roboto,RobotoDraft,Helvetica,Arial,sans-serif",
    backgroundColor: "#eee",
};

export const Root = ({ children }: { children?: React.ReactNode }) => {
    return (
        <Html>
            <Head />
            <Body style={bodyStyle}>{children}</Body>
        </Html>
    );
};

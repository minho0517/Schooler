'use client';
import { SessionProvider } from "next-auth/react";

export default function AuthSession({ children }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
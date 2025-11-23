"use client"

import type React from "react"
import { ThemeToggle } from "@/componets/theme-toggle"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="flex justify-end p-4">
                <ThemeToggle />
            </div>
            {children}
        </div>
    )
}

"use client"

import type React from "react"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { Sidebar } from "@/app/(protected)/Sidebar"

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    useProtectedRoute()

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    )
}

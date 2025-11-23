"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function useProtectedRoute() {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const token = localStorage.getItem("auth_token")

        if (!token && !pathname.startsWith("/auth") && pathname !== "/") {
            router.push("/auth/login")
        }
    }, [router, pathname])

    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    return { token }
}

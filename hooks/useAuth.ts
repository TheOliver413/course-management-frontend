"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface User {
    id: number
    email: string
    fullName: string
    role: "admin" | "user"
}

export interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<boolean>
    register: (email: string, password: string, fullName: string) => Promise<boolean>
    logout: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Load auth from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token")
        const storedUser = localStorage.getItem("auth_user")
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Login failed")
                setIsLoading(false)
                return false
            }

            setToken(data.token)
            setUser(data.user)
            localStorage.setItem("auth_token", data.token)
            localStorage.setItem("auth_user", JSON.stringify(data.user))

            setIsLoading(false)
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
            setIsLoading(false)
            return false
        }
    }, [])

    const register = useCallback(async (email: string, password: string, fullName: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, fullName }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Registration failed")
                setIsLoading(false)
                return false
            }

            setToken(data.token)
            setUser(data.user)
            localStorage.setItem("auth_token", data.token)
            localStorage.setItem("auth_user", JSON.stringify(data.user))

            setIsLoading(false)
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed")
            setIsLoading(false)
            return false
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        router.push("/auth/login")
    }, [router])

    return {
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
    }
}

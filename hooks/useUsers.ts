"use client"

import { useState, useCallback } from "react"
import { APIClient } from "@/lib/api-client"

export interface User {
    id: number
    email: string
    full_name: string
    fullName: string
    role: string
    created_at: string
}

export interface UserResponse {
    items: User[]
    total: number
    pages: number
}

export function useUsers(token: string | null) {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUsers = useCallback(
        async (page = 1, limit = 10) => {
            if (!token) return
            setIsLoading(true)
            setError(null)

            try {
                const api = new APIClient()
                api.setToken(token)
                const data = await api.get(`/api/users?page=${page}&limit=${limit}`)
                setUsers(data.items)
                return data as UserResponse
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to fetch users"
                setError(message)
                console.error("[] Error fetching users:", message)
            } finally {
                setIsLoading(false)
            }
        },
        [token],
    )

    const fetchCurrentUser = useCallback(async () => {
        if (!token) return null
        setIsLoading(true)
        setError(null)

        try {
            const api = new APIClient()
            api.setToken(token)
            const data = await api.get("/api/users/profile/me")
            return data as User
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch user profile"
            setError(message)
            console.error("[] Error fetching current user:", message)
        } finally {
            setIsLoading(false)
        }
    }, [token])

    const fetchUserPrograms = useCallback(async () => {
        if (!token) return []
        setIsLoading(true)
        setError(null)

        try {
            const api = new APIClient()
            api.setToken(token)
            const data = await api.get("/api/users/programs/me")
            return data || []
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch user programs"
            setError(message)
            console.error("[] Error fetching user programs:", message)
            return []
        } finally {
            setIsLoading(false)
        }
    }, [token])

    return {
        users,
        isLoading,
        error,
        fetchUsers,
        fetchCurrentUser,
        fetchUserPrograms,
    }
}

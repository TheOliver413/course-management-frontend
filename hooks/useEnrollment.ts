"use client"

import { useState, useCallback } from "react"
import { APIClient } from "@/lib/api-client"

export function useEnrollment(token: string | null) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const enrollUserInProgram = useCallback(
        async (programId: number, userId: number) => {
            if (!token) return false
            setIsLoading(true)
            setError(null)

            try {
                const api = new APIClient()
                api.setToken(token)
                await api.post(`/api/programs/${programId}/enroll`, { userId })
                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to enroll"
                setError(message)
                console.error("[] Error enrolling user:", message)
                return false
            } finally {
                setIsLoading(false)
            }
        },
        [token],
    )

    const unenrollUserFromProgram = useCallback(
        async (programId: number, userId: number) => {
            if (!token) return false
            setIsLoading(true)
            setError(null)

            try {
                const api = new APIClient()
                api.setToken(token)
                await api.delete(`/api/programs/${programId}/enroll/${userId}`)
                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to unenroll"
                setError(message)
                console.error("[] Error unenrolling user:", message)
                return false
            } finally {
                setIsLoading(false)
            }
        },
        [token],
    )

    const fetchProgramUsers = useCallback(
        async (programId: number, page = 1, limit = 10) => {
            if (!token) return null
            setIsLoading(true)
            setError(null)

            try {
                const api = new APIClient()
                api.setToken(token)
                const data = await api.get(`/api/programs/${programId}/users?page=${page}&limit=${limit}`)
                return data
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to fetch program users"
                setError(message)
                console.error("[] Error fetching program users:", message)
                return null
            } finally {
                setIsLoading(false)
            }
        },
        [token],
    )

    return {
        isLoading,
        error,
        enrollUserInProgram,
        unenrollUserFromProgram,
        fetchProgramUsers,
    }
}

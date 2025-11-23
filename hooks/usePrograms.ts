"use client"

import { useState, useCallback } from "react"
import { APIClient } from "@/lib/api-client"

export interface Program {
    id: number
    name: string
    description: string
    start_date: string
    status: string
    created_at: string
}

export interface ProgramResponse {
    items: Program[]
    total: number
    pages: number
}

export function usePrograms(token: string | null) {
    const [programs, setPrograms] = useState<Program[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchPrograms = useCallback(
        async (page = 1, limit = 10) => {
            if (!token) return
            setIsLoading(true)
            setError(null)

            try {
                const api = new APIClient()
                api.setToken(token)
                const data = await api.get(`/api/programs?page=${page}&limit=${limit}`)
                setPrograms(data.items)
                return data as ProgramResponse
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to fetch programs"
                setError(message)
                console.error("[] Error fetching programs:", message)
            } finally {
                setIsLoading(false)
            }
        },
        [token],
    )

    const fetchProgramById = useCallback(
        async (id: number) => {
            if (!token) return null
            setIsLoading(true)
            setError(null)

            try {
                const api = new APIClient()
                api.setToken(token)
                const data = await api.get(`/api/programs/${id}`)
                return data as Program
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to fetch program"
                setError(message)
                console.error("[] Error fetching program:", message)
            } finally {
                setIsLoading(false)
            }
        },
        [token],
    )

    const createProgram = useCallback(
        async (programData: {
            name: string
            description: string
            startDate: string
            status?: string
        }) => {
            if (!token) return null
            setIsLoading(true)
            setError(null)

            try {
                const api = new APIClient()
                api.setToken(token)
                const data = await api.post("/api/programs", {
                    name: programData.name,
                    description: programData.description,
                    start_date: programData.startDate,
                    status: programData.status || "active",
                })
                return data as Program
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to create program"
                setError(message)
                console.error("[] Error creating program:", message)
            } finally {
                setIsLoading(false)
            }
        },
        [token],
    )

    const updateProgram = useCallback(
        async (
            id: number,
            programData: {
                name: string
                description: string
                startDate: string
                status: string
            },
        ) => {
            if (!token) return null
            setIsLoading(true)
            setError(null)

            try {
                const api = new APIClient()
                api.setToken(token)
                const data = await api.put(`/api/programs/${id}`, programData)
                return data as Program
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to update program"
                setError(message)
                console.error("[] Error updating program:", message)
            } finally {
                setIsLoading(false)
            }
        },
        [token],
    )

    const deleteProgram = useCallback(
        async (id: number) => {
            if (!token) return false
            setIsLoading(true)
            setError(null)

            try {
                const api = new APIClient()
                api.setToken(token)
                await api.delete(`/api/programs/${id}`)
                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to delete program"
                setError(message)
                console.error("[] Error deleting program:", message)
                return false
            } finally {
                setIsLoading(false)
            }
        },
        [token],
    )

    return {
        programs,
        isLoading,
        error,
        fetchPrograms,
        fetchProgramById,
        createProgram,
        updateProgram,
        deleteProgram,
    }
}

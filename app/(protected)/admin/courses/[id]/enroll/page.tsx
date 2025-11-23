"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../../componets/ui/card"
import { Button } from "../../../../../../componets/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { APIClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface User {
    id: number
    email: string
    full_name: string
    fullName: string
    role: string
}

export default function EnrollUserPage() {
    const { token } = useAuth()
    const router = useRouter()
    const params = useParams()
    const programId = params.id as string
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isEnrolling, setIsEnrolling] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const [enrolledUserIds, setEnrolledUserIds] = useState<number[]>([])

    useEffect(() => {
        if (!token) return

        const fetchData = async () => {
            try {
                const api = new APIClient()
                api.setToken(token)

                // Obtener todos los usuarios
                const usersData = await api.get("/api/users?page=1&limit=100")
                const usersList = usersData.items || usersData
                setUsers(usersList)

                // Obtener usuarios ya inscritos en el programa
                const enrolledData = await api.get(`/api/programs/${programId}/users?page=1&limit=100`)
                const enrolledList = Array.isArray(enrolledData) ? enrolledData : enrolledData?.items || []
                setEnrolledUserIds(enrolledList.map((u: User) => u.id))
            } catch (error) {
                console.error("Error al cargar datos:", error)
                toast({
                    title: "Error",
                    description: "Error al cargar los datos",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [token, programId])

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token || !selectedUserId) return

        try {
            setIsEnrolling(true)
            const api = new APIClient()
            api.setToken(token)
            await api.post(`/api/programs/${programId}/enroll`, {
                userId: selectedUserId,
            })
            toast({
                title: "Éxito",
                description: "Usuario inscrito correctamente",
            })
            router.push(`/admin/courses/${programId}`)
        } catch (error) {
            console.error("Error al inscribir usuario:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al inscribir usuario",
                variant: "destructive",
            })
        } finally {
            setIsEnrolling(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        )
    }

    const availableUsers = users.filter((u) => !enrolledUserIds.includes(u.id))

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                <Link
                    href={`/admin/courses/${programId}`}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Curso
                </Link>

                <h1 className="text-3xl font-bold text-foreground mb-8">Inscribir Usuario en el Programa</h1>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seleccionar Usuario</CardTitle>
                            <CardDescription>Elige un usuario para inscribirlo en este programa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleEnroll} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Usuarios Disponibles</label>
                                    <select
                                        value={selectedUserId || ""}
                                        onChange={(e) => setSelectedUserId(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-muted bg-background text-foreground rounded-md"
                                        required
                                    >
                                        <option value="">Selecciona un usuario...</option>
                                        {availableUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.full_name || user.fullName} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {availableUsers.length === 0 && (
                                    <div className="p-4 bg-muted rounded-md">
                                        <p className="text-sm text-muted-foreground">Todos los usuarios ya están inscritos en este programa.</p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={isEnrolling || !selectedUserId}>
                                        {isEnrolling ? "Inscribiendo..." : "Inscribir Usuario"}
                                    </Button>
                                    <Link href={`/admin/courses/${programId}`}>
                                        <Button variant="outline" className="bg-transparent">
                                            Cancelar
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

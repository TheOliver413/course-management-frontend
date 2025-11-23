"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../componets/ui/card"
import { Button } from "../../../../../componets/ui/button"
import { Input } from "../../../../../componets/ui/input"
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
    created_at: string
}

export default function EditUserPage() {
    const { token } = useAuth()
    const router = useRouter()
    const params = useParams()
    const userId = params.id as string
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [formData, setFormData] = useState({
        full_name: "",
        role: "",
    })

    useEffect(() => {
        if (!token) return

        const fetchUser = async () => {
            try {
                console.log("Obteniendo usuario:", userId)
                const api = new APIClient()
                api.setToken(token)
                const userData = await api.get(`/api/users/${userId}`)
                console.log("Usuario obtenido:", userData)
                setUser(userData)
                setFormData({
                    full_name: userData.full_name || userData.fullName,
                    role: userData.role,
                })
            } catch (error) {
                console.error("Error al obtener usuario:", error)
                toast({
                    title: "Error",
                    description: "Error al cargar el usuario",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [token, userId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!token) return

        try {
            setIsSaving(true)
            console.log("Actualizando usuario:", userId, formData)
            const api = new APIClient()
            api.setToken(token)
            await api.put(`/api/users/${userId}`, {
                full_name: formData.full_name,
                role: formData.role,
            })
            console.log("Usuario actualizado exitosamente")
            toast({
                title: "Éxito",
                description: "Usuario actualizado exitosamente",
            })
            router.push("/admin/users")
        } catch (error) {
            console.error("Error al actualizar usuario:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al actualizar usuario",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Usuario no encontrado</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                <Link href="/admin/users" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Usuarios
                </Link>

                <h1 className="text-3xl font-bold text-foreground mb-8">Editar Usuario</h1>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Usuario</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
                                    <Input value={user.email} disabled className="bg-muted border-muted" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Nombre Completo</label>
                                    <Input
                                        name="full_name"
                                        placeholder="Ingrese nombre completo"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="bg-background border-muted"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Rol</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-muted bg-background text-foreground rounded-md"
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? "Guardando..." : "Guardar Cambios"}
                                    </Button>
                                    <Link href="/admin/users">
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

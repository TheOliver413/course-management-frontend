"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../componets/ui/card"
import { Button } from "../../../../../componets/ui/button"
import { Input } from "../../../../../componets/ui/input"
import { Textarea } from "../../../../../componets/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { APIClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export default function CreateCoursePage() {
    const { token } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        status: "active",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!token) return

        try {
            setIsLoading(true)
            console.log("Creando curso con los datos:", formData)

            const api = new APIClient()
            api.setToken(token)

            const result = await api.post("/api/programs", {
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate,
                status: formData.status,
            })

            console.log("Curso creado exitosamente:", result)

            toast({
                title: "Éxito",
                description: "El curso fue creado correctamente",
            })

            router.push("/admin/courses")
        } catch (error) {
            console.error("Error al crear el curso:", error)

            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "No se pudo crear el curso",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                <Link href="/admin/courses" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Cursos
                </Link>

                <h1 className="text-3xl font-bold text-foreground mb-8">Crear Nuevo Curso</h1>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Curso</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Nombre del Curso</label>
                                    <Input
                                        name="name"
                                        placeholder="Ingresa el nombre del curso"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-background border-muted"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
                                    <Textarea
                                        name="description"
                                        placeholder="Ingresa la descripción del curso"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="bg-background border-muted"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Fecha de Inicio</label>
                                        <Input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="bg-background border-muted"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Estado</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-muted bg-background text-foreground rounded-md"
                                        >
                                            <option value="active">Activo</option>
                                            <option value="inactive">Inactivo</option>
                                            <option value="archived">Archivado</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Creando..." : "Crear Curso"}
                                    </Button>

                                    <Link href="/admin/courses">
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

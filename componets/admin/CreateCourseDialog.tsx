"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { APIClient } from "@/lib/api-client"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreateCourseDialogProps {
    token: string
    onSuccess: () => void
}

export function CreateCourseDialog({ token, onSuccess }: CreateCourseDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const api = new APIClient()
            api.setToken(token)
            await api.post("/api/programs", {
                name: formData.name,
                description: formData.description,
                start_date: formData.startDate,
                status: "active",
            })
            setFormData({ name: "", description: "", startDate: "" })
            setIsOpen(false)
            toast({
                title: "Éxito",
                description: "Curso creado exitosamente",
            })
            onSuccess()
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo curso
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-muted">
                <DialogHeader>
                    <DialogTitle>Crear nuevo curso</DialogTitle>
                    <DialogDescription>Agrega un nuevo curso a tu sistema de gestión de aprendizaje</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Nombre del curso</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Conceptos avanzados de React"
                            className="border-muted bg-muted/50 text-foreground"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe el contenido y los objetivos del curso"
                            className="border-muted bg-muted/50 text-foreground"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Fecha de inicio</label>
                        <Input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="border-muted bg-muted/50 text-foreground"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                        {isLoading ? "Creando..." : "Crear curso"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

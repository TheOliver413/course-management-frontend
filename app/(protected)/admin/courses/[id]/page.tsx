"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useEnrollment } from "@/hooks/useEnrollment"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../componets/ui/card"
import { Button } from "../../../../../componets/ui/button"
import { Input } from "../../../../../componets/ui/input"
import { Textarea } from "../../../../../componets/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../componets/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../../../componets/ui/alert-dialog"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { APIClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

interface Program {
    id: number
    name: string
    description: string
    start_date: string
    status: string
}

interface User {
    id: number
    email: string
    full_name: string
    fullName: string
    role: string
}

export default function EditCoursePage() {
    const { token } = useAuth()
    const router = useRouter()
    const params = useParams()
    const courseId = params.id as string

    const [program, setProgram] = useState<Program | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isRemoving, setIsRemoving] = useState<number | null>(null)
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        status: "active",
    })

    const { unenrollUserFromProgram } = useEnrollment(token)

    useEffect(() => {
        if (!token) return

        const fetchData = async () => {
            try {
                const api = new APIClient()
                api.setToken(token)

                // Obtener datos del programa
                const programData = await api.get(`/api/programs/${courseId}`)
                setProgram(programData)
                setFormData({
                    name: programData.name,
                    description: programData.description,
                    startDate: programData.start_date,
                    status: programData.status,
                })

                // Obtener usuarios inscritos
                const usersData = await api.get(`/api/programs/${courseId}/users?page=1&limit=100`)
                const usersList: User[] = Array.isArray(usersData) ? usersData : usersData?.items || []
                setUsers(usersList)
            } catch (error) {
                console.error("Error al cargar datos:", error)
                toast({
                    title: "Error",
                    description: "No se pudieron cargar los datos del curso",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [token, courseId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!token) return

        try {
            setIsSaving(true)
            const api = new APIClient()
            api.setToken(token)
            await api.put(`/api/programs/${courseId}`, {
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate,
                status: formData.status,
            })
            toast({
                title: "Éxito",
                description: "Curso actualizado correctamente",
            })
            router.push("/admin/courses")
        } catch (error) {
            console.error("Error al actualizar curso:", error)
            toast({
                title: "Error",
                description: "No se pudo actualizar el curso",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleRemoveUser = async (userId: number) => {
        if (!token) return

        try {
            setIsRemoving(userId)
            const success = await unenrollUserFromProgram(Number(courseId), userId)
            if (success) {
                setUsers(users.filter((u) => u.id !== userId))
                toast({
                    title: "Usuario removido",
                    description: "El usuario ha sido removido del curso",
                })
            }
        } catch (error) {
            console.error("Error al remover usuario:", error)
            toast({
                title: "Error",
                description: "No se pudo remover el usuario",
                variant: "destructive",
            })
        } finally {
            setIsRemoving(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        )
    }

    if (!program) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Curso no encontrado</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                <Link href="/admin/courses" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Cursos
                </Link>

                <h1 className="text-3xl font-bold text-foreground mb-8">Editar Curso</h1>

                {/* Detalles del Curso */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles del Curso</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Nombre del Curso</label>
                                        <Input
                                            name="name"
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
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? "Guardando..." : "Guardar Cambios"}
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

                    {/* Estadísticas del Programa */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Estadísticas del Curso</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total de Inscritos</p>
                                    <p className="text-2xl font-bold text-primary">{users.length}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Estado</p>
                                    <p className="text-sm font-semibold capitalize">{formData.status}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Usuarios Inscritos */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Usuarios Inscritos</CardTitle>
                            <CardDescription>Gestiona los usuarios inscritos en este curso</CardDescription>
                        </div>
                        <Link href={`/admin/courses/${courseId}/enroll`}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Inscribir Usuario
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">Aún no hay usuarios inscritos</p>
                                <Link href={`/admin/courses/${courseId}/enroll`}>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Inscribir Usuario
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead className="w-20">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.full_name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell className="capitalize">{user.role}</TableCell>
                                                <TableCell>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className={`bg-transparent ${isRemoving === user.id ? "opacity-50 cursor-not-allowed" : "text-destructive hover:text-destructive"
                                                                    }`}
                                                                disabled={isRemoving === user.id}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogTitle>Remover Usuario</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                ¿Estás seguro de que quieres remover a este usuario del curso?
                                                            </AlertDialogDescription>
                                                            <div className="flex gap-2 justify-end">
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleRemoveUser(user.id)}
                                                                    className="bg-destructive hover:bg-destructive/90"
                                                                >
                                                                    Remover
                                                                </AlertDialogAction>
                                                            </div>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

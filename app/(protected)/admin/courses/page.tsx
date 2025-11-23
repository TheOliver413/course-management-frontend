"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { APIClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../componets/ui/card"
import { Button } from "../../../../componets/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../componets/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../../componets/ui/alert-dialog"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"

interface Program {
    id: number
    name: string
    description: string
    start_date: string
    status: string
    created_at: string
}

export default function CoursesPage() {
    const { token } = useAuth()
    const [programs, setPrograms] = useState<Program[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null)

    const fetchPrograms = async (pageNum = 1) => {
        if (!token) return

        try {
            setIsLoading(true)
            const api = new APIClient()
            api.setToken(token)
            const data = await api.get(`/api/programs?page=${pageNum}&limit=10`)
            console.log("Programas obtenidos:", data)
            setPrograms(data.items)
            setTotal(data.total)
            setPage(pageNum)
        } catch (error) {
            console.error("Error al obtener los programas:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPrograms()
    }, [token])

    const handleDelete = async (id: number) => {
        if (!token) return

        try {
            setDeleteLoadingId(id)
            const api = new APIClient()
            api.setToken(token)
            await api.delete(`/api/programs/${id}`)
            console.log("Curso eliminado exitosamente")
            fetchPrograms(page)
        } catch (error) {
            console.error("Error al eliminar el curso:", error)
        } finally {
            setDeleteLoadingId(null)
        }
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Administrar Cursos</h1>
                        <p className="text-muted-foreground mt-2">Crea y gestiona tus cursos</p>
                    </div>
                    <Link href="/admin/courses/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Nuevo Curso
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Todos los Cursos</CardTitle>
                                <CardDescription>Total: {total} cursos</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Cargando cursos...</p>
                            </div>
                        ) : programs.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-6">No se encontraron cursos. Crea uno para comenzar.</p>
                                <Link href="/admin/courses/new">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear Nuevo Curso
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Descripción</TableHead>
                                            <TableHead>Fecha de Inicio</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {programs.map((program) => (
                                            <TableRow key={program.id}>
                                                <TableCell className="font-medium">{program.name}</TableCell>
                                                <TableCell className="max-w-xs truncate">{program.description}</TableCell>
                                                <TableCell>{new Date(program.start_date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${program.status === "active"
                                                            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                                                            : "bg-muted text-muted-foreground"
                                                            }`}
                                                    >
                                                        {program.status === "active" ? "Activo" : program.status === "inactive" ? "Inactivo" : "Archivado"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/courses/${program.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-destructive hover:text-destructive bg-transparent"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogTitle>Eliminar Curso</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    ¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.
                                                                </AlertDialogDescription>
                                                                <div className="flex gap-2 justify-end">
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => {
                                                                            console.log("Botón de eliminar presionado para el curso:", program.id)
                                                                            handleDelete(program.id)
                                                                        }}
                                                                        disabled={deleteLoadingId === program.id}
                                                                        className="bg-destructive hover:bg-destructive/90"
                                                                    >
                                                                        {deleteLoadingId === program.id ? "Eliminando..." : "Eliminar"}
                                                                    </AlertDialogAction>
                                                                </div>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
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

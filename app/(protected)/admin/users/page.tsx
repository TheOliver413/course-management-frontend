"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { APIClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../componets/ui/card"
import { Button } from "../../../../componets/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../componets/ui/table"
import { Badge } from "../../../../componets/ui/badge"
import { Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
    id: number
    email: string
    full_name: string
    fullName: string
    role: string
    created_at: string
}

export default function UsersPage() {
    const { token } = useAuth()
    const { toast } = useToast()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editData, setEditData] = useState({ full_name: "", role: "" })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (!token) return

        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const api = new APIClient()
                api.setToken(token)
                const data = await api.get("/api/users?page=1&limit=10")
                console.log("Usuarios obtenidos:", data)
                setUsers(data.items)
                setTotal(data.total)
            } catch (error) {
                console.error("Error al cargar usuarios:", error)
                toast({
                    title: "Error",
                    description: "Error al cargar los usuarios",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [token])

    const handleEditOpen = (user: User) => {
        setEditingId(user.id)
        setEditData({ full_name: user.full_name || user.fullName, role: user.role })
    }

    const handleEditCancel = () => {
        setEditingId(null)
        setEditData({ full_name: "", role: "" })
    }

    const handleSaveEdit = async (userId: number) => {
        if (!token) return

        try {
            setIsSaving(true)
            const api = new APIClient()
            api.setToken(token)
            await api.put(`/api/users/${userId}`, {
                full_name: editData.full_name,
                role: editData.role,
            })
            setUsers(users.map((u) => (u.id === userId ? { ...u, full_name: editData.full_name, role: editData.role } : u)))
            setEditingId(null)
            toast({
                title: "Éxito",
                description: "Usuario actualizado correctamente",
            })
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

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground">Administrar Usuarios</h1>
                    <p className="text-muted-foreground mt-2">Ver y gestionar los usuarios del sistema</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Todos los Usuarios</CardTitle>
                        <CardDescription>Total: {total} usuarios</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Cargando usuarios...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No se encontraron usuarios.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Correo</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead>Fecha de Registro</TableHead>
                                            <TableHead className="w-20">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.full_name || user.fullName}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                                                </TableCell>
                                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Button size="sm" variant="outline" onClick={() => handleEditOpen(user)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
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

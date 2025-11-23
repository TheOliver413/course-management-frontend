"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { APIClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../componets/ui/card"
import { Button } from "../../../componets/ui/button"
import { BookOpen, Users, Calendar } from "lucide-react"
import Link from "next/link"

interface Program {
    id: number
    name: string
    description: string
    start_date: string
    status: string
}

export default function DashboardPage() {
    const { user, token } = useAuth()
    const [programs, setPrograms] = useState<Program[]>([])
    const [stats, setStats] = useState({ totalCourses: 0, totalUsers: 0, activeCourses: 0 })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) return

        const fetchData = async () => {
            try {
                const api = new APIClient()
                api.setToken(token)

                if (user?.role === "admin") {
                    try {
                        const coursesData = await api.get("/api/programs?page=1&limit=100")
                        const usersData = await api.get("/api/users?page=1&limit=100")

                        const coursesList = coursesData.items || []
                        const usersList = usersData.items || []
                        const activeCourses = coursesList.filter((p: Program) => p.status === "active").length

                        setStats({
                            totalCourses: coursesList.length,
                            totalUsers: usersList.length,
                            activeCourses: activeCourses,
                        })
                    } catch (error) {
                        console.error("Error al obtener estadísticas de admin:", error)
                    }
                }

                // Cursos del usuario
                const userPrograms = await api.get("/api/users/programs/me")
                setPrograms(userPrograms || [])
            } catch (error) {
                console.error("Error al cargar programas:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [token, user?.role])

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground">Panel de Control</h1>
                    <p className="text-muted-foreground mt-2">¡Bienvenido, {user?.fullName}!</p>
                </div>

                {user?.role === "admin" && (
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/admin/courses" className="block">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                        Administrar Cursos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-primary">{stats.totalCourses}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Cursos</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/users" className="block">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        Administrar Usuarios
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Usuarios</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/courses" className="block">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        Cursos Activos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-primary">{stats.activeCourses}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Disponibles</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Tus Cursos</h2>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Cargando tus cursos...</p>
                        </div>
                    ) : programs.length === 0 ? (
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center">
                                <p className="text-muted-foreground mb-6">Aún no estás inscrito en ningún curso.</p>
                                {user?.role !== "admin" && (
                                    <Link href="/courses">
                                        <Button size="lg">Explorar Cursos Disponibles</Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {programs.map((program) => (
                                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2">{program.name}</CardTitle>
                                        <CardDescription className="line-clamp-2">{program.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-xs text-muted-foreground">
                                            Fecha de Inicio: {new Date(program.start_date).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${program.status === "active"
                                                        ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                                                        : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {program.status === "active" ? "Activo" : program.status}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

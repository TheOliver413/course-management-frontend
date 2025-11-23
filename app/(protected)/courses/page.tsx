"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { APIClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../componets/ui/card"
import { Button } from "../../../componets/ui/button"
import { Input } from "../../../componets/ui/input"
import { Calendar, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "../../../componets/ui/alert"

interface Program {
    id: number
    name: string
    description: string
    start_date: string
    status: string
}

export default function CoursesPage() {
    const { token, user } = useAuth()
    const [programs, setPrograms] = useState<Program[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState<number[]>([])
    const [enrollingId, setEnrollingId] = useState<number | null>(null)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (!token) return

        const fetchData = async () => {
            try {
                setIsLoading(true)
                const api = new APIClient()
                api.setToken(token)

                const programsData = await api.get("/api/programs?page=1&limit=100")
                setPrograms(programsData.items)

                const enrolledData = await api.get("/api/users/programs/me")
                setEnrolledCourses(enrolledData.map((p: Program) => p.id))
            } catch (error) {
                console.error("No se pudieron obtener los datos:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [token])

    const handleEnroll = async (programId: number) => {
        if (!token) return

        try {
            setEnrollingId(programId)
            const api = new APIClient()
            api.setToken(token)
            await api.post(`/api/programs/${programId}/enroll`, { userId: user?.id })
            setEnrolledCourses([...enrolledCourses, programId])
            setMessage({ type: "success", text: "¡Inscrito exitosamente en el curso!" })
            setTimeout(() => setMessage(null), 3000)
        } catch (error) {
            setMessage({ type: "error", text: "No se pudo registrar. Inténtalo de nuevo." })
        } finally {
            setEnrollingId(null)
        }
    }

    const filteredPrograms = programs.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground">Explorar cursos</h1>
                    <p className="text-muted-foreground mt-2">Descubre e inscríbete en los cursos disponibles</p>
                </div>

                {message && (
                    <Alert
                        className={`mb-6 ${message.type === "success"
                            ? "border-green-600 bg-green-50 dark:bg-green-500/10"
                            : "border-destructive bg-destructive/5"
                            }`}
                    >
                        <AlertDescription
                            className={message.type === "success" ? "text-green-800 dark:text-green-400" : "text-destructive"}
                        >
                            {message.text}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="mb-6">
                    <Input
                        placeholder="Buscar cursos por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Cargando cursos...</p>
                    </div>
                ) : filteredPrograms.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {searchTerm ? "No hay cursos que coincidan con tu búsqueda." : "No hay cursos disponibles."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPrograms.map((program) => (
                            <Card key={program.id} className="flex flex-col hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <CardTitle className="line-clamp-2">{program.name}</CardTitle>
                                            <CardDescription className="line-clamp-3 mt-2">{program.description}</CardDescription>
                                        </div>
                                        {enrolledCourses.includes(program.id) && (
                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(program.start_date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${program.status === "active"
                                                    ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                                                    : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {program.status}
                                            </span>
                                        </div>
                                    </div>
                                    {enrolledCourses.includes(program.id) ? (
                                        <Button disabled variant="outline" className="w-full bg-transparent">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Inscrito
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleEnroll(program.id)}
                                            disabled={enrollingId === program.id}
                                            className="w-full"
                                        >
                                            {enrollingId === program.id ? "Enrolling..." : "Enroll Now"}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

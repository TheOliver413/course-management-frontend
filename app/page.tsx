import Link from "next/link"
import { Button } from "../componets/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "../componets/ui/card"
import { BookOpen, Users, GraduationCap, BarChart } from "lucide-react"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold">Centro de cursos</h1>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link href="/auth/login">
                            <Button variant="ghost">Acceso</Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button>Empezar</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-5xl font-bold mb-6 text-balance">
                    Gestión de cursos moderna <br />
                    <span className="text-primary">Made Simple</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                    Un potente sistema de gestión del aprendizaje diseñado para educadores y estudiantes. Gestiona cursos, monitoriza el progreso y mejora las experiencias de aprendizaje.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/auth/register">
                        <Button size="lg">Iniciar prueba gratuita</Button>
                    </Link>
                    <Link href="/auth/login">
                        <Button size="lg" variant="outline">
                            Iniciar sesión
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader>
                            <BookOpen className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Gestión de cursos</CardTitle>
                            <CardDescription>Crea, organiza y gestiona cursos con una interfaz intuitiva</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Users className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Gestión de usuarios</CardTitle>
                            <CardDescription>Gestione estudiantes, instructores y administradores de manera eficiente</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <GraduationCap className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Rutas de aprendizaje</CardTitle>
                            <CardDescription>Diseñe experiencias de aprendizaje integrales para sus estudiantes</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <BarChart className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Analíticas</CardTitle>
                            <CardDescription>Realice un seguimiento del progreso y el rendimiento con análisis detallados</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl mb-4">¿Listo para comenzar?</CardTitle>
                        <CardDescription className="text-primary-foreground/80 text-lg mb-6">
                            Únase a miles de educadores y estudiantes que utilizan Centro de cursos
                        </CardDescription>
                        <div className="flex gap-4 justify-center">
                            <Link href="/auth/register">
                                <Button size="lg" variant="secondary">
                                    Crear una cuenta
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>
            </section>

            {/* Footer */}
            <footer className="border-t py-8 mt-20">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>&copy; 2025 Centro de cursos. Reservados todos los derechos.</p>
                </div>
            </footer>
        </div>
    )
}

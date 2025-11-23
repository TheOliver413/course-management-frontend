"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/componets/ui/button"
import { BookOpen, Users, LogOut, LayoutDashboard } from "lucide-react"
import { ThemeToggle } from "@/componets/theme-toggle"

export function Sidebar() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        logout()
        router.push("/auth/login")
    }

    const isActive = (path: string) => pathname?.includes(path)

    if (!user) {
        return (
            <div className="w-64 border-r border-border bg-card p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        Centro de cursos
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">Sistema de Gestión del Aprendizaje</p>
                </div>
                <div className="flex-1" />
                <div className="space-y-3 border-t border-border pt-4">
                    <ThemeToggle />
                </div>
            </div>
        )
    }

    return (
        <div className="w-64 border-r border-border bg-card p-6 flex flex-col h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Centro de cursos
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Sistema de Gestión del Aprendizaje</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                <Link href="/dashboard" className="block">
                    <Button
                        variant={isActive("dashboard") && !isActive("admin") ? "default" : "ghost"}
                        className="w-full justify-start text-left"
                    >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                    </Button>
                </Link>

                {user?.role === "admin" && (
                    <>
                        <Link href="/admin/courses" className="block">
                            <Button
                                variant={isActive("admin/courses") ? "default" : "ghost"}
                                className="w-full justify-start text-left"
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Administrar cursos
                            </Button>
                        </Link>

                        <Link href="/admin/users" className="block">
                            <Button
                                variant={isActive("admin/users") ? "default" : "ghost"}
                                className="w-full justify-start text-left"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Administrar usuarios
                            </Button>
                        </Link>
                    </>
                )}
            </nav>

            {/* User Info & Actions */}
            <div className="space-y-3 border-t border-border pt-4">
                <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Iniciado sesión como</p>
                    <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                    <p className="text-xs text-primary capitalize mt-1">{user?.role}</p>
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleLogout} variant="outline" className="flex-1 bg-transparent">
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    )
}

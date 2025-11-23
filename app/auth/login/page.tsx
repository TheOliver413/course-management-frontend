"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/componets/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/componets/ui/card"
import { Input } from "@/componets/ui/input"
import { Label } from "@/componets/ui/label"
import { Alert, AlertDescription } from "@/componets/ui/alert"
import { GraduationCap, AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const { login, isLoading, error: authError } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setError(null)
    }

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError("Por favor llena todos los campos")
            return false
        }
        if (!formData.email.includes("@")) {
            setError("Por favor ingresa un correo válido")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateForm()) return

        const result = await login(formData.email, formData.password)
        if (result) {
            router.push("/dashboard")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-20">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <GraduationCap className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Bienvenido de nuevo</CardTitle>
                    <CardDescription>Inicia sesión en tu cuenta de Centro de cursos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(error || authError) && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error || authError}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="tú@ejemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Iniciar sesión"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="text-sm text-center text-muted-foreground">
                        ¿No tienes una cuenta?{" "}
                        <Link href="/auth/register" className="text-primary hover:underline font-medium">
                            Regístrate
                        </Link>
                    </div>
                    <div className="text-center">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                Volver al inicio
                            </Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/componets/ui/button"
import { Input } from "@/componets/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/componets/ui/card"
import { Alert, AlertDescription } from "@/componets/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const { register, isLoading, error: authError } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setError(null)
    }

    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.fullName) {
            setError("Todos los campos son obligatorios")
            return false
        }
        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres")
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden")
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
        setError(null)

        if (!validateForm()) return

        const result = await register(formData.email, formData.password, formData.fullName)
        if (result) {
            setSuccess(true)
            setTimeout(() => router.push("/dashboard"), 2000)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-8 pt-20">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
                    <CardDescription>Regístrate para comenzar</CardDescription>
                </CardHeader>
                <CardContent>
                    {success && (
                        <Alert className="mb-4 border-green-600 bg-green-500/10">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700 dark:text-green-400">
                                ¡Cuenta creada con éxito!
                            </AlertDescription>
                        </Alert>
                    )}

                    {(error || authError) && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error || authError}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Nombre completo</label>
                            <Input
                                type="text"
                                name="fullName"
                                placeholder="Juan Pérez"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Correo electrónico</label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="tu@ejemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Contraseña</label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Confirmar contraseña</label>
                            <Input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando cuenta...
                                </>
                            ) : (
                                "Crear cuenta"
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/auth/login" className="font-medium text-primary hover:underline">
                            Inicia sesión
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

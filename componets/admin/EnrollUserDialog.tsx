"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { useEnrollment } from "@/hooks/useEnrollment"
import { useUsers } from "@/hooks/useUsers"
import { UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnrollUserDialogProps {
    programId: number
    token: string
    onSuccess: () => void
}

export function EnrollUserDialog({ programId, token, onSuccess }: EnrollUserDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const { fetchUsers, users } = useUsers(token)
    const { enrollUserInProgram, isLoading, error } = useEnrollment(token)
    const { toast } = useToast()

    useEffect(() => {
        if (isOpen) {
            fetchUsers(1, 100)
        }
    }, [isOpen, fetchUsers])

    const handleEnroll = async () => {
        if (!selectedUserId) return

        const success = await enrollUserInProgram(programId, selectedUserId)
        if (success) {
            setIsOpen(false)
            setSelectedUserId(null)
            toast({
                title: "Éxito",
                description: "Usuario inscrito correctamente",
            })
            onSuccess()
        } else if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="bg-transparent">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Inscribir usuario
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-muted">
                <DialogHeader>
                    <DialogTitle>Inscribir usuario en el programa</DialogTitle>
                    <DialogDescription>Selecciona un usuario para inscribir en este programa</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Seleccionar usuario</label>
                        <select
                            value={selectedUserId || ""}
                            onChange={(e) => setSelectedUserId(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-muted bg-muted/50 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Elige un usuario...</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.full_name || user.fullName} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button
                        onClick={handleEnroll}
                        disabled={!selectedUserId || isLoading}
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        {isLoading ? "Inscribiendo..." : "Inscribir usuario"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

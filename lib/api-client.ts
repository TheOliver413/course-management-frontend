export class APIClient {
    private baseURL: string
    private token: string | null = null

    constructor(baseURL = "https://course-management-backend.vercel.app") {
        this.baseURL = baseURL
        if (typeof window !== "undefined") {
            this.token = localStorage.getItem("auth_token")
        }
    }

    setToken(token: string) {
        this.token = token
    }

    private getHeaders() {
        return {
            "Content-Type": "application/json",
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
        }
    }

    async get(endpoint: string) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "GET",
            headers: this.getHeaders(),
        })
        return this.handleResponse(response)
    }

    async post(endpoint: string, data: any) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        })
        return this.handleResponse(response)
    }

    async put(endpoint: string, data: any) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "PUT",
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        })
        return this.handleResponse(response)
    }

    async delete(endpoint: string) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "DELETE",
            headers: this.getHeaders(),
        })
        return this.handleResponse(response)
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "API Error")
        }
        return response.json()
    }
}

"use client"

import Link from "next/link"
import { Eye, GraduationCap } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios";

export default function LoginPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")

    async function handleLogin() {
        if (email === "" || password === "" || role === "") {
            toast.error("Please fill in all fields")
            return
        }
        if (role !== "user" && role !== "admin") {
            toast.error("Invalid role selected")
            return

        } else if (role === "user") {
            toast("Loginng in as user", {
                id: "login"
            })
            await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/user/signin", {
                email,
                password,
            },{withCredentials: true})
                .then((response) => {
                    console.log(response.status)
                    if (response.status === 200) {
                        toast.success("Login successful", {
                            description: `Welcome back, ${email}!`,
                            id: "login"
                        })
                    } else {
                        toast.error("Login failed", {
                            id: "login"
                        })
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        toast.error(`Error: ${error.response.data.message}`, {
                            id: "login"
                        })
                    }
                })
        } else {
            toast("Loginng in as admin", {
                id: "adminlogin"
            })
            axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/admin/signin", {
                email,
                password,
            })
                .then((response) => {
                    if (response.status === 200) {
                        toast.success("Login successful", {
                            description: `Welcome back, ${email}!`,
                            id: "adminlogin"
                        })
                    } else {
                        toast.error("Adminlogin failed", {
                            id: "adminlogin"
                        })
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        toast.error(`Error: ${error.response.data.message}`, {
                            id: "adminlogin"
                        })
                    }
                })
        }
    }

    return (
        <div className="flex min-h-dvh flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <GraduationCap className="size-6" />
                        <span className="text-xl font-bold">LearnHub</span>
                    </Link>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-6">
                <Card className="mx-auto max-w-sm w-full">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="rahul@example.com" required onChange={(e) => (setEmail(e.target.value))} />
                            </div>
                            <div className="relative space-y-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" required onChange={(e) => (setPassword(e.target.value))} />
                                <Button variant="ghost" size="icon" className="absolute bottom-1 right-1 h-7 w-7">
                                    <Eye className="size-4" />
                                    <span className="sr-only">Toggle password visibility</span>
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <Select required onValueChange={(value => setRole(value))}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select the role!!" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Avaiable roles</SelectLabel>
                                            <SelectItem value="user">user</SelectItem>
                                            <SelectItem value="admin">admin</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full" onClick={handleLogin}>
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <footer className="w-full border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="size-6" />
                        <p className="text-sm text-muted-foreground">© 2024 LearnHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

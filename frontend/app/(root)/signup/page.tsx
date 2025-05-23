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
import axios from "axios"
import { redirect } from "next/navigation"

export default function SignupPage() {

    const [firstName, setFiratName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")

    async function handleSignup() {
        if (firstName === "" || lastName === "" || email === "" || password === "" || role === "") {
            toast.error("Please fill in all fields")
            return
        }
        if (role !== "user" && role !== "admin") {
            toast.error("Invalid role selected")
            return
        } else if (role === "user") {
            toast.loading("Creating account BuckleUp!", {
                id: "usersignup"
            })
            await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/user/signup", {
                firstName,
                lastName,
                email,
                password,
            })
                .then((res) => {
                    if (res.status === 201) {
                        toast.success("Account created successfully", {
                            description: `Welcome aboard, ${firstName}!`,
                            id: "usersignup"
                        })
                        redirect("/login");
                    } else {
                        toast.error("Account creation failed", {
                            id: "usersignup"
                        })
                    }
                })
        } else if (role === "admin") {
            toast("Creating account BuckleUp", {
                id: "adminsignup"
            })
            await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/admin/signup", {
                firstName,
                lastName,
                email,
                password,
            })
                .then((res) => {
                    if (res.status === 201) {
                        toast.success("Account created successfully", {
                            description: `Welcome aboard, ${firstName}!`,
                            id: "adminsignup"
                        })
                        redirect("/login");
                    } else {
                        toast.error("Account creation failed", {
                            id: "adminsignup"
                        })
                    }
                })
        }
    }
    return (
        <div className="flex min-h-dvh flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <GraduationCap className="size-6" />
                        <span className="text-xl font-bold">LearnHub</span>
                    </Link>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-6">
                <Card className="mx-auto max-w-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                        <CardDescription>Create an account to start learning</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" required onChange={(e) => (setFiratName(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" required onChange={(e) => (setLastName(e.target.value))} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="kavita@example.com" required onChange={(e) => (setEmail(e.target.value))} />
                            </div>
                            <div className="relative space-y-2">
                                <Label htmlFor="password">Password</Label>
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
                            <Button type="submit" className="w-full" onClick={handleSignup}>
                                Create Account
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline">
                                Log in
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

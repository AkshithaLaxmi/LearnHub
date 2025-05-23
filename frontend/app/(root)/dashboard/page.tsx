"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, BookOpen, GraduationCap, Home, LogOut, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState("")

    // Filter courses based on search query
    const filteredCourses = courses.filter(
        (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <SidebarProvider>
            <div className="flex min-h-dvh w-full">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2 px-4 py-2">
                            <GraduationCap className="size-6" />
                            <span className="text-xl font-bold">LearnHub</span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive>
                                    <Link href="/dashboard">
                                        <Home className="size-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/my-courses">
                                        <BookOpen className="size-4" />
                                        <span>My Courses</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/profile">
                                        <User className="size-4" />
                                        <span>Profile</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/settings">
                                        <Settings className="size-4" />
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/logout">
                                        <LogOut className="size-4" />
                                        <span>Logout</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <div className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
                        <SidebarTrigger />
                        <div className="flex flex-1 items-center gap-4">
                            <form className="flex-1 md:max-w-sm lg:max-w-lg">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search courses..."
                                        className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </form>
                            <Button variant="outline" size="icon" className="ml-auto">
                                <Bell className="size-4" />
                                <span className="sr-only">Notifications</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <img
                                    src="/placeholder.svg?height=32&width=32"
                                    width="32"
                                    height="32"
                                    className="rounded-full"
                                    alt="User avatar"
                                />
                                <span className="sr-only">User menu</span>
                            </Button>
                        </div>
                    </header>
                    <main className="flex-1 p-6">
                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Welcome back, John!</h1>
                                <p className="text-muted-foreground">
                                    Continue learning or explore new courses to enhance your skills.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-4">My Learning</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {enrolledCourses.map((course) => (
                                            <Card key={course.id} className="overflow-hidden">
                                                <div className="aspect-video w-full overflow-hidden">
                                                    <img
                                                        src={course.image || "/placeholder.svg"}
                                                        alt={course.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <CardHeader className="p-4">
                                                    <CardTitle>{course.title}</CardTitle>
                                                    <CardDescription>Progress: {course.progress}%</CardDescription>
                                                </CardHeader>
                                                <CardFooter className="p-4 pt-0">
                                                    <Button asChild className="w-full">
                                                        <Link href={`/dashboard/course/${course.id}`}>Continue Learning</Link>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-4">Available Courses</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredCourses.map((course) => (
                                            <Card key={course.id} className="overflow-hidden">
                                                <div className="aspect-video w-full overflow-hidden">
                                                    <img
                                                        src={course.image || "/placeholder.svg"}
                                                        alt={course.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <CardHeader className="p-4">
                                                    <CardTitle>{course.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <p className="font-bold">${course.price}</p>
                                                </CardContent>
                                                <CardFooter className="p-4 pt-0">
                                                    <Button asChild className="w-full">
                                                        <Link href={`/dashboard/course/${course.id}`}>Enroll Now</Link>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

// Sample data
const enrolledCourses = [
    {
        id: 1,
        title: "Web Development Bootcamp",
        progress: 65,
        image: "/placeholder.svg?height=200&width=350",
    },
    {
        id: 2,
        title: "Data Science Fundamentals",
        progress: 30,
        image: "/placeholder.svg?height=200&width=350",
    },
]

const courses = [
    {
        id: 3,
        title: "UX/UI Design Masterclass",
        description: "Create stunning user interfaces and improve user experience with modern design principles.",
        price: 79.99,
        image: "/placeholder.svg?height=200&width=350",
    },
    {
        id: 4,
        title: "Mobile App Development",
        description: "Learn to build native mobile applications for iOS and Android using React Native.",
        price: 89.99,
        image: "/placeholder.svg?height=200&width=350",
    },
    {
        id: 5,
        title: "Digital Marketing Essentials",
        description: "Master SEO, social media marketing, email campaigns, and content strategy.",
        price: 69.99,
        image: "/placeholder.svg?height=200&width=350",
    },
    {
        id: 6,
        title: "Python for Data Analysis",
        description: "Use Python libraries like Pandas, NumPy, and Matplotlib for data analysis and visualization.",
        price: 74.99,
        image: "/placeholder.svg?height=200&width=350",
    },
]

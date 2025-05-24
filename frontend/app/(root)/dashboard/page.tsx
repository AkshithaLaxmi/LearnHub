/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { GraduationCap, Home, Loader2, LogOut, Search } from "lucide-react"
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
import { useAuth } from "@/lib/authContext"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import axios from "axios"
import { toast } from "sonner"
import Logo from "@/components/logo"
import { CreateCourse } from "@/components/createCourse"
import { CourseType } from "@/index"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import ProfileBtn from "@/components/profile"

export default function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { user, loading } = useAuth();
    const [courses, setCourses] = useState<CourseType[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<CourseType[]>([]);
    const [publishedCourses, setPublishedCourses] = useState<CourseType[]>([]);

    const handleLogout = async () => {
        await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/logout", {}, { withCredentials: true });
        toast.success("Logout successful", {
            description: `See you soon, ${user?.firstName}!`,
        })
        window.location.reload();
    }

    if (!loading && !user) {
        redirect("/login");
    }

    useEffect(() => {
        async function fetchData() {
            if (!loading) {
                try {
                    const [coursesRes, enrolledRes] = await Promise.all([
                        axios.get(process.env.NEXT_PUBLIC_API_URL + "/api/v1/course/preview", { withCredentials: true }),
                        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/purchased`, { withCredentials: true })
                    ]);

                    const allCourses: CourseType[] = coursesRes.data?.courses || [];
                    const enrolledIds: string[] = enrolledRes.data?.purchases.map((e: { courseId: string }) => e.courseId);

                    const enrolled: CourseType[] = allCourses.filter(course => enrolledIds.includes(course._id));
                    const remaining: CourseType[] = allCourses.filter(course => !enrolledIds.includes(course._id));

                    setCourses(remaining);
                    setEnrolledCourses(enrolled);

                    toast.success("Courses fetched successfully", {
                        id: "fetch-courses",
                    });
                } catch (err) {
                    toast.error("Failed to fetch courses or enrolled courses.", {
                        id: "fetch-courses",
                    });
                }
            }
        }

        async function publisedCourses() {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/launched`, { withCredentials: true });
                if (res.status === 200) {
                    setPublishedCourses(res.data?.courses || []);
                }
            } catch (err) {
                toast.error("Failed to fetch published courses", {
                    id: "fetch-published-courses",
                });
            }
        }
        publisedCourses();
        fetchData();
    }, [loading]);

    const handleEnrollCourse = async (courseId: string) => {
        toast.loading("Enrolling in course...", {
            id: "enroll-course",
        });
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/purchase`,
                { userId: user?._id, courseId },
                { withCredentials: true },
            );
            if (res.status === 201) {
                toast.success("Enrolled in course successfully", {
                    id: "enroll-course",
                });
                window.location.reload();
            }
        } catch (err) {
            console.error("Error enrolling in course:", err);
            toast.error("Failed to enroll in course", {
                id: "enroll-course",
            });
        }
    }

    const filteredCourses = courses.filter(
        (course: CourseType) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="mr-2 size-6 animate-spin" />
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        )
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-dvh w-full">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2 px-4 py-2">
                            <GraduationCap className="size-9" />
                            <Logo />
                        </div>
                    </SidebarHeader>
                    <SidebarContent className="px-6">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive>
                                    <Link href="/dashboard">
                                        <Home className="size-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {/* <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/profile">
                                        <User className="size-4" />
                                        <span>Profile</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem> */}
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Button className="min-w-full hover:bg-black hover:text-white" onClick={handleLogout}>
                                        <LogOut className="size-4" /> Logout
                                    </Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <div className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
                        <SidebarTrigger />
                        <div className="flex flex-1 items-center justify-between gap-4">
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
                            <div className="flex gap-3 items-center">
                                {user?.role === "admin" && (
                                    <CreateCourse />
                                )}
                                <ProfileBtn firstName={user?.firstName ?? ''} lastName={user?.lastName ?? ''} email={user?.email ?? ''} avatar={
                                    <Avatar className="size-10 cursor-pointer border">
                                        <AvatarFallback>{user?.firstName[0]}</AvatarFallback>
                                    </Avatar>
                                } />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-6">
                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
                                <p className="text-muted-foreground">
                                    {user?.role === "admin" ? "Manage your courses and users here." : "Continue learning or explore new courses to enhance your skills."}
                                </p>
                            </div>
                            <Separator />
                            <div className="">
                                {user?.role === "user" && (
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight mb-4">My Learning</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {enrolledCourses.length !== 0 && (
                                                enrolledCourses.map((course) => (
                                                    <Card key={course._id} className="overflow-hidden pt-0 flex flex-col justify-between h-full">
                                                        <div className="aspect-video w-full overflow-hidden">
                                                            <Image
                                                                src={course.image || "/placeholder.svg"}
                                                                alt={course.title}
                                                                className="object-cover w-full h-full"
                                                                width={350}
                                                                height={200}
                                                            />
                                                        </div>
                                                        <CardHeader className="px-4">
                                                            <CardTitle>{course.title}</CardTitle>
                                                        </CardHeader>
                                                        <CardFooter className="px-4 pt-0">
                                                            <Button asChild className="w-full">
                                                                <Link href={`/dashboard/course/${course._id}`}>Continue Learning</Link>
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                        {enrolledCourses.length === 0 && (
                                            <div className="text-center text-muted-foreground">
                                                <p>You haven&apos;t enrolled in any courses yet.</p>
                                                <p>Explore available courses to start learning!</p>
                                            </div>
                                        )}
                                        <Separator className="my-6" />
                                        <h2 className="text-2xl font-bold tracking-tight mb-4">Available Courses</h2>
                                        {filteredCourses.length !== 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {filteredCourses.map((course: CourseType) => (
                                                    <Card key={course._id} className="overflow-hidden py-0 flex flex-col justify-between h-full">
                                                        <div className="aspect-video w-full overflow-hidden">
                                                            <Image
                                                                src={course.image || "/placeholder.svg"}
                                                                alt={course.title}
                                                                className="object-cover w-full h-full"
                                                                width={350}
                                                                height={200}
                                                            />
                                                        </div>
                                                        <CardHeader className="px-4">
                                                            <CardTitle>{course.title}</CardTitle>
                                                            <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="px-4 pt-0">
                                                            <p className="font-bold">₹{course.price}</p>
                                                        </CardContent>
                                                        <CardFooter className="px-4 pb-4">
                                                            <Button className="w-full" onClick={() => handleEnrollCourse(course._id)}>
                                                                Enroll Now
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                        {filteredCourses.length === 0 && (
                                            <div className="text-center text-muted-foreground">
                                                <p>No courses found matching your search.</p>
                                                <p>Try a different search term or check back later!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {user?.role === "admin" && (
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">Published Courses</h2>
                                        <p className="text-muted-foreground mb-4">
                                            As an admin, you can create and watch list of published courses.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {publishedCourses.length !== 0 && (
                                                publishedCourses.map((course) => (
                                                    <Card key={course._id} className="overflow-hidden pt-0 flex flex-col justify-between h-full">
                                                        <div className="aspect-video w-full overflow-hidden">
                                                            <Image
                                                                src={course.image || "/placeholder.svg"}
                                                                alt={course.title}
                                                                className="object-cover w-full h-full"
                                                                width={350}
                                                                height={200}
                                                            />
                                                        </div>
                                                        <CardHeader className="px-4">
                                                            <CardTitle>{course.title}</CardTitle>
                                                        </CardHeader>
                                                        <CardFooter className="px-4 pt-0">
                                                            <Button asChild className="w-full">
                                                                <Link href={`/dashboard/course/${course._id}`}>Launced successfully! 🎉</Link>
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                        {publishedCourses.length === 0 && (
                                            <div className="text-center text-muted-foreground">
                                                <p>You haven&apos;t enrolled in any courses yet.</p>
                                                <p>Explore available courses to start learning!</p>
                                            </div>
                                        )}
                                    </div>

                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

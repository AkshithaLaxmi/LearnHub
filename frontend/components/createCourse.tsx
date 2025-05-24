import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useAuth } from "@/lib/authContext"
import { toast } from "sonner"
import axios from "axios"

export function CreateCourse() {
    const { user } = useAuth()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [imageUrl, setImage] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async () => {
        console.log({
            title,
            description,
            price,
            imageUrl
        })
        if (!user) {
            toast.error("You must be logged in to create a course.")
            return;
        }
        if (title === "" || description === "" || price === "" || imageUrl === "") {
            toast.error("Please fill in all fields")
            return
        }
        toast.loading("Creating course...", {
            id: "create-course"
        })
        try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/admin/course", {
                title,
                description,
                price,
                imageUrl
            }, { withCredentials: true })
                .then((res) => {
                    if (res.status === 201) {
                        toast.success("Course created successfully", {
                            id: "create-course"
                        })
                        setTitle("")
                        setDescription("")
                        setPrice("")
                        setImage("")
                        setIsOpen(false)
                        window.location.reload()
                    } else {
                        toast.error("Course creation failed", {
                            id: "create-course"
                        })
                    }
                })
                .catch((err) => {
                    toast.error("Course creation failed", {
                        description: err.response.data.message,
                        id: "create-course"
                    })
                })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error("Course creation failed", {
                description: error.response.data.message,
                id: "create-course"
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><Plus /><span className="hidden md:flex">Create Course</span></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create a new course</DialogTitle>
                    <DialogDescription>
                        Fill in the course details and click create.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Fullstack Bootcamp"
                            className="col-span-3"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input
                            id="description"
                            placeholder="Brief summary"
                            className="col-span-3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="e.g. 499"
                            className="col-span-3"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">Image URL</Label>
                        <Input
                            id="image"
                            placeholder="https://..."
                            className="col-span-3"
                            value={imageUrl}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full"><Plus />Create Course</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
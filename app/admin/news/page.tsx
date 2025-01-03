"use client"

import React, { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface INews {
  _id: string
  title: string
  description: string
  img: string
  author: string
  date: string
}

export default function NewsPage() {
  const [news, setNews] = useState<INews[]>([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<INews | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    author: "",
    image: null as File | null,
  })
  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    author: "",
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState("")
  const [addImagePreview, setAddImagePreview] = useState("")

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      const data = await response.json()
      setNews(data.news)
    } catch {
      toast.error("Failed to fetch news")
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success) {
        await fetchNews()
        toast.success("News deleted successfully")
      } else {
        toast.error(data.message || "Failed to delete news")
      }
    } catch {
      toast.error("Error deleting news")
    }
  }

  const handleEdit = (newsItem: INews) => {
    setSelectedNews(newsItem)
    setEditForm({
      title: newsItem.title,
      description: newsItem.description,
      author: newsItem.author,
      image: null,
    })
    setImagePreview(newsItem.img)
    setIsEditOpen(true)
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isAdd: boolean = false
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      if (isAdd) {
        setAddForm({ ...addForm, image: file })
        setAddImagePreview(URL.createObjectURL(file))
      } else {
        setEditForm({ ...editForm, image: file })
        setImagePreview(URL.createObjectURL(file))
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNews || isSubmitting) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("title", editForm.title)
    formData.append("description", editForm.description)
    formData.append("author", editForm.author)
    if (editForm.image) {
      formData.append("image", editForm.image)
    }

    try {
      const response = await fetch(`/api/news/${selectedNews._id}`, {
        method: "PATCH",
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        toast.success("News updated successfully")
        setIsEditOpen(false)
        await fetchNews()
      } else {
        toast.error("Failed to update news")
      }
    } catch {
      toast.error("Error updating news")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!addForm.image) {
      toast.error("Please select an image")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("title", addForm.title)
    formData.append("description", addForm.description)
    formData.append("author", addForm.author)
    formData.append("image", addForm.image)

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        toast.success("News added successfully")
        setIsAddOpen(false)
        setAddForm({
          title: "",
          description: "",
          author: "",
          image: null,
        })
        setAddImagePreview("")
        await fetchNews()
      } else {
        toast.error("Failed to add news")
      }
    } catch {
      toast.error("Error adding news")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`container mx-auto py-8 px-4 ${
        isEditOpen || isAddOpen ? "blur-sm" : ""
      } transition-all duration-200`}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">News Dashboard</h1>
        <Button className="bg-blue-500 hover:bg-blue-500" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2 " />
          Add News
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div className="relative w-24 h-16">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="hidden md:table-cell max-w-md">
                  {item.description.substring(0, 100)}...
                </TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete News</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this news article?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit News Sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit News</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleUpdate} className="space-y-6 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="min-h-32"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Input
                value={editForm.author}
                onChange={(e) =>
                  setEditForm({ ...editForm, author: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
              />
              {imagePreview && (
                <div className="relative w-full h-48 mt-2">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update News
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Add News Sheet */}
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add News</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleAdd} className="space-y-6 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={addForm.title}
                onChange={(e) =>
                  setAddForm({ ...addForm, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={addForm.description}
                onChange={(e) =>
                  setAddForm({ ...addForm, description: e.target.value })
                }
                className="min-h-32"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Input
                value={addForm.author}
                onChange={(e) =>
                  setAddForm({ ...addForm, author: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, true)}
                required
              />
              {addImagePreview && (
                <div className="relative w-full h-48 mt-2">
                  <Image
                    src={addImagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add News
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}

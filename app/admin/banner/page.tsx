"use client"

import React, { useState, useEffect } from "react"
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react"
import { useRef } from "react"
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
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface Banner {
  _id: string
  image: string
  link?: string
  createdAt: string
}

const BannerDashboard = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addImagePreview, setAddImagePreview] = useState<string>("")
  const [editImagePreview, setEditImagePreview] = useState<string>("")
  const addFormRef = useRef<HTMLFormElement>(null)
  const editFormRef = useRef<HTMLFormElement>(null)

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banner")
      const data = await response.json()
      if (data.success) {
        setBanners(data.banner)
      }
    } catch {
      toast("Failed to fetch banners")
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleImagePreview = (
    file: File,
    setPreview: (url: string) => void
  ) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAdd = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/banner", {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        setBanners((prev) => [...prev, data.banner])
        setShowAddForm(false)
        setAddImagePreview("")
        if (addFormRef.current) addFormRef.current.reset()
        toast("Banner added successfully")
      }
    } catch {
      toast("Failed to add banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (id: string, formData: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/banner/${id}`, {
        method: "PATCH",
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        setBanners((prev) =>
          prev.map((banner) =>
            banner._id === id ? { ...banner, ...data.banner } : banner
          )
        )
        setShowEditForm(false)
        setSelectedBanner(null)
        setEditImagePreview("")
        if (editFormRef.current) editFormRef.current.reset()
        toast("Banner updated successfully")
      }
    } catch {
      toast("Failed to update banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/banner/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setBanners((prev) => prev.filter((banner) => banner._id !== id))
        toast("Banner deleted successfully")
      }
    } catch {
      toast("Failed to delete banner")
    }
  }

  const TableSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
      ))}
    </div>
  )

  return (
    <div
      className={`container mx-auto py-8 px-4 ${
        showAddForm || showEditForm ? "blur-sm" : ""
      } transition-all duration-200`}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Banner Dashboard</h1>
        <Button
          className="bg-blue-500 hover:bg-blue-500 "
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">Image</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPageLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <TableSkeleton />
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell>
                    <div className="relative w-24 h-16">
                      <Image
                        src={banner.image}
                        alt="Banner"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {banner.link || "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(banner.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedBanner(banner)
                        setShowEditForm(true)
                      }}
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
                          <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this banner? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(banner._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Banner Sheet */}
      <Sheet open={showAddForm} onOpenChange={setShowAddForm}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Banner</SheetTitle>
          </SheetHeader>
          <form
            ref={addFormRef}
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleAdd(formData)
            }}
            className="space-y-6 mt-8"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Image</label>
              {addImagePreview && (
                <div className="relative w-full h-48">
                  <Image
                    src={addImagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImagePreview(file, setAddImagePreview)
                  }}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p>Click to upload image</p>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link</label>
              <input
                title="Link title"
                type="text"
                name="link"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Banner
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Edit Banner Sheet */}
      <Sheet open={showEditForm} onOpenChange={setShowEditForm}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Banner</SheetTitle>
          </SheetHeader>
          <form
            ref={editFormRef}
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              if (selectedBanner) handleEdit(selectedBanner._id, formData)
            }}
            className="space-y-6 mt-8"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Image</label>
              {(editImagePreview || selectedBanner?.image) && (
                <div className="relative w-full h-48">
                  <Image
                    src={editImagePreview || selectedBanner?.image || ""}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="hidden"
                  id="image-edit"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImagePreview(file, setEditImagePreview)
                  }}
                />
                <label htmlFor="image-edit" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p>Click to upload new image</p>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link</label>
              <input
                type="text"
                name="link"
                defaultValue={selectedBanner?.link || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Banner
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default BannerDashboard

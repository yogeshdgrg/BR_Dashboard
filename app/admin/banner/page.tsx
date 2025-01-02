"use client"

import React, { useState, useEffect } from "react"
import { X, Edit2, Trash2, Plus, Upload } from "lucide-react"
import { useRef } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null)
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
      toast("Failed to fetch banners", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      })
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
        toast("Banner added successfully", {
          style: {
            backgroundColor: "black",
            color: "white",
          },
        })
      }
    } catch {
      toast("Failed to add banner", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      })
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
        toast("Banner updated successfully", {
          style: {
            backgroundColor: "black",
            color: "white",
          },
        })
      }
    } catch {
      toast("Failed to update banner", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      })
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
        toast("Banner deleted successfully", {
          style: {
            backgroundColor: "black",
            color: "white",
          },
        })
      }
    } catch {
      toast("Failed to delete banner", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      })
    }
    setShowDeleteDialog(false)
    setBannerToDelete(null)
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
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>Banner Management</CardTitle>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Banner
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isPageLoading ? (
              <TableSkeleton />
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Link</th>
                    <th className="p-2 text-left">Created At</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner._id} className="border-t">
                      <td className="p-2">
                        <Image
                          height={120}
                          width={100}
                          src={banner.image}
                          alt="Banner"
                          className="w-24 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-2">{banner.link || "-"}</td>
                      <td className="p-2">
                        {new Date(banner.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBanner(banner)
                              setShowEditForm(true)
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setBannerToDelete(banner)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              banner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false)
                setBannerToDelete(null)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => bannerToDelete && handleDelete(bannerToDelete._id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Banner Slide-in Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-lg transform transition-transform duration-300 translate-x-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Banner</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form
              ref={addFormRef}
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                handleAdd(formData)
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Banner Image</label>
                  {addImagePreview && (
                    <Image
                      src={addImagePreview}
                      alt="Preview"
                      width={400}
                      height={200}
                      className="mb-4 w-full h-32 object-cover rounded"
                    />
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
                <div>
                  <label className="block mb-2">Link</label>
                  <input
                    title="link title"
                    type="text"
                    name="link"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Banner"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Banner Slide-in Form */}
      {showEditForm && selectedBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-lg transform transition-transform duration-300 translate-x-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Banner</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEditForm(false)
                  setSelectedBanner(null)
                  setEditImagePreview("")
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form
              ref={editFormRef}
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                handleEdit(selectedBanner._id, formData)
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Current Image</label>
                  <Image
                    src={editImagePreview || selectedBanner.image}
                    alt="Current banner"
                    width={400}
                    height={200}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
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
                <div>
                  <label className="block mb-2">Link</label>
                  <input
                    type="text"
                    name="link"
                    defaultValue={selectedBanner.link || ""}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Banner"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannerDashboard

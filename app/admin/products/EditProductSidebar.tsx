"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Loader2, Plus, Trash } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ProductImage {
  _id: string
  image: string
}

interface Product {
  _id: string
  name: string
  description: string
  category: string
  sizes: string[]
  feature: string[]
  images: ProductImage[]
}

interface EditProductFormProps {
  isOpen: boolean
  onClose: () => void
  onProductUpdated: () => Promise<void>
  product: Product
}

export default function EditProductForm({
  isOpen,
  onClose,
  onProductUpdated,
  product: initialProduct,
}: EditProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product>(initialProduct)
  const [newSize, setNewSize] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: initialProduct.name,
    description: initialProduct.description,
    category: initialProduct.category,
  })

  useEffect(() => {
    if (isOpen) {
      setProduct(initialProduct)
      setFormData({
        name: initialProduct.name,
        description: initialProduct.description,
        category: initialProduct.category,
      })
      setImagesToDelete([])
      setAdditionalImages([])
    }
  }, [isOpen, initialProduct])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAdditionalImages((prev) => [...prev, ...files])
  }

  const handleDeleteImage = (imageId: string) => {
    setImagesToDelete((prev) => [...prev, imageId])
  }

  const handleRemoveNewImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddSize = () => {
    if (newSize && product) {
      setProduct({
        ...product,
        sizes: [...product.sizes, newSize],
      })
      setNewSize("")
    }
  }

  const handleRemoveSize = (index: number) => {
    if (product) {
      setProduct({
        ...product,
        sizes: product.sizes.filter((_, i) => i !== index),
      })
    }
  }

  const handleAddFeature = () => {
    if (newFeature && product) {
      setProduct({
        ...product,
        feature: [...product.feature, newFeature],
      })
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    if (product) {
      setProduct({
        ...product,
        feature: product.feature.filter((_, i) => i !== index),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("sizes", JSON.stringify(product?.sizes || []))
      formDataToSend.append("feature", JSON.stringify(product?.feature || []))

      if (imagesToDelete.length > 0) {
        formDataToSend.append("imagesToDelete", JSON.stringify(imagesToDelete))
      }

      additionalImages.forEach((image) => {
        formDataToSend.append("additionalImages", image)
      })

      const response = await fetch(`/api/product/${product._id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Product updated successfully")
        await onProductUpdated()
        onClose()
      } else {
        toast.error(data.message || "Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Error updating product")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Product
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sizes
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add new size"
                />
                <Button
                  type="button"
                  onClick={handleAddSize}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                  >
                    <span>{size}</span>
                    <button
                      type="button"
                      aria-label="Remove size"
                      onClick={() => handleRemoveSize(index)}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new feature"
                />
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {product.feature.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 rounded p-2"
                  >
                    <span>{feature}</span>
                    <button
                      aria-label="Remove feature"
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images
                  .filter((img) => !imagesToDelete.includes(img._id))
                  .map((img) => (
                    <div key={img._id} className="relative group">
                      <Image
                        src={img.image}
                        alt="Product"
                        width={200}
                        height={200}
                        className="rounded-lg object-cover w-full h-40"
                      />
                      <button
                        aria-label="Delete Image"
                        type="button"
                        onClick={() => handleDeleteImage(img._id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                {additionalImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="New product"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-full h-40"
                    />
                    <button
                      aria-label="Remove new image"
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

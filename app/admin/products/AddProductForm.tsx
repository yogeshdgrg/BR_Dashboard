"use client"

import { useState, FormEvent } from "react"
import { X, Upload, Loader2, ImagePlus, Trash2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface AddProductFormProps {
  isOpen: boolean
  onClose: () => void
  onProductAdded: () => void
}

interface FormData {
  name: string
  description: string
  category: string
  sizes: string[]
  feature: string[]
  images: File[]
}

interface PreviewImage {
  url: string
  file: File
  name?: string
  size?: string
}

export default function AddProductForm({
  isOpen,
  onClose,
  onProductAdded,
}: AddProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    sizes: [],
    feature: [],
    images: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([])
  const [sizeInput, setSizeInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    )

    if (files.length === 0) {
      toast.error("Please drop only image files")
      return
    }

    const newPreviewImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }))

    setPreviewImages((prev) => [...prev, ...newPreviewImages])
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])

    const newPreviewImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
    }))

    setPreviewImages((prev) => [...prev, ...newPreviewImages])
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index].url) // Clean up URL object
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }))
      setSizeInput("")
    }
  }

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        feature: [...prev.feature, featureInput.trim()],
      }))
      setFeatureInput("")
    }
  }

  const removeSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      feature: prev.feature.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Add basic fields
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("sizes", JSON.stringify(formData.sizes))
      formDataToSend.append("feature", JSON.stringify(formData.feature))

      // Add images
      previewImages.forEach(({ file }) => {
        formDataToSend.append("additionalImages", file)
      })

      const response = await fetch("/api/product", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Product added successfully")
        onProductAdded()
        onClose()

        // Reset form
        setFormData({
          name: "",
          description: "",
          category: "",
          sizes: [],
          feature: [],
          images: [],
        })
        setPreviewImages([])
      } else {
        throw new Error(data.message || "Failed to add product")
      }
    } catch (error) {
      if (error instanceof Error) {
        // This ensures error.message is accessed only if it's an instance of Error
        toast.error(error.message)
      } else {
        // Handle cases where the error might not be an instance of Error (for example, if it's a string or a custom object)
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Add New Product</h2>
          <button
            title="Close add product"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <label
                htmlFor="Name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter Name"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                placeholder="Your message"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                required
                placeholder="enter Category"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sizes
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="Enter size"
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.sizes.map((size, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
                  >
                    {size}
                    <button
                      title="Remove size"
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Features
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Enter feature"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.feature.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md"
                  >
                    {feature}
                    <button
                      title="Remove feature"
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <div className="p-4 rounded-full bg-blue-50">
                      <ImagePlus className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-blue-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image Preview Grid */}
                {previewImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Images ({previewImages.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {previewImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative group bg-gray-50 rounded-lg p-2"
                        >
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={image.url}
                              alt={`Preview ${index + 1}`}
                              width={200}
                              height={200}
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                              <button
                                title="Remove Image"
                                type="button"
                                onClick={() => removeImage(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <p className="truncate">{image.name}</p>
                            <p>{image.size} MB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting || previewImages.length === 0}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

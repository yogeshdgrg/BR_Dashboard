import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  X,
  Loader2,
  Plus,
  Trash2,
  PackageOpen,
  Type,
  FileText,
  Grid,
  Tags,
  Star,
  Image as ImageIcon,
  ListPlus,
  Save,
} from "lucide-react"
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
  isFeatured: boolean
}

interface EditProductFormProps {
  isOpen: boolean
  onClose: () => void
  onProductUpdated: () => Promise<void>
  product: Product
}

function EditProductForm({
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
    isFeatured: initialProduct.isFeatured,
  })

  useEffect(() => {
    if (isOpen) {
      setProduct(initialProduct)
      setFormData({
        name: initialProduct.name,
        description: initialProduct.description,
        category: initialProduct.category,
        isFeatured: initialProduct.isFeatured,
      })
      setImagesToDelete([])
      setAdditionalImages([])
    }
  }, [isOpen, initialProduct])

  // Click outside handler
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

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
      formDataToSend.append("isFeatured", String(formData.isFeatured))

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


  return (
    <div
      className="fixed inset-0 h-screen -top-6  flex justify-end overflow-x-hidden backdrop-blur-sm z-50 transition-opacity"
      onClick={handleOutsideClick}
    >
<div
  // onClick={(e:R) => e.stopPropagation()}
  onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}

  className={`h-full fixed top-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl transition-all duration-300 ease-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <PackageOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Product
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Type className="h-5 w-5" />
                <label className="block text-sm font-medium">Name</label>
              </div>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <FileText className="h-5 w-5" />
                <label className="block text-sm font-medium">Description</label>
              </div>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Grid className="h-5 w-5" />
                <label className="block text-sm font-medium">Category</label>
              </div>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Tags className="h-5 w-5" />
                <label className="block text-sm font-medium">Sizes</label>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add new size"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <ListPlus className="h-5 w-5" />
                <label className="block text-sm font-medium">Features</label>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new feature"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <span className="text-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <ImageIcon className="h-5 w-5" />
                <label className="block text-sm font-medium">Images</label>
              </div>
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
                        type="button"
                        onClick={() => handleDeleteImage(img._id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
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
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
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

            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Feature this product
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProductForm

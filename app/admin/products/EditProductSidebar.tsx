import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { toast } from "sonner"

const EditProductSidebar = ({ isOpen, onClose, product, onUpdate }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm()
  const [imagePreview, setImagePreview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (product) {
      // Reset form when product changes
      reset()
      // Set initial form values
      setValue("name", product.name)
      setValue("description", product.description)
      setValue("price", product.price)
      setValue("category", product.category)
      setValue("dimensions", JSON.stringify(product.dimensions))
      setValue("colors", JSON.stringify(product.colors))
      setImagePreview(product.img)
    }
  }, [product, setValue, reset])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      setValue("img", file)
    }
  }

  const handleColorImageChange = (e, colorName) => {
    const file = e.target.files[0]
    if (file) {
      setValue(`color_${colorName}`, file)
    }
  }

  const cleanupForm = () => {
    reset()
    setImagePreview("")
    onClose()
  }

  const onSubmit = async (data) => {
    if (!product?._id) {
      toast.error("Invalid product data")
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()

      // Append basic product information
      formData.append("name", data.name)
      formData.append("description", data.description)
      formData.append("price", data.price)
      formData.append("category", data.category)
      formData.append("dimensions", data.dimensions)

      // Append main product image if changed
      if (data.img) {
        formData.append("img", data.img)
      }

      // Handle colors and their images
      const existingColors = JSON.parse(data.colors)
      formData.append("colors", data.colors)

      // Append any updated color images
      existingColors.forEach((color) => {
        const colorFile = data[`color_${color.name}`]
        if (colorFile) {
          formData.append(`color_${color.name}`, colorFile)
        }
      })

      // Send update request
      const response = await fetch(`/api/product/${product._id}`, {
        method: "PUT",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update product")
      }

      if (result.success) {
        toast.success("Product updated successfully")
        // Call onUpdate callback to refresh the product list
        if (onUpdate) {
          await onUpdate()
        }
        cleanupForm()
      } else {
        toast.error(result.message || "Failed to update product")
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error.message || "Error updating product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      cleanupForm()
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
      />

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Edit Product</h2>
            <button
              onClick={cleanupForm}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Main Product Image */}
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex flex-col items-center space-y-4">
                  {imagePreview && (
                    <div className="relative w-40 h-40">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: true })}
                  placeholder="Enter product name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: true })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="name"
                  {...register("category", { required: true })}
                  placeholder="Enter product category"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { required: true, min: 0 })}
                  placeholder="Enter price"
                />
              </div>

              {/* Color Images */}
              {product?.colors && (
                <div className="space-y-4">
                  <Label>Color Variants</Label>
                  {product.colors.map((color, index) => (
                    <div key={index} className="space-y-2">
                      <Label>{color.name}</Label>
                      <div className="flex items-center space-x-4">
                        {color.image && (
                          <div className="relative w-20 h-20">
                            <Image
                              src={color.image}
                              alt={`${color.name} variant`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleColorImageChange(e, color.name)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border-t p-6">
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={cleanupForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditProductSidebar

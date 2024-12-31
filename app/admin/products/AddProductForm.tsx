import React, { useState } from "react"
import { X, Upload, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"

const AddProductForm = ({ isOpen, onClose, fetchProducts }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    img: null,
  })

  const [mainImagePreview, setMainImagePreview] = useState("")
  const [colorVariants, setColorVariants] = useState([])
  const [loading, setLoading] = useState(false)
  const [showColorDialog, setShowColorDialog] = useState(false)
  const [newColor, setNewColor] = useState({ name: "", file: null })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      if (key === "dimensions") {
        formDataToSend.append(key, JSON.stringify(formData[key]))
      } else if (key !== "img") {
        formDataToSend.append(key, formData[key])
      }
    })

    if (formData.img) {
      formDataToSend.append("img", formData.img)
    }

    formDataToSend.append(
      "colors",
      JSON.stringify(colorVariants.map(({ name }) => ({ name, image: "" })))
    )

    colorVariants.forEach((color) => {
      if (color.file) {
        formDataToSend.append(`color_${color.name}`, color.file)
      }
    })

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) throw new Error("Failed to add product")

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        dimensions: { length: "", width: "", height: "" },
        img: null,
      })
      setColorVariants([])
      setMainImagePreview("")

      // Call the onAdd callback to refresh the product list
      // if (onAdd) {
      //   await onAdd()
      // }

      onClose()
      fetchProducts()
    } catch (error) {
      console.error("Error adding product:", error)
      toast.error("Failed to add product")
    } finally {
      setLoading(false)
    }
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleColorImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewColor((prev) => ({ ...prev, file }))
    }
  }

  const addColorVariant = () => {
    if (newColor.name && newColor.file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setColorVariants((prev) => [
          ...prev,
          {
            ...newColor,
            preview: reader.result,
          },
        ])
        setNewColor({ name: "", file: null })
        setShowColorDialog(false)
      }
      reader.readAsDataURL(newColor.file)
    }
  }

  const removeColorVariant = (index) => {
    setColorVariants((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Add New Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Dimensions</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Length"
                className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.dimensions.length}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, length: e.target.value },
                  }))
                }
              />
              <input
                type="text"
                placeholder="Width"
                className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.dimensions.width}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, width: e.target.value },
                  }))
                }
              />
              <input
                type="text"
                placeholder="Height"
                className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.dimensions.height}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, height: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Product Image</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {mainImagePreview ? (
                <div className="relative w-full aspect-square">
                  <Image
                    src={mainImagePreview}
                    alt="Product preview"
                    className="w-full h-full object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, img: null }))
                      setMainImagePreview("")
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="productImage"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="productImage"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      Upload product image
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">
                Color Variants
              </label>
              <button
                type="button"
                onClick={() => setShowColorDialog(true)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {colorVariants.map((color, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-3">
                    <Image
                      src={color.preview}
                      alt={color.name}
                      className="w-full aspect-square object-cover rounded mb-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{color.name}</span>
                      <button
                        type="button"
                        onClick={() => removeColorVariant(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </form>

        <div className="border-t p-4">
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>

      <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Color Variant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Color Name</label>
              <input
                type="text"
                value={newColor.name}
                onChange={(e) =>
                  setNewColor((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter color name"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Color Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleColorImageChange}
                className="w-full"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowColorDialog(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addColorVariant}
                disabled={!newColor.name || !newColor.file}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                Add Color
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddProductForm

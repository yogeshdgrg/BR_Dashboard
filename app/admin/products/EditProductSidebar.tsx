import { X, Trash2, Edit2, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Image from "next/image"
import { toast } from "sonner"

const CATEGORIES = [
  "Living Room",
  "Bedroom",
  "Dining Room",
  "Office",
  "Outdoor",
  "Kitchen",
  "Bathroom",
  "Kids",
  "WasteManagement",
  "Household"
]

const EditProductSidebar = ({ isOpen, onClose, product, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    dimensions: { length: "", width: "", height: "" }
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [colors, setColors] = useState([])
  const [isEditColorOpen, setIsEditColorOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const [newColorName, setNewColorName] = useState("")
  const [isAddColorOpen, setIsAddColorOpen] = useState(false)
  const [newColorData, setNewColorData] = useState({ name: "", file: null })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        dimensions: product.dimensions || { length: "", width: "", height: "" }
      })
      setImagePreview(product.img || "")
      setColors(product.colors || [])
    }
  }, [product])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleColorImageChange = (colorId, e) => {
    const file = e.target.files[0]
    if (file) {
      setColors(prevColors => prevColors.map(color => {
        if (color._id === colorId || color.id === colorId) {
          return {
            ...color,
            newImage: file,
            imagePreview: URL.createObjectURL(file)
          }
        }
        return color
      }))
    }
  }

  const handleDeleteColor = async (colorId) => {
    try {
      if (product?._id && colorId) {
        const response = await fetch(`/api/product/${product._id}/color/${colorId}`, {
          method: 'DELETE',
        })
        
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to delete color variant')
        }
      }

      setColors(prevColors => prevColors.filter(color => color._id !== colorId && color.id !== colorId))
      toast.success("Color variant deleted successfully")
    } catch (error) {
      toast.error("Failed to delete color variant")
      console.error("Delete color error:", error)
    }
  }

  const handleEditColorName = () => {
    if (newColorName.trim()) {
      setColors(prevColors => prevColors.map(color => {
        if (color._id === selectedColor._id || color.id === selectedColor.id) {
          return { ...color, name: newColorName.trim() }
        }
        return color
      }))
      setIsEditColorOpen(false)
      setSelectedColor(null)
      setNewColorName("")
    }
  }

  const handleAddColor = () => {
    if (newColorData.name.trim() && newColorData.file) {
      const newColor = {
        id: Math.random().toString(36).substr(2, 9),
        name: newColorData.name.trim(),
        newImage: newColorData.file,
        imagePreview: URL.createObjectURL(newColorData.file)
      }
      
      setColors(prevColors => [...prevColors, newColor])
      setNewColorData({ name: "", file: null })
      setIsAddColorOpen(false)
      toast.success("New color variant added")
    } else {
      toast.error("Please provide both color name and image")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!product?._id) return

    try {
      setIsSubmitting(true)
      const formDataToSend = new FormData()

      // Append basic product information
      Object.keys(formData).forEach(key => {
        if (key === 'dimensions') {
          formDataToSend.append(key, JSON.stringify(formData[key]))
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      // Append main image if changed
      if (imageFile) {
        formDataToSend.append("img", imageFile)
      }

      // Handle colors
      const colorsData = colors.map(color => ({
        id: color._id || color.id,
        name: color.name,
        hasNewImage: !!color.newImage
      }))
      formDataToSend.append("colors", JSON.stringify(colorsData))

      // Append color images
      colors.forEach(color => {
        if (color.newImage) {
          formDataToSend.append(`color_image_${color._id || color.id}`, color.newImage)
        }
      })

      const response = await fetch(`/api/product/${product._id}`, {
        method: "PUT",
        body: formDataToSend
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update product")
      }

      toast.success("Product updated successfully")
      if (onUpdate) await onUpdate()
      onClose()
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error.message || "Error updating product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`} onClick={onClose} />

      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Edit Product</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Form fields */}
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

              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Color Variants</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddColorOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>
                </div>
                
                {colors.map((color) => (
                  <div key={color._id || color.id} className="space-y-2 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{color.name}</span>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedColor(color)
                            setNewColorName(color.name)
                            setIsEditColorOpen(true)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteColor(color._id || color.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {(color.imagePreview || color.image) && (
                        <div className="relative w-20 h-20">
                          <Image
                            src={color.imagePreview || color.image}
                            alt={`${color.name} variant`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleColorImageChange(color._id || color.id, e)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Color Dialog */}
      <Dialog open={isEditColorOpen} onOpenChange={setIsEditColorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Color Name</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Enter new color name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditColorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditColorName}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Color Dialog */}
      <Dialog open={isAddColorOpen} onOpenChange={setIsAddColorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Color Variant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Color Name</Label>
              <Input
                value={newColorData.name}
                onChange={(e) => setNewColorData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter color name"
              />
            </div>
            <div>
              <Label>Color Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewColorData(prev => ({ 
                  ...prev, 
                  file: e.target.files?.[0] || null 
                }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddColorOpen(false)
              setNewColorData({ name: "", file: null })
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddColor}>Add Color</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditProductSidebar
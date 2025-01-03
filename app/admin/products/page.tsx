"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import AddProductForm from "./AddProductForm"
import { toast } from "sonner"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"
import EditProductForm from "./EditProductSidebar"
import { Plus, Pencil, Trash2 } from "lucide-react"

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

function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/product")
      const data = await response.json()
      setProducts(data.response)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsEditFormOpen(true)
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      const response = await fetch(`/api/product/${productToDelete._id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success) {
        await fetchProducts()
        toast.success("Product deleted successfully")
      } else {
        toast.error(data.message || "Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Error deleting product")
    } finally {
      setIsDeleteModalOpen(false)
      setProductToDelete(null)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <>
      {/* Blur overlay when forms are open */}
      {(isAddFormOpen || isEditFormOpen || isDeleteModalOpen) && (
        <div onClick={()=>{setIsAddFormOpen(false)}} className=" fixed top-0 left-0 w-full h-screen bg-transparent backdrop-blur-sm transition-all duration-300" />
      )}

      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <button
            onClick={() => setIsAddFormOpen(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden">
          <div className="space-y-4">
            {Array.isArray(products) &&
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white shadow-md rounded-lg p-4 transition-transform duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-4">
                    {product.images && product.images.length > 0 && (
                      <Image
                        src={product.images[0].image}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(products) &&
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.images && product.images.length > 0 && (
                          <Image
                            src={product.images[0].image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {product.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <AddProductForm
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          onProductAdded={fetchProducts}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          productName={productToDelete?.name || ""}
        />

        {selectedProduct && (
          <EditProductForm
            isOpen={isEditFormOpen}
            onClose={() => {
              setIsEditFormOpen(false)
              setSelectedProduct(null)
            }}
            onProductUpdated={fetchProducts}
            product={selectedProduct}
          />
        )}
      </div>
    </>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-6 p-4 md:p-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="bg-white shadow rounded-lg">
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default ProductList
"use client"

import { useEffect, useState, useCallback } from "react"
import EditProductSidebar from "./EditProductSidebar"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import AddProductForm from "./AddProductForm"
import { toast } from "sonner"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/product")
      const data = await response.json()
      console.log(data)
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

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
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

  const handleProductUpdate = async () => {
    await fetchProducts()
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6 p-4 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Products</h2>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="space-y-4">
          {Array.isArray(products) &&
            products.map((product) => (
              <div key={product._id} className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  {product.images && product.images.length > 0 && (
                    <Image
                      src={product.images[0].image}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-sm text-gray-500">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block bg-white shadow rounded-lg overflow-x-hidden">
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
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && product.images.length > 0 && (
                      <Image
                        src={product.images[0].image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex flex-col gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        productName={productToDelete?.name || ""}
      />

      <EditProductSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        product={selectedProduct}
        onUpdate={handleProductUpdate}
      />

      <AddProductForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        fetchProducts={fetchProducts}
      />
    </div>
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
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

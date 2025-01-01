import { connectDb } from "@/lib/db";
import Product from "@/lib/models/product";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { NextRequest } from "next/server";
import { Types, Document } from "mongoose";

interface ProductSize {
  size: string;
  quantity: number;
  price: number;
}

interface ProductFeature {
  title: string;
  description: string;
}

interface ProductImage {
  image: string;
}

interface ProductDocument extends Document {
  name: string;
  description: string;
  category: string;
  sizes: ProductSize[];
  feature: ProductFeature[];
  img: string;
  images: ProductImage[];
}

interface UpdateProductData {
  name: string;
  description: string;
  category: string;
  sizes: ProductSize[];
  feature: ProductFeature[];
  img?: string;
  images?: ProductImage[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  product?: ProductDocument;
  error?: string;
}

export const updateProduct = async (
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<ApiResponse> => {
  try {
    if (!Types.ObjectId.isValid(params.id)) {
      return {
        success: false,
        message: "Invalid product ID format",
      };
    }

    await connectDb();
    const formData = await request.formData();

    const existingProduct = await Product.findById(params.id);
    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    const updateData: UpdateProductData = {
      name: (formData.get("name") as string) || existingProduct.name,
      description:
        (formData.get("description") as string) || existingProduct.description,
      category:
        (formData.get("category") as string) || existingProduct.category,
      sizes: formData.get("sizes")
        ? JSON.parse(formData.get("sizes") as string)
        : existingProduct.sizes,
      feature: formData.get("feature")
        ? JSON.parse(formData.get("feature") as string)
        : existingProduct.feature,
    };

    const mainImage = formData.get("img") as File | null;
    if (mainImage && mainImage.size > 0) {
      try {
        const mainImageUrl = await uploadToCloudinary(
          mainImage,
          "products/main"
        );
        updateData.img = mainImageUrl;
      } catch (error) {
        console.error("Error uploading main image:", error);
        return {
          success: false,
          message: "Failed to upload main image",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    const formEntries = Array.from(formData.entries());
    const additionalImagesEntries = formEntries.filter(
      ([key]) => key === "additionalImages"
    );

    if (additionalImagesEntries.length > 0) {
      const processedImages: ProductImage[] = [];
      for (const [key, imageFile] of additionalImagesEntries) {
        console.log(key);
        if (imageFile instanceof File && imageFile.size > 0) {
          try {
            const imageUrl = await uploadToCloudinary(
              imageFile,
              "products/additional"
            );
            processedImages.push({
              image: imageUrl,
            });
          } catch (error) {
            console.error("Error uploading additional image:", error);
          }
        }
      }
      if (processedImages.length > 0) {
        updateData.images = processedImages;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return {
        success: false,
        message: "Failed to update product",
      };
    }

    return {
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: "Error updating product",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function to upload image to Cloudinary
// export async function uploadToCloudinary(
//   file: File,
//   folder: string = "products"
// ) {
//   //   const arrayBuffer = await file.arrayBuffer()
//   //   const buffer = Buffer.from(arrayBuffer)

//   //   return new Promise((resolve, reject) => {
//   //     cloudinary.uploader
//   //       .upload_stream(
//   //         {
//   //           folder: folder,
//   //           resource_type: "image",
//   //           upload_preset: "product_upload",
//   //         },
//   //         (error, result) => {
//   //           if (error) reject(error)
//   //           else resolve(result?.secure_url)
//   //         }
//   //       )
//   //       .end(buffer)
//   //   })

//   const arrayBuffer = await file.arrayBuffer() // Read file  data as ArrayBuffer
//   const buffer = Buffer.from(arrayBuffer) // Convert ArrayBu ffer to Buffer

//   try {
//     // Upload the file to Cloudinary
//     const result = await cloudinary.uploader.upload_stream({
//       folder: folder,
//       resource_type: "image",
//       upload_preset: "product_upload",
//     })

//     return result?.secure_url // Return the image URL
//   } catch (error) {
//     throw new Error("Error uploading to Cloudinary: " + error.message)
//   }
// }

export const uploadToCloudinary = async (
  file: File,
  folder: string = "products"
) => {
  try {
    console.log("Starting upload to Cloudinary:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString("base64");

    // Create upload stream with configuration
    const uploadConfig = {
      folder: folder,
      resource_type: "auto" as "auto",
    };

    // Use async/await with Cloudinary upload
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload(
        `data:${file.type};base64,${base64File}`,
        uploadConfig,
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload success:", result?.secure_url);
            resolve(result);
          }
        }
      );
    });

    // Return the secure URL from the result
    return (result as any).secure_url;
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error);
    throw error;
  }
};

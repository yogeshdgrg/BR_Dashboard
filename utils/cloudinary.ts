import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary"

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
    const uploadConfig:UploadApiOptions = {
      folder: folder,
      resource_type: "auto",
    };

    // Use async/await with Cloudinary upload
    // const result = await new Promise((resolve, reject) => {
    //   const uploadStream = cloudinary.uploader.upload(
    //     `data:${file.type};base64,${base64File}`,
    //     uploadConfig,
    //     (error, result) => {
    //       if (error) {
    //         console.error("Cloudinary upload error:", error)
    //         reject(error)
    //       } else {
    //         console.log("Cloudinary upload success:", result?.secure_url)
    //         resolve(result)
    //       }
    //     }
    //   )
    // })

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:${file.type};base64,${base64File}`,
        uploadConfig,
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else if (result) {  // Ensure result is not undefined
            console.log("Cloudinary upload success:", result.secure_url);
            resolve(result);
          } else {
            reject(new Error("Upload failed, result is undefined"));
          }
        }
      );
    });
    

    // Return the secure URL from the result
    return result.secure_url
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error);
    throw error;
  }
};


export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from URL
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0]
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    throw error
  }
}
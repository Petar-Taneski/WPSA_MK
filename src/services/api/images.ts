import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../config/firebase";

// Image upload utilities
export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

export const deleteImage = async (url: string): Promise<void> => {
  try {
    if (!url) return;

    // Extract the storage path from the download URL
    // Firebase Storage URLs have the format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    const urlParts = url.split("/o/");
    if (urlParts.length < 2) return;

    const pathWithParams = urlParts[1];
    const path = pathWithParams.split("?")[0];
    const decodedPath = decodeURIComponent(path);

    const imageRef = ref(storage, decodedPath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw error if image doesn't exist
  }
};

// Gallery image management
export const uploadGalleryImages = async (
  files: File[],
  type: "news" | "events"
): Promise<{ url: string; altText: string }[]> => {
  const uploadPromises = files.map(async (file, index) => {
    const filename = `${type}/${Date.now()}_${index}_${file.name}`;
    const url = await uploadImage(file, filename);
    return { url, altText: file.name.replace(/\.[^/.]+$/, "") };
  });

  return Promise.all(uploadPromises);
};

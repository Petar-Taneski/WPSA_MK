import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw error if image doesn't exist
  }
};

// Gallery image management
export const uploadGalleryImages = async (
  files: File[],
  type: "news" | "events",
  folderName: string
): Promise<{ url: string; altText: string }[]> => {
  const uploadPromises = files.map(async (file, index) => {
    const filename = `${type}/${folderName}/${Date.now()}_${index}_${
      file.name
    }`;
    const url = await uploadImage(file, filename);
    return { url, altText: file.name.replace(/\.[^/.]+$/, "") };
  });

  return Promise.all(uploadPromises);
};

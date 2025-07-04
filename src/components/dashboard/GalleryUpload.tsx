import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadGalleryImages } from "@/services/api";
import { useAuth } from "@/providers/auth";

interface GalleryImage {
  url: string;
  altText: string;
  file?: File;
}

interface GalleryUploadProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  type: "news" | "events";
  postTitle: string; // Changed from itemId to postTitle
}

const GALLERY_SIZE_LIMIT = 5; // Max 5 images per post/event
// Size limits temporarily disabled - uncomment to re-enable
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per image
// const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB total for all images
// const MAX_FILE_SIZE = Number.MAX_SAFE_INTEGER; // No size limit (temporarily)
const MAX_TOTAL_SIZE = Number.MAX_SAFE_INTEGER; // No size limit (temporarily)

// Helper function to create safe folder names
const createSafeFolderName = (title: string): string => {
  if (!title || title.trim() === "") {
    return `temp-${Date.now()}`;
  }

  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .substring(0, 50); // Limit length
};

export const GalleryUpload: React.FC<GalleryUploadProps> = ({
  images,
  onChange,
  type,
  postTitle,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  // Calculate current total size
  const currentTotalSize = images.reduce((total, img) => {
    return total + (img.file?.size || 0);
  }, 0);

  // Handle file selection
  const handleFileSelection = async (files: FileList) => {
    if (images.length + files.length > GALLERY_SIZE_LIMIT) {
      toast.error(
        t(
          "dashboard.galleryLimit",
          `Maximum ${GALLERY_SIZE_LIMIT} images allowed`
        )
      );
      return;
    }

    const validFiles: File[] = [];
    // let totalSize = currentTotalSize; // Temporarily disabled

    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error(
          t(
            "dashboard.invalidFileType",
            `File ${file.name} is not a valid image`
          )
        );
        continue;
      }

      // Size validation temporarily disabled - uncomment to re-enable
      // if (file.size > MAX_FILE_SIZE) {
      //   toast.error(
      //     t(
      //       "dashboard.fileSizeLimit",
      //       `File ${file.name} is too large (max 5MB)`
      //     )
      //   );
      //   continue;
      // }

      // if (totalSize + file.size > MAX_TOTAL_SIZE) {
      //   toast.error(
      //     t("dashboard.totalSizeLimit", "Total size limit exceeded (25MB max)")
      //   );
      //   break;
      // }

      // totalSize += file.size; // Temporarily disabled
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // For immediate preview, create object URLs
    const newImages: GalleryImage[] = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      altText: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      file,
    }));

    onChange([...images, ...newImages]);
    toast.success(
      t("dashboard.imagesAdded", `${validFiles.length} image(s) added`)
    );
  };

  // Handle file upload (for real Firebase upload)
  const handleUpload = async () => {
    if (!user) {
      toast.error(
        t("dashboard.authRequired", "Please log in to upload images")
      );
      return;
    }

    const filesToUpload = images.filter((img) => img.file);
    if (filesToUpload.length === 0) return;

    setUploading(true);
    try {
      const files = filesToUpload.map((img) => img.file!);
      const safeFolderName = createSafeFolderName(postTitle);
      const uploadedImages = await uploadGalleryImages(
        files,
        type,
        safeFolderName
      );

      // Replace the temporary images with uploaded ones
      const updatedImages = images.map((img) => {
        if (img.file) {
          const uploadedImg = uploadedImages.find(
            (uploaded) => uploaded.altText === img.altText
          );
          return uploadedImg || img;
        }
        return img;
      });

      onChange(updatedImages);
      toast.success(
        t("dashboard.imagesUploaded", "Images uploaded successfully")
      );
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error(t("dashboard.uploadError", "Failed to upload images"));
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const imageToRemove = images[index];

    // Clean up object URL if it exists
    if (imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // Update alt text
  const updateAltText = (index: number, altText: string) => {
    const newImages = images.map((img, i) =>
      i === index ? { ...img, altText } : img
    );
    onChange(newImages);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("dashboard.gallery", "Gallery")} ({images.length}/
            {GALLERY_SIZE_LIMIT})
          </label>
          <p className="mt-1 text-xs text-gray-500">
            {t("dashboard.galleryNote", "Maximum 5 images, no size limit")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Upload Status */}
          {currentTotalSize > 0 && (
            <div className="text-xs text-gray-500">
              {formatFileSize(currentTotalSize)} /{" "}
              {formatFileSize(MAX_TOTAL_SIZE)}
            </div>
          )}

          {/* Upload Button */}
          <label className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md transition-colors cursor-pointer hover:bg-blue-700">
            <Upload className="mr-1 w-4 h-4" />
            {t("dashboard.addImages", "Add Images")}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleFileSelection(e.target.files)
              }
              className="hidden"
              disabled={images.length >= GALLERY_SIZE_LIMIT}
            />
          </label>

          {/* Upload to Firebase Button */}
          {images.some((img) => img.file) && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded-md transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="mr-1 w-3 h-3 rounded-full border-b-2 border-white animate-spin"></div>
                  {t("dashboard.uploading", "Uploading...")}
                </>
              ) : (
                <>
                  <Upload className="mr-1 w-4 h-4" />
                  {t("dashboard.uploadToServer", "Upload to Server")}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Size Warning - temporarily disabled */}
      {/* {currentTotalSize > MAX_TOTAL_SIZE * 0.8 && (
        <div className="flex items-center p-3 space-x-2 bg-yellow-50 rounded-md border border-yellow-200">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            {t(
              "dashboard.sizeWarning",
              "Warning: You are approaching the size limit"
            )}
          </p>
        </div>
      )} */}

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative p-3 bg-gray-50 rounded-lg border border-gray-200 group"
            >
              {/* Image Preview */}
              <div className="relative mb-3">
                <img
                  src={image.url}
                  alt={image.altText}
                  className="object-cover w-full h-32 rounded-md border border-gray-300"
                />
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-white bg-red-600 rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
                  title={t("dashboard.removeImage", "Remove image")}
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Upload Status Indicator */}
                {image.file && (
                  <div className="absolute top-2 left-2 px-2 py-1 text-xs text-white bg-orange-500 rounded">
                    {t("dashboard.pending", "Pending")}
                  </div>
                )}
              </div>

              {/* Alt Text Input */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">
                  {t("dashboard.altText", "Alt Text")}
                </label>
                <input
                  type="text"
                  value={image.altText}
                  onChange={(e) => updateAltText(index, e.target.value)}
                  className="px-2 py-1 w-full text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={t(
                    "dashboard.altTextPlaceholder",
                    "Image description..."
                  )}
                />
              </div>

              {/* File Info */}
              {image.file && (
                <div className="mt-2 text-xs text-gray-500">
                  {formatFileSize(image.file.size)}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-lg border-2 border-gray-300 border-dashed">
          <ImageIcon className="mx-auto mb-4 w-12 h-12 text-gray-400" />
          <p className="mb-2 text-gray-500">
            {t("dashboard.noImages", "No images added yet")}
          </p>
          <p className="text-sm text-gray-400">
            {t("dashboard.dragDropHint", 'Click "Add Images" to upload photos')}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
        <h4 className="mb-2 text-sm font-medium text-blue-800">
          {t("dashboard.galleryInstructions", "Gallery Instructions")}
        </h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>
            • {t("dashboard.instruction1", "Maximum 5 images per post/event")}
          </li>
          <li>
            •{" "}
            {t(
              "dashboard.instruction2",
              "No size limit per image (temporarily)"
            )}
          </li>
          <li>
            • {t("dashboard.instruction3", "No total size limit (temporarily)")}
          </li>
          <li>
            •{" "}
            {t(
              "dashboard.instruction4",
              "Supported formats: JPG, PNG, GIF, WebP"
            )}
          </li>
          <li>
            •{" "}
            {t(
              "dashboard.instruction5",
              "Add descriptive alt text for accessibility"
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

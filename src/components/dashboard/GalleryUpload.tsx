import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { deleteImage } from "@/services/api";
import { compressImages, COMPRESSION_PRESETS } from "@/utils/imageCompression";

interface GalleryImage {
  url: string;
  altText: string;
  file?: File;
}

interface GalleryUploadProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  type: "news" | "events";
}

const GALLERY_SIZE_LIMIT = 5; // Max 5 images per post/event
// Size limits temporarily disabled - uncomment to re-enable
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per image
// const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB total for all images
// const MAX_FILE_SIZE = Number.MAX_SAFE_INTEGER; // No size limit (temporarily)
const MAX_TOTAL_SIZE = Number.MAX_SAFE_INTEGER; // No size limit (temporarily)

export const GalleryUpload: React.FC<GalleryUploadProps> = ({
  images,
  onChange,
}) => {
  const { t } = useTranslation();
  const [compressing, setCompressing] = useState(false);

  // Calculate current total size
  const currentTotalSize = images.reduce((total, img) => {
    return total + (img.file?.size || 0);
  }, 0);

  // Handle file selection with compression
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

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setCompressing(true);

    try {
      // Compress all images
      const compressedFiles = await compressImages(
        validFiles,
        COMPRESSION_PRESETS.web
      );

      // Create new images with compressed files
      const newImages: GalleryImage[] = compressedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        altText: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        file,
      }));

      onChange([...images, ...newImages]);
    } catch (error) {
      console.error("Error compressing gallery images:", error);
      toast.error(
        t(
          "dashboard.galleryCompressionError",
          "Failed to optimize some images. Using original files."
        )
      );

      // Fallback to original files if compression fails
      const newImages: GalleryImage[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        altText: file.name.replace(/\.[^/.]+$/, ""),
        file,
      }));

      onChange([...images, ...newImages]);
    } finally {
      setCompressing(false);
    }
  };

  // Remove image
  const removeImage = async (index: number) => {
    const imageToRemove = images[index];

    // Clean up object URL if it exists
    if (imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    } else if (imageToRemove.url.includes("firebasestorage.googleapis.com")) {
      // Delete from Firebase Storage if it's a Firebase URL
      try {
        await deleteImage(imageToRemove.url);
        toast.success(
          t("dashboard.imageDeleted", "Image deleted from storage")
        );
      } catch (error) {
        console.error("Error deleting image from storage:", error);
        toast.error(
          t("dashboard.deleteImageError", "Failed to delete image from storage")
        );
      }
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
          <label
            className={`flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md transition-colors cursor-pointer hover:bg-blue-700 ${
              compressing || images.length >= GALLERY_SIZE_LIMIT
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {compressing ? (
              <>
                <Loader2 className="mr-1 w-4 h-4 animate-spin" />
                {t("dashboard.optimizing", "Optimizing...")}
              </>
            ) : (
              <>
                <ImageIcon className="mr-1 w-4 h-4" />
                {t("dashboard.addImages", "Add Images")}
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleFileSelection(e.target.files)
              }
              className="hidden"
              disabled={compressing || images.length >= GALLERY_SIZE_LIMIT}
            />
          </label>
        </div>
      </div>

      {/* Size Warning - temporarily disabled */}
      {/* {currentTotalSize > MAX_TOTAL_SIZE * 0.8 && (
        <div className="px-3 py-2 bg-yellow-100 rounded-md border border-yellow-400">
          <p className="text-sm text-yellow-800">
            {t("dashboard.sizeWarning", "Warning: Approaching size limit")}
          </p>
        </div>
      )} */}

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="overflow-hidden bg-gray-100 rounded-lg aspect-w-16 aspect-h-9">
                <img
                  src={image.url}
                  alt={image.altText}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 text-white bg-red-500 rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                aria-label={t("dashboard.removeImage", "Remove image")}
              >
                <X className="w-4 h-4" />
              </button>

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
      <div className="space-y-1 text-xs text-gray-500">
        <p>
          {t(
            "dashboard.galleryInstructions",
            "• Images will be automatically uploaded when you save the post"
          )}
        </p>
        <p>
          {t(
            "dashboard.galleryInstructions2",
            "• Click the × button to remove an image"
          )}
        </p>
        <p>
          {t(
            "dashboard.galleryInstructions3",
            "• Add descriptive alt text for accessibility"
          )}
        </p>
      </div>
    </div>
  );
};

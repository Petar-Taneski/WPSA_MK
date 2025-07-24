import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { compressImage, COMPRESSION_PRESETS } from "@/utils/imageCompression";

interface ImageData {
  url: string;
  altText: string;
  file?: File;
}

interface ImageUploadProps {
  imageData: ImageData | null;
  onImageChange: (imageData: ImageData | null) => void;
}

// Size limits temporarily disabled - uncomment to re-enable
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per image
// const MAX_FILE_SIZE = Number.MAX_SAFE_INTEGER; // No size limit (temporarily)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  imageData,
  onImageChange,
}) => {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file validation
  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(
        t(
          "dashboard.invalidFileType",
          "Please select a valid image file (JPG, PNG, GIF, WebP)"
        )
      );
      return false;
    }

    // Size validation temporarily disabled - uncomment to re-enable
    // if (file.size > MAX_FILE_SIZE) {
    //   toast.error(
    //     t("dashboard.fileSizeLimit", "File size must be less than 5MB")
    //   );
    //   return false;
    // }

    return true;
  };

  // Handle file selection with compression
  const handleFileSelection = async (file: File) => {
    if (!validateFile(file)) return;

    setCompressing(true);

    try {
      // Compress the image while maintaining original dimensions
      const compressedFile = await compressImage(
        file,
        COMPRESSION_PRESETS.medium
      );

      // Create object URL for immediate preview
      const previewUrl = URL.createObjectURL(compressedFile);

      // Auto-generate alt text from filename
      const autoAltText = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");

      // Store compressed file locally with preview URL
      const newImageData: ImageData = {
        url: previewUrl,
        altText: imageData?.altText || autoAltText,
        file: compressedFile,
      };

      onImageChange(newImageData);
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error(
        t(
          "dashboard.compressionError",
          "Failed to optimize image. Using original file."
        )
      );

      // Fallback to original file if compression fails
      const previewUrl = URL.createObjectURL(file);
      const autoAltText = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");

      const newImageData: ImageData = {
        url: previewUrl,
        altText: imageData?.altText || autoAltText,
        file: file,
      };

      onImageChange(newImageData);
    } finally {
      setCompressing(false);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  // Handle browse button click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Remove current image
  const removeImage = () => {
    if (imageData?.url && imageData.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageData.url);
    }
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Update alt text
  const updateAltText = (newAltText: string) => {
    if (imageData) {
      onImageChange({ ...imageData, altText: newAltText });
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Preview or Upload Area */}
      {imageData ? (
        <div className="space-y-4">
          {/* Current Image */}
          <div className="relative">
            <img
              src={imageData.url}
              alt={imageData.altText}
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              aria-label={t("dashboard.removeImage", "Remove image")}
            >
              <X className="w-4 h-4" />
            </button>

            {/* File indicator */}
            {imageData.file && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                {t("dashboard.pendingUpload", "Will upload on save")}
              </div>
            )}
          </div>

          {/* Alt Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("dashboard.altText", "Image Alt Text")}
            </label>
            <input
              type="text"
              value={imageData.altText}
              onChange={(e) => updateAltText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t(
                "dashboard.altTextPlaceholder",
                "Image description..."
              )}
            />
          </div>

          {/* Replace Image Button */}
          <button
            onClick={handleBrowseClick}
            type="button"
            disabled={compressing}
            className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {compressing ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("dashboard.optimizing", "Optimizing...")}
              </span>
            ) : (
              t("dashboard.replaceImage", "Replace Image")
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              {t(
                "dashboard.dragDropImage",
                "Drag & drop an image here, or click to browse"
              )}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              {t(
                "dashboard.imageRequirements",
                "JPG, PNG, GIF, WebP (no size limit)"
              )}
            </p>
            <button
              onClick={handleBrowseClick}
              type="button"
              disabled={compressing}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {compressing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("dashboard.optimizing", "Optimizing...")}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {t("dashboard.browseFiles", "Browse Files")}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={compressing}
        className="hidden"
      />
    </div>
  );
};

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/auth";
import { toast } from "react-toastify";
import { Save, X } from "lucide-react";
import {
  createNewsArticle,
  updateNewsArticle,
  uploadImage,
  uploadGalleryImages,
} from "@/services/api";
import { NewsArticle } from "@/services/interfaces";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { GalleryUpload } from "./GalleryUpload";
import { LinkManager } from "./LinkManager";
import { ImageUpload } from "./ImageUpload";

interface LinkPair {
  name: string;
  url: string;
}

interface GalleryImage {
  url: string;
  altText: string;
  file?: File;
}

interface ImageData {
  url: string;
  altText: string;
  file?: File;
}

interface NewsFormProps {
  editingItem: NewsArticle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const NewsForm: React.FC<NewsFormProps> = ({
  editingItem,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    mainImage: null as ImageData | null,
    author: "",
    tags: "",
    lang: "english",
    links: [] as LinkPair[],
    gallery: [] as GalleryImage[],
  });

  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        summary: editingItem.summary,
        content: editingItem.content,
        mainImage: editingItem.imageUrl
          ? {
              url: editingItem.imageUrl,
              altText: editingItem.altText || "",
            }
          : null,
        author: editingItem.author || "",
        tags: editingItem.tags?.join(", ") || "",
        lang: editingItem.lang,
        links: editingItem.links || [],
        gallery: editingItem.gallery || [],
      });
    }
  }, [editingItem]);

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = t("dashboard.titleRequired", "Title is required");
    }
    if (!formData.summary.trim()) {
      newErrors.summary = t("dashboard.summaryRequired", "Summary is required");
    }
    if (!formData.content.trim()) {
      newErrors.content = t("dashboard.contentRequired", "Content is required");
    }

    // Validate main image - required
    if (!formData.mainImage) {
      newErrors.mainImage = t(
        "dashboard.imageRequired",
        "Main image is required"
      );
    } else if (
      formData.mainImage.url &&
      !formData.mainImage.file &&
      !isValidUrl(formData.mainImage.url)
    ) {
      newErrors.mainImage = t(
        "dashboard.invalidUrl",
        "Please enter a valid URL"
      );
    }

    // Validate links
    formData.links.forEach((link, index) => {
      if (link.name && !link.url) {
        newErrors[`link_${index}_url`] = t(
          "dashboard.linkUrlRequired",
          "URL is required when name is provided"
        );
      }
      if (link.url && !isValidUrl(link.url)) {
        newErrors[`link_${index}_url`] = t(
          "dashboard.invalidUrl",
          "Please enter a valid URL"
        );
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(t("dashboard.errors", "Missing required fields"));
    }
    return Object.keys(newErrors).length === 0;
  };

  // URL validation helper
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Helper function to create safe folder names
  const createSafeFolderName = (title: string): string => {
    if (!title || title.trim() === "") {
      return `temp-${Date.now()}`;
    }
    return title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;

    setSaving(true);
    try {
      let finalImageUrl = "";
      let finalAltText = "";

      // Upload main image if it has a file
      if (formData.mainImage?.file) {
        const safeFolderName = createSafeFolderName(formData.title);
        const filename = `news/${safeFolderName}/${Date.now()}_${
          formData.mainImage.file.name
        }`;
        finalImageUrl = await uploadImage(formData.mainImage.file, filename);
        finalAltText = formData.mainImage.altText;
      } else if (formData.mainImage?.url) {
        // Use existing URL if no new file
        finalImageUrl = formData.mainImage.url;
        finalAltText = formData.mainImage.altText;
      }

      // Upload gallery images if they have files
      const galleryImagesToUpload = formData.gallery.filter((img) => img.file);
      let finalGallery = formData.gallery;

      if (galleryImagesToUpload.length > 0) {
        const safeFolderName = createSafeFolderName(formData.title);
        const files = galleryImagesToUpload.map((img) => img.file!);
        const uploadedImages = await uploadGalleryImages(
          files,
          "news",
          safeFolderName
        );

        // Replace the temporary images with uploaded ones
        finalGallery = formData.gallery.map((img) => {
          if (img.file) {
            const uploadedImg = uploadedImages.find(
              (uploaded) => uploaded.altText === img.altText
            );
            return uploadedImg || img;
          }
          return img;
        });
      }

      // Prepare data for submission
      const newsData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        imageUrl: finalImageUrl || undefined,
        altText: finalAltText || undefined,
        author: formData.author || undefined,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : undefined,
        lang: formData.lang,
        links:
          formData.links.filter((link) => link.name && link.url).length > 0
            ? formData.links.filter((link) => link.name && link.url)
            : undefined,
        gallery:
          finalGallery.length > 0
            ? finalGallery.map((img) => ({
                url: img.url,
                altText: img.altText,
              }))
            : undefined,
      };

      if (editingItem) {
        await updateNewsArticle(editingItem.id, newsData, user.uid);
        toast.success(
          t("dashboard.newsUpdated", "News article updated successfully")
        );
      } else {
        await createNewsArticle(newsData, user.uid);
        toast.success(
          t("dashboard.newsCreated", "News article created successfully")
        );
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving news article:", error);
      toast.error(t("dashboard.saveError", "Failed to save news article"));
    } finally {
      setSaving(false);
    }
  };

  // Handle form field changes
  const handleChange = (
    field: string,
    value: string | LinkPair[] | GalleryImage[] | ImageData | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="p-6">
      {/* Form Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingItem
            ? t("dashboard.editNewsArticle", "Edit News Article")
            : t("dashboard.createNewsArticle", "Create News Article")}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("dashboard.title", "Title")} *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("dashboard.titlePlaceholder", "Enter title...")}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("dashboard.summary", "Summary")} *
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.summary ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("dashboard.summaryPlaceholder", "Enter summary...")}
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-500">{errors.summary}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("dashboard.content", "Content")} *
          </label>
          <div
            className={`border rounded-md ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
          >
            <ReactQuill
              value={formData.content}
              onChange={(value) => handleChange("content", value)}
              className="bg-white"
              theme="snow"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              placeholder={t(
                "dashboard.contentPlaceholder",
                "Enter content..."
              )}
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        {/* Language and Author */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("dashboard.language", "Language")} *
            </label>
            <select
              value={formData.lang}
              onChange={(e) => handleChange("lang", e.target.value)}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="english">English</option>
              <option value="macedonian">Macedonian</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("dashboard.author", "Author")}
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("dashboard.authorPlaceholder", "Author name...")}
            />
          </div>
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("dashboard.mainImage", "Main Image")} *
          </label>
          <ImageUpload
            imageData={formData.mainImage}
            onImageChange={(imageData) => {
              handleChange("mainImage", imageData);
            }}
          />
          {errors.mainImage && (
            <p className="mt-1 text-sm text-red-500">{errors.mainImage}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("dashboard.tags", "Tags")}
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t(
              "dashboard.tagsPlaceholder",
              "Comma-separated tags..."
            )}
          />
          <p className="mt-1 text-sm text-gray-500">
            {t(
              "dashboard.tagsHelp",
              "Separate tags with commas (e.g., agriculture, poultry, research)"
            )}
          </p>
        </div>

        {/* Links */}
        <LinkManager
          links={formData.links}
          onChange={(links) => handleChange("links", links)}
          errors={errors}
        />

        {/* Gallery */}
        <GalleryUpload
          images={formData.gallery}
          onChange={(gallery) => handleChange("gallery", gallery)}
          type="news"
          postTitle={formData.title}
        />

        {/* Action Buttons */}
        <div className="flex justify-end pt-6 space-x-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md transition-colors hover:bg-gray-200"
          >
            {t("dashboard.cancel", "Cancel")}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="mr-2 w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
                {t("dashboard.saving", "Saving...")}
              </>
            ) : (
              <>
                <Save className="mr-2 w-4 h-4" />
                {editingItem
                  ? t("dashboard.update", "Update")
                  : t("dashboard.create", "Create")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/auth";
import { toast } from "react-toastify";
import { Save, X } from "lucide-react";
import {
  createEvent,
  updateEvent,
  uploadImage,
  uploadGalleryImages,
  deletePendingImages,
  fetchEventsFromFirebase,
} from "@/services/api";
import { Event } from "@/services/interfaces";
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
  pendingDeletion?: boolean;
}

interface ImageData {
  url: string;
  altText: string;
  file?: File;
}

interface EventFormProps {
  editingItem: Event | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  editingItem,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [featuredEventsCount, setFeaturedEventsCount] = useState(0);
  const langRef = useRef<HTMLSelectElement | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    mainImage: null as ImageData | null,
    isFeatured: false,
    eventDate: "",
    eventEndDate: "",
    location: "",
    formUrl: "",
    lang: "english",
    links: [] as LinkPair[],
    gallery: [] as GalleryImage[],
  });

  useEffect(() => {
    const fetchFeaturedCount = async () => {
      try {
        const featuredEvents = await fetchEventsFromFirebase({
          lang: langRef.current?.value || "english",
          isFeatured: true,
        });
        setFeaturedEventsCount(featuredEvents.length);
      } catch (error) {
        console.error("Failed to fetch featured events count:", error);
        toast.error("Could not fetch featured events count.");
      }
    };

    fetchFeaturedCount();
  }, [langRef.current?.value]);

  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Track pending gallery image deletions
  const [pendingGalleryDeletions, setPendingGalleryDeletions] = useState<
    string[]
  >([]);

  // ref for the summary textarea so we can auto-resize it
  const summaryRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize helper: sets height to fit content
  const autoResize = (el?: HTMLTextAreaElement | null) => {
    const ta = el ?? summaryRef.current;
    if (!ta) return;
    // reset to auto to correctly measure scrollHeight
    ta.style.height = "auto";
    // set to scrollHeight (plus a tiny buffer)
    ta.style.height = `${ta.scrollHeight}px`;
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    if (!editingItem) {
      // For new items, check if any fields have been filled
      return (
        formData.title.trim() !== "" ||
        formData.summary.trim() !== "" ||
        formData.content.trim() !== "" ||
        formData.location.trim() !== "" ||
        formData.formUrl.trim() !== "" ||
        formData.eventDate !== "" ||
        formData.eventEndDate !== "" ||
        formData.isFeatured !== false ||
        formData.mainImage !== null ||
        formData.links.length > 0 ||
        formData.gallery.length > 0 ||
        pendingGalleryDeletions.length > 0
      );
    } else {
      // For existing items, check if any fields have changed
      return (
        formData.title !== editingItem.title ||
        formData.summary !== editingItem.summary ||
        formData.content !== editingItem.content ||
        formData.location !== (editingItem.location || "") ||
        formData.formUrl !== (editingItem.formUrl || "") ||
        formData.isFeatured !== (editingItem.isFeatured || false) ||
        formData.lang !== editingItem.lang ||
        JSON.stringify(formData.links) !==
          JSON.stringify(editingItem.links || []) ||
        JSON.stringify(formData.gallery) !==
          JSON.stringify(editingItem.gallery || []) ||
        pendingGalleryDeletions.length > 0 ||
        formData.mainImage?.url !== editingItem.imageUrl ||
        formData.mainImage?.altText !== (editingItem.altText || "") ||
        formatDateForInput(editingItem.eventDate) !== formData.eventDate ||
        formatDateForInput(editingItem.eventEndDate || "") !==
          formData.eventEndDate
      );
    }
  }, [editingItem, formData, pendingGalleryDeletions]);

  // Warn user about unsaved changes when leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Helper function to convert formatted date string to YYYY-MM-DD format for HTML input
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";

    try {
      // Try to parse the date string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      // Convert to YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error parsing date:", error);
      return "";
    }
  };

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
        isFeatured: editingItem.isFeatured || false,
        eventDate: formatDateForInput(editingItem.eventDate || ""),
        eventEndDate: formatDateForInput(editingItem.eventEndDate || ""),
        location: editingItem.location,
        formUrl: editingItem.formUrl || "",
        lang: editingItem.lang,
        links: editingItem.links || [],
        gallery: editingItem.gallery || [],
      });
    }
    // note: we don't call autoResize here directly because formData will update;
    // a separate effect below watches formData.summary and resizes.
  }, [editingItem]);

  // Auto-resize summary textarea whenever the content changes
  useEffect(() => {
    autoResize();
  }, [formData.summary]);

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
    if (!formData.eventDate) {
      newErrors.eventDate = t(
        "dashboard.eventDateRequired",
        "Event date is required"
      );
    }
    if (!formData.location.trim()) {
      newErrors.location = t(
        "dashboard.locationRequired",
        "Location is required"
      );
    }

    // Validate dates
    if (formData.eventDate && formData.eventEndDate) {
      const startDate = new Date(formData.eventDate);
      const endDate = new Date(formData.eventEndDate);
      if (endDate < startDate) {
        newErrors.eventEndDate = t(
          "dashboard.endDateAfterStart",
          "End date must be after start date"
        );
      }
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

    if (formData.formUrl && !isValidUrl(formData.formUrl)) {
      newErrors.formUrl = t("dashboard.invalidUrl", "Please enter a valid URL");
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
        const filename = `events/${Date.now()}_${formData.mainImage.file.name}`;
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
        const files = galleryImagesToUpload.map((img) => img.file!);
        const uploadedImages = await uploadGalleryImages(files, "events");

        // Replace the temporary images with uploaded ones
        finalGallery = formData.gallery.map((img) => {
          if (img.file) {
            const uploadedImg = uploadedImages.find(
              (uploaded: { altText: string }) =>
                uploaded.altText === img.altText
            );
            return uploadedImg || img;
          }
          return img;
        });
      }

      // Filter out images marked for deletion
      finalGallery = finalGallery.filter((img) => !img.pendingDeletion);

      // Prepare data for submission
      const eventData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        imageUrl: finalImageUrl || undefined,
        altText: finalAltText || undefined,
        isFeatured: formData.isFeatured,
        eventDate: new Date(formData.eventDate),
        eventEndDate: formData.eventEndDate
          ? new Date(formData.eventEndDate)
          : undefined,
        location: formData.location,
        formUrl: formData.formUrl || undefined,
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
        await updateEvent(editingItem.id, eventData, user.uid);
        toast.success(
          t("dashboard.eventUpdated", "Event updated successfully")
        );
      } else {
        await createEvent(eventData, user.uid);
        toast.success(
          t("dashboard.eventCreated", "Event created successfully")
        );
      }

      // Handle pending gallery deletions after the event is saved
      if (pendingGalleryDeletions.length > 0) {
        try {
          await deletePendingImages(pendingGalleryDeletions);
          toast.success(
            t(
              "dashboard.galleryImagesDeleted",
              "Gallery images deleted successfully"
            )
          );
        } catch (error) {
          console.error("Error deleting gallery images after save:", error);
          toast.error(
            t(
              "dashboard.errorDeletingGalleryImages",
              "Error deleting some gallery images"
            )
          );
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(t("dashboard.saveError", "Failed to save event"));
    } finally {
      setSaving(false);
    }
  };

  // Handle form field changes
  const handleChange = (
    field: string,
    value: string | boolean | LinkPair[] | GalleryImage[] | ImageData | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // specific handler for summary that resizes the textarea as user types
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange("summary", e.target.value);
    autoResize(e.target);
  };

  // Enhanced cancel handler with unsaved changes warning
  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      const confirmDiscard = window.confirm(
        t(
          "dashboard.confirmDiscard",
          "You have unsaved changes. Are you sure you want to discard them?"
        )
      );
      if (!confirmDiscard) {
        return;
      }
    }
    onCancel();
  };

  return (
    <div className="p-6">
      {/* Form Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingItem
            ? t("dashboard.editEvent", "Edit Event")
            : t("dashboard.createEvent", "Create Event")}
        </h2>
        <button
          onClick={handleCancel}
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
            ref={summaryRef}
            value={formData.summary}
            onChange={handleSummaryChange}
            rows={3}
            // keep overflow-hidden so the scrollbars don't show while we resize
            style={{ overflow: "hidden" }}
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

        {/* Event Dates and Location */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("dashboard.eventDate", "Event Date")} *
            </label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleChange("eventDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.eventDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.eventDate && (
              <p className="mt-1 text-sm text-red-500">{errors.eventDate}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("dashboard.eventEndDate", "Event End Date")}
            </label>
            <input
              type="date"
              value={formData.eventEndDate}
              onChange={(e) => handleChange("eventEndDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.eventEndDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.eventEndDate && (
              <p className="mt-1 text-sm text-red-500">{errors.eventEndDate}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("dashboard.location", "Location")} *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t(
                "dashboard.locationPlaceholder",
                "Event location..."
              )}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Language */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("dashboard.language", "Language")} *
            </label>
            <select
              ref={langRef}
              value={formData.lang}
              onChange={(e) => handleChange("lang", e.target.value)}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="english">English</option>
              <option value="macedonian">Macedonian</option>
            </select>
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

        {/* Registration Form URL and Featured Toggle */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("dashboard.formUrl", "Registration Form URL")}
            </label>
            <input
              type="url"
              value={formData.formUrl}
              onChange={(e) => handleChange("formUrl", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.formUrl ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://forms.example.com/register"
            />
            {errors.formUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.formUrl}</p>
            )}
          </div>

          <div className="pt-8">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.isFeatured}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
                disabled={featuredEventsCount >= 5 && !formData.isFeatured}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label
                htmlFor="featured"
                className={`text-sm font-medium ${
                  featuredEventsCount >= 5 && !formData.isFeatured
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700"
                }`}
              >
                {t("dashboard.featuredEvent", "Featured Event")}
              </label>
            </div>
            {featuredEventsCount >= 5 && !formData.isFeatured && (
              <p className="mt-2 text-sm text-gray-500/70">
                {t(
                  "dashboard.featuredLimitReached",
                  "(Too many featured events, please remove one before adding more.)"
                )}
              </p>
            )}
          </div>
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
          onPendingDeletions={setPendingGalleryDeletions}
          type="events"
        />

        {/* Action Buttons */}
        <div className="flex justify-end pt-6 space-x-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
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

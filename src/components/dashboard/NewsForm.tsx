import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/auth";
import { toast } from "react-toastify";
import { Save, X, Search, Link2, Unlink, Eye } from "lucide-react";
import {
  createNewsArticle,
  updateNewsArticle,
  uploadImage,
  uploadGalleryImages,
  fetchPostsInOppositeLanguage,
  linkCorrespondingPosts,
  unlinkCorrespondingPosts,
  getCorrespondingPost,
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

  // Corresponding post state
  const [correspondingPost, setCorrespondingPost] =
    useState<NewsArticle | null>(null);
  const [availablePosts, setAvailablePosts] = useState<NewsArticle[]>([]);
  const [showPostSelector, setShowPostSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingCorresponding, setLoadingCorresponding] = useState(false);
  const [hasBeenUnlinked, setHasBeenUnlinked] = useState(false);
  // Track pending link changes that haven't been saved yet
  const [pendingLinkPost, setPendingLinkPost] = useState<NewsArticle | null>(
    null
  );
  const [pendingUnlink, setPendingUnlink] = useState(false);

  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cleanup effect to handle component unmounting (e.g., when user navigates back)
  useEffect(() => {
    return () => {
      // Clear any pending operations when component unmounts
      if (pendingLinkPost || pendingUnlink) {
        // Reset pending states
        setPendingLinkPost(null);
        setPendingUnlink(false);
      }
    };
  }, [pendingLinkPost, pendingUnlink]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (!editingItem) {
      // For new items, check if any fields have been filled
      return (
        formData.title.trim() !== "" ||
        formData.summary.trim() !== "" ||
        formData.content.trim() !== "" ||
        formData.author.trim() !== "" ||
        formData.tags.trim() !== "" ||
        formData.mainImage !== null ||
        formData.links.length > 0 ||
        formData.gallery.length > 0 ||
        pendingLinkPost !== null ||
        pendingUnlink
      );
    } else {
      // For existing items, check if any fields have changed
      return (
        formData.title !== editingItem.title ||
        formData.summary !== editingItem.summary ||
        formData.content !== editingItem.content ||
        formData.author !== (editingItem.author || "") ||
        formData.tags !== (editingItem.tags?.join(", ") || "") ||
        formData.lang !== editingItem.lang ||
        JSON.stringify(formData.links) !==
          JSON.stringify(editingItem.links || []) ||
        JSON.stringify(formData.gallery) !==
          JSON.stringify(editingItem.gallery || []) ||
        pendingLinkPost !== null ||
        pendingUnlink ||
        formData.mainImage?.url !== editingItem.imageUrl ||
        formData.mainImage?.altText !== (editingItem.altText || "")
      );
    }
  };

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
  }, [formData, editingItem, pendingLinkPost, pendingUnlink]);

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

      // Reset unlinked flag when loading new post
      setHasBeenUnlinked(false);
      // Reset pending changes when loading a new post
      setPendingLinkPost(null);
      setPendingUnlink(false);

      // Load corresponding post if it exists
      if (editingItem.correspondingId) {
        loadCorrespondingPost(editingItem.correspondingId, editingItem.lang);
      } else {
        setCorrespondingPost(null);
      }
    }
  }, [editingItem]);

  // Load corresponding post
  const loadCorrespondingPost = async (
    correspondingId: string,
    currentLang: string
  ) => {
    setLoadingCorresponding(true);
    try {
      const expectedLang = currentLang === "english" ? "macedonian" : "english";
      const post = await getCorrespondingPost(correspondingId, expectedLang);
      setCorrespondingPost(post);
    } catch (error) {
      console.error("Error loading corresponding post:", error);
      toast.error(
        t(
          "dashboard.errorLoadingCorrespondingPost",
          "Error loading corresponding post"
        )
      );
    } finally {
      setLoadingCorresponding(false);
    }
  };

  // Load available posts for linking
  const loadAvailablePosts = async () => {
    setLoadingCorresponding(true);
    try {
      const posts = await fetchPostsInOppositeLanguage(formData.lang);
      // Filter out already linked posts
      const unlinkedPosts = posts.filter((post) => !post.correspondingId);
      setAvailablePosts(unlinkedPosts);
    } catch (error) {
      console.error("Error loading available posts:", error);
      toast.error(
        t("dashboard.errorLoadingPosts", "Error loading available posts")
      );
    } finally {
      setLoadingCorresponding(false);
    }
  };

  // Handle linking posts - now deferred until form submission
  const handleLinkPost = (selectedPost: NewsArticle) => {
    if (!editingItem) {
      toast.error(
        t(
          "dashboard.saveFirstToLink",
          "Please save the post first before linking"
        )
      );
      return;
    }

    // Store the pending link operation
    setPendingLinkPost(selectedPost);
    setPendingUnlink(false); // Clear any pending unlink
    setShowPostSelector(false);
    toast.info(
      t("dashboard.linkPending", "Link will be applied when you save the post")
    );
  };

  // Handle unlinking posts - now deferred until form submission
  const handleUnlinkPost = () => {
    if (!editingItem) return;

    // Store the pending unlink operation
    setPendingUnlink(true);
    setPendingLinkPost(null); // Clear any pending link
    toast.info(
      t(
        "dashboard.unlinkPending",
        "Unlink will be applied when you save the post"
      )
    );
  };

  // Filter available posts based on search term
  const filteredPosts = availablePosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        const filename = `news/${Date.now()}_${formData.mainImage.file.name}`;
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
        const uploadedImages = await uploadGalleryImages(files, "news");

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
        // Handle corresponding ID based on pending operations
        correspondingId: pendingUnlink
          ? undefined
          : pendingLinkPost?.id ||
            (hasBeenUnlinked
              ? undefined
              : correspondingPost?.id || editingItem?.correspondingId) ||
            undefined,
      };

      let postId: string;
      if (editingItem) {
        await updateNewsArticle(editingItem.id, newsData, user.uid);
        postId = editingItem.id;
        toast.success(
          t("dashboard.newsUpdated", "News article updated successfully")
        );
      } else {
        postId = await createNewsArticle(newsData, user.uid);
        toast.success(
          t("dashboard.newsCreated", "News article created successfully")
        );
      }

      // Handle pending link/unlink operations after the post is saved
      if (pendingLinkPost && user) {
        try {
          await linkCorrespondingPosts(postId, pendingLinkPost.id, user.uid);
          toast.success(
            t("dashboard.postsLinked", "Posts linked successfully")
          );
        } catch (error) {
          console.error("Error linking posts after save:", error);
          toast.error(t("dashboard.errorLinkingPosts", "Error linking posts"));
        }
      } else if (pendingUnlink && user && editingItem) {
        try {
          await unlinkCorrespondingPosts(postId, user.uid);
          toast.success(
            t("dashboard.postsUnlinked", "Posts unlinked successfully")
          );
        } catch (error) {
          console.error("Error unlinking posts after save:", error);
          toast.error(
            t("dashboard.errorUnlinkingPosts", "Error unlinking posts")
          );
        }
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
            ? t("dashboard.editNewsArticle", "Edit News Article")
            : t("dashboard.createNewsArticle", "Create News Article")}
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

        {/* Corresponding Post Management */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {t("dashboard.correspondingPost", "Corresponding Post")}
            </h3>
            <div className="text-sm text-gray-600">
              {t(
                "dashboard.correspondingPostHelp",
                "Link this post to its translation in the opposite language"
              )}
            </div>
          </div>

          {/* Show pending link if exists */}
          {pendingLinkPost && !pendingUnlink ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-800">
                      {pendingLinkPost.title}
                    </h4>
                    <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-200 rounded">
                      {t("dashboard.pendingLink", "Pending Link")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {pendingLinkPost.summary}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {pendingLinkPost.lang === "english"
                        ? "English"
                        : "Macedonian"}
                    </span>
                    <span>•</span>
                    <span>{pendingLinkPost.publishDate}</span>
                    {pendingLinkPost.author && (
                      <>
                        <span>•</span>
                        <span>{pendingLinkPost.author}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        pendingLinkPost.lang === "english"
                          ? `/en/news/${pendingLinkPost.id}`
                          : `/mk/вести/${pendingLinkPost.id}`,
                        "_blank"
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                  >
                    <Eye className="w-4 h-4" />
                    {t("dashboard.preview", "Preview")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingLinkPost(null);
                      toast.info(
                        t("dashboard.linkCancelled", "Pending link cancelled")
                      );
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 bg-gray-50 rounded hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                    {t("dashboard.cancel", "Cancel")}
                  </button>
                </div>
              </div>
            </div>
          ) : correspondingPost && !pendingUnlink ? (
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-2">
                    {correspondingPost.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {correspondingPost.summary}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {correspondingPost.lang === "english"
                        ? "English"
                        : "Macedonian"}
                    </span>
                    <span>•</span>
                    <span>{correspondingPost.publishDate}</span>
                    {correspondingPost.author && (
                      <>
                        <span>•</span>
                        <span>{correspondingPost.author}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        correspondingPost.lang === "english"
                          ? `/en/news/${correspondingPost.id}`
                          : `/mk/вести/${correspondingPost.id}`,
                        "_blank"
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                  >
                    <Eye className="w-4 h-4" />
                    {t("dashboard.preview", "Preview")}
                  </button>
                  <button
                    type="button"
                    onClick={handleUnlinkPost}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100"
                  >
                    <Unlink className="w-4 h-4" />
                    {t("dashboard.unlink", "Unlink")}
                  </button>
                </div>
              </div>
            </div>
          ) : pendingUnlink ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-red-800 font-medium">
                    {t("dashboard.pendingUnlink", "Pending Unlink")}
                  </span>
                  <span className="text-sm text-red-600">
                    {t(
                      "dashboard.pendingUnlinkDescription",
                      "The link will be removed when you save"
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPendingUnlink(false);
                    toast.info(
                      t("dashboard.unlinkCancelled", "Pending unlink cancelled")
                    );
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 bg-gray-50 rounded hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                  {t("dashboard.cancel", "Cancel")}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-gray-500 mb-4">
                {editingItem
                  ? t(
                      "dashboard.noCorrespondingPost",
                      "No corresponding post linked"
                    )
                  : t(
                      "dashboard.saveFirstToLink",
                      "Save the post first to link it to another post"
                    )}
              </div>
              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setShowPostSelector(true);
                    loadAvailablePosts();
                  }}
                  disabled={loadingCorresponding}
                  className="flex items-center gap-2 px-4 py-2 mx-auto text-blue-600 bg-blue-50 rounded hover:bg-blue-100 disabled:opacity-50"
                >
                  <Link2 className="w-4 h-4" />
                  {t("dashboard.linkToPost", "Link to Post")}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Post Selector Modal */}
        {showPostSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {t(
                    "dashboard.selectCorrespondingPost",
                    "Select Corresponding Post"
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPostSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t("dashboard.searchPosts", "Search posts...")}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-96">
                {loadingCorresponding ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-gray-600">
                      {t("dashboard.loading", "Loading...")}
                    </p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? t(
                          "dashboard.noPostsFound",
                          "No posts found matching your search"
                        )
                      : t(
                          "dashboard.noAvailablePosts",
                          "No available posts to link"
                        )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLinkPost(post)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 mb-1">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {post.summary}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                {post.lang === "english"
                                  ? "English"
                                  : "Macedonian"}
                              </span>
                              <span>•</span>
                              <span>{post.publishDate}</span>
                              {post.author && (
                                <>
                                  <span>•</span>
                                  <span>{post.author}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                post.lang === "english"
                                  ? `/en/news/${post.id}`
                                  : `/mk/вести/${post.id}`,
                                "_blank"
                              );
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                          >
                            <Eye className="w-3 h-3" />
                            {t("dashboard.preview", "Preview")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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

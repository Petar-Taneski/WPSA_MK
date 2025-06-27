import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NewsArticle } from "../../services/interfaces";
import { createNewsArticle, updateNewsArticle } from "../../services/api";
import { useAuth } from "../../providers/auth";
import { toast } from "react-toastify";

const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  lang: z.enum(["english", "macedonian"]),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  author: z.string().optional(),
  tags: z.string().optional(),
});

type NewsFormData = z.infer<typeof newsSchema>;

interface EditNewsViewProps {
  editingItem?: NewsArticle;
  onBack: () => void;
  onSuccess: () => void;
}

export const EditNewsView: React.FC<EditNewsViewProps> = ({
  editingItem,
  onBack,
  onSuccess,
}) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
  });

  useEffect(() => {
    if (editingItem) {
      reset({
        title: editingItem.title,
        summary: editingItem.summary,
        content: editingItem.content,
        lang: editingItem.lang as "english" | "macedonian",
        imageUrl: editingItem.imageUrl || "",
        author: editingItem.author || "",
        tags: editingItem.tags?.join(", ") || "",
      });
    } else {
      reset({
        title: "",
        summary: "",
        content: "",
        lang: "english",
        imageUrl: "",
        author: "",
        tags: "",
      });
    }
  }, [editingItem, reset]);

  const onSubmit = async (data: NewsFormData) => {
    if (!user) return;

    try {
      const newsData = {
        ...data,
        imageUrl: data.imageUrl || undefined,
        author: data.author || undefined,
        tags: data.tags
          ? data.tags.split(",").map((tag) => tag.trim())
          : undefined,
      };

      if (editingItem) {
        await updateNewsArticle(editingItem.id, newsData, user.uid);
        toast.success("News article updated successfully!");
      } else {
        await createNewsArticle(newsData, user.uid);
        toast.success("News article created successfully!");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving news article:", error);
      toast.error("Failed to save news article");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {editingItem ? "Edit News Article" : "Create News Article"}
            </h2>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary *
            </label>
            <textarea
              {...register("summary")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief summary of the article..."
            />
            {errors.summary && (
              <p className="text-red-500 text-sm mt-1">
                {errors.summary.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              {...register("content")}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full article content..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language *
              </label>
              <select
                {...register("lang")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="english">English</option>
                <option value="macedonian">Macedonian</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                {...register("author")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Author name (optional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              {...register("imageUrl")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              {...register("tags")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. poultry, industry, news"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : editingItem
                ? "Update Article"
                : "Create Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

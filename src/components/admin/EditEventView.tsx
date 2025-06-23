import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Event } from "../../services/interfaces";
import { createEvent, updateEvent } from "../../services/api";
import { useAuth } from "../../providers/auth";
import { toast } from "react-toastify";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  lang: z.enum(["english", "macedonian"]),
  location: z.string().min(1, "Location is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventEndDate: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isFeatured: z.boolean().optional(),
  formUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EditEventViewProps {
  editingItem?: Event;
  onBack: () => void;
  onSuccess: () => void;
}

export const EditEventView: React.FC<EditEventViewProps> = ({
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
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    if (editingItem) {
      // Convert date strings back to YYYY-MM-DD format for input
      const eventDate = new Date(editingItem.eventDate)
        .toISOString()
        .split("T")[0];
      const eventEndDate = editingItem.eventEndDate
        ? new Date(editingItem.eventEndDate).toISOString().split("T")[0]
        : "";

      reset({
        title: editingItem.title,
        summary: editingItem.summary,
        content: editingItem.content,
        lang: editingItem.lang as "english" | "macedonian",
        location: editingItem.location,
        eventDate,
        eventEndDate,
        imageUrl: editingItem.imageUrl || "",
        isFeatured: editingItem.isFeatured || false,
        formUrl: editingItem.formUrl || "",
      });
    } else {
      reset({
        title: "",
        summary: "",
        content: "",
        lang: "english",
        location: "",
        eventDate: "",
        eventEndDate: "",
        imageUrl: "",
        isFeatured: false,
        formUrl: "",
      });
    }
  }, [editingItem, reset]);

  const onSubmit = async (data: EventFormData) => {
    if (!user) return;

    try {
      const eventData = {
        ...data,
        eventDate: new Date(data.eventDate),
        eventEndDate: data.eventEndDate
          ? new Date(data.eventEndDate)
          : undefined,
        imageUrl: data.imageUrl || undefined,
        formUrl: data.formUrl || undefined,
        isFeatured: data.isFeatured || false,
      };

      if (editingItem) {
        await updateEvent(editingItem.id, eventData, user.uid);
        toast.success("Event updated successfully!");
      } else {
        await createEvent(eventData, user.uid);
        toast.success("Event created successfully!");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
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
              {editingItem ? "Edit Event" : "Create Event"}
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
              placeholder="Brief summary of the event..."
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
              placeholder="Full event description..."
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
                Location *
              </label>
              <input
                {...register("location")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Event location"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                {...register("eventDate")}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.eventDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.eventDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event End Date
              </label>
              <input
                {...register("eventEndDate")}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Registration Form URL
            </label>
            <input
              {...register("formUrl")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/register"
            />
            {errors.formUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.formUrl.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              {...register("isFeatured")}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Featured Event (will be highlighted on homepage)
            </label>
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
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

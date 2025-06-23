import React from "react";
import { NewsArticle, Event } from "../../services/interfaces";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/consts";
import { CalendarDays, MapPin, User, Edit, Trash2 } from "lucide-react";

interface AdminCardNewsProps {
  item: NewsArticle;
  type: "news";
  onEdit: (item: NewsArticle) => void;
  onDelete: (id: string) => void;
}

interface AdminCardEventProps {
  item: Event;
  type: "events";
  onEdit: (item: Event) => void;
  onDelete: (id: string) => void;
}

type AdminCardProps = AdminCardNewsProps | AdminCardEventProps;

export const AdminCard: React.FC<AdminCardProps> = ({
  item,
  type,
  onEdit,
  onDelete,
}) => {
  const isEvent = type === "events";
  const eventItem = item as Event;

  const handleEdit = () => {
    if (type === "news") {
      (onEdit as (item: NewsArticle) => void)(item as NewsArticle);
    } else {
      (onEdit as (item: Event) => void)(item as Event);
    }
  };

  return (
    <div className="py-0 h-fit overflow-hidden transition-all duration-300 rounded-lg shadow-md group hover:shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row max-xl:h-[280px] xl:h-[320px]">
        {/* Image Section */}
        <div className="relative flex items-center justify-center h-64 sm:w-1/3 sm:h-auto bg-gray-50">
          <img
            src={item.imageUrl || DEFAULT_PLACEHOLDER_IMAGE}
            alt={item.title}
            className={`w-full h-full ${
              !item.imageUrl ? "object-contain p-6" : "object-cover"
            }`}
          />

          {/* Date Badge */}
          <div className="absolute top-0 right-0 px-3 py-1 m-3 text-sm font-medium text-white rounded bg-primary/90">
            {isEvent ? eventItem.eventDate : item.publishDate}
          </div>

          {/* Language Badge */}
          <div className="absolute top-0 left-0 px-3 py-1 m-3 text-xs font-medium text-white bg-gray-600 rounded">
            {item.lang === "english" ? "EN" : "MK"}
          </div>

          {/* Featured Badge for Events */}
          {isEvent && eventItem.isFeatured && (
            <div className="absolute bottom-0 left-0 px-3 py-1 m-3 text-xs font-medium text-white transform bg-yellow-500 rounded -rotate-12">
              Featured
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col sm:w-2/3 h-auto sm:h-[280px] xl:h-[320px]">
          {/* Scrollable Content Area */}
          <div className="flex-1 p-5 overflow-y-auto min-h-0">
            {/* Title */}
            <h2 className="mb-3 text-xl font-semibold text-gray-800 line-clamp-2">
              {item.title}
            </h2>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-1 flex-shrink-0" />
                {isEvent
                  ? `Event: ${eventItem.eventDate}`
                  : `Published: ${item.publishDate}`}
              </div>

              {isEvent && eventItem.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  {eventItem.location}
                </div>
              )}

              {!isEvent && (item as NewsArticle).author && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1 flex-shrink-0" />
                  {(item as NewsArticle).author}
                </div>
              )}
            </div>

            {/* Summary - Now scrollable instead of line-clamped */}
            <div className="mb-4">
              <p className="text-gray-600 leading-relaxed">{item.summary}</p>
            </div>

            {/* Content Preview - Show first part of content */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Content Preview:
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.content.substring(0, 200)}
                {item.content.length > 200 && "..."}
              </p>
            </div>

            {/* Tags */}
            {((isEvent && eventItem.formUrl) ||
              (!isEvent && (item as NewsArticle).tags)) && (
              <div className="mb-4">
                {isEvent && eventItem.formUrl ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                    Has Registration Form
                  </span>
                ) : (
                  (item as NewsArticle).tags && (
                    <div className="flex flex-wrap gap-1">
                      {(item as NewsArticle).tags!.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {(item as NewsArticle).tags!.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{(item as NewsArticle).tags!.length - 3} more
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Fixed Action Buttons Footer - Takes up actual space */}
          <div className="border-t border-gray-100 p-4 bg-gray-50/50">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

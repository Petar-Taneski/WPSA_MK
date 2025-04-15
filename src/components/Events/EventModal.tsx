import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../../data/eventData";
import ArrowButton from "../common/ArrowButton";
import { useTranslation } from "react-i18next";
import { CalendarDays, MapPin, Clock, Award } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { t, i18n } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow value
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Disable scrolling on body
      document.body.style.overflow = "hidden";

      // Re-enable scrolling when component unmounts or modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !event) return null;

  // Format event dates
  const eventDate = new Date(event.eventDate);
  const publishDate = new Date(event.publishDate);

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-gray-800/50 overflow-y-auto p-4"
      onClick={handleClickOutside}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto z-[1002] relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800/85 pr-8">
            {event.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("common.close")}
          >
            ✕
          </button>
        </div>

        <div className="w-full text-gray-800/85">
          {/* Featured Badge */}
          {event.isFeatured && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Award className="w-3 h-3 mr-1" />
                Featured Event
              </span>
            </div>
          )}

          {/* Event Image */}
          <div className="w-full h-64 mb-6 overflow-hidden rounded-md">
            <img
              src={event.imageUrl || "/placeholder.jpg"}
              alt={event.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Event Meta Information */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <CalendarDays className="w-5 h-5 mr-2 text-primary" />
              <span>{formatDate(event.eventDate)}</span>
            </div>

            {event.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                <span>{event.location}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              <span>Published: {formatDate(event.publishDate)}</span>
            </div>
          </div>

          {/* Event Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Summary
            </h3>
            <p className="text-gray-700">{event.summary}</p>
          </div>

          {/* Event Content */}
          <div className="mb-8 prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Details
            </h3>
            <div className="markdown-content">{event.content}</div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-8">
            <ArrowButton
              text={event.callToAction || t("events.applyNow")}
              onClick={() => {
                window.open("/", "_blank");
                onClose();
              }}
              className="px-6 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;

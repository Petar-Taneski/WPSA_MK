import { Event } from "@/services/interfaces";
import ArrowButton from "../common/ArrowButton";
import { useTranslation } from "react-i18next";
import { CalendarDays, MapPin, Clock, Award, Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const [urlCopied, setUrlCopied] = useState(false);

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setUrlCopied(true);
        setTimeout(() => {
          setUrlCopied(false);
        }, 3000); // Reset after 3 seconds
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
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

  // Reset share state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUrlCopied(false);
    }
  }, [isOpen]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !event) return null;

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
          <h2 className="pr-8 text-xl font-bold text-gray-800/85">
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
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
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
              <span>{event.eventDate}</span>
            </div>

            {event.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                <span>{event.location}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              <span>Published: {event.publishDate}</span>
            </div>
          </div>

          {/* Copy URL Button */}
          <div className="my-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center px-3 py-1.5 text-sm border border-primary rounded-md hover:bg-primary/10 transition-colors"
              aria-label={urlCopied ? "URL copied" : "Copy event URL"}
            >
              {urlCopied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t("common.copied", "Copied!")}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t("common.copyLink", "Copy Link")}
                </>
              )}
            </button>
          </div>

          {/* Event Summary */}
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              Summary
            </h3>
            <p className="text-gray-700">{event.summary}</p>
          </div>

          {/* Event Content */}
          <div className="mb-8 prose-sm prose max-w-none">
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
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

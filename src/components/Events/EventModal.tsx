import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../../data/eventData";
import ArrowButton from "../common/ArrowButton";
import { useTranslation } from "react-i18next";
import { CalendarDays, MapPin, Clock, Award, Share2, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { FacebookShareButton, LinkedinShareButton } from "react-share";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { t, i18n } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  // Current URL to share
  const currentURL = typeof window !== "undefined" ? window.location.href : "";

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
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

  // Reset share state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShareOpen(false);
      setUrlCopied(false);
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

          {/* Share Functionality */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShareOpen(!shareOpen)}
                className="flex items-center justify-center px-3 py-1.5 text-sm border border-primary rounded-md hover:bg-primary/10 transition-colors"
                aria-label="Share this event"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t("common.share", "Share")}
              </button>

              {/* Social Media Sharing */}
              {shareOpen && (
                <div className="flex items-center space-x-2">
                  <FacebookShareButton url={currentURL}>
                    <div className="flex items-center justify-center p-1.5 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors">
                      <span className="text-sm font-medium">Facebook</span>
                    </div>
                  </FacebookShareButton>

                  <LinkedinShareButton url={currentURL}>
                    <div className="flex items-center justify-center p-1.5 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-700 hover:text-white transition-colors">
                      <span className="text-sm font-medium">LinkedIn</span>
                    </div>
                  </LinkedinShareButton>

                  <button
                    onClick={() => copyToClipboard(currentURL)}
                    className="flex items-center justify-center p-1.5 border border-gray-500 text-gray-500 rounded-md hover:bg-gray-500 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">
                      {urlCopied
                        ? t("common.copied", "Copied!")
                        : t("common.copyLink", "Copy Link")}
                    </span>
                  </button>
                </div>
              )}
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

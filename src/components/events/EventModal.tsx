import { parseDateString } from "@/lib/utils";
import { Event } from "@/services/interfaces";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/consts";
import {
  Award,
  CalendarDays,
  Check,
  Clock,
  Copy,
  MapPin,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowButton from "../common/ArrowButton";
import ReactQuill from "react-quill-new";
// import ReactQuill from "react-quill-new";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { t, i18n } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const [urlCopied, setUrlCopied] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    altText: string;
    index: number;
  } | null>(null);

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

  // Handle image click to open lightbox
  const handleImageClick = (
    photo: { url: string; altText: string },
    index: number
  ) => {
    setLightboxImage({ ...photo, index });
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Navigate to previous image
  const previousImage = () => {
    if (!lightboxImage || !event?.gallery) return;
    const galleryLength = event.gallery.length;
    const newIndex =
      lightboxImage.index > 0 ? lightboxImage.index - 1 : galleryLength - 1;
    const newPhoto = event.gallery[newIndex];
    setLightboxImage({
      url: newPhoto.url,
      altText: newPhoto.altText,
      index: newIndex,
    });
  };

  // Navigate to next image
  const nextImage = () => {
    if (!lightboxImage || !event?.gallery) return;
    const galleryLength = event.gallery.length;
    const newIndex =
      lightboxImage.index < galleryLength - 1 ? lightboxImage.index + 1 : 0;
    const newPhoto = event.gallery[newIndex];
    setLightboxImage({
      url: newPhoto.url,
      altText: newPhoto.altText,
      index: newIndex,
    });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return;

      switch (e.key) {
        case "Escape":
          e.stopPropagation();
          closeLightbox();
          break;
        case "ArrowLeft":
          e.stopPropagation();
          previousImage();
          break;
        case "ArrowRight":
          e.stopPropagation();
          nextImage();
          break;
      }
    };

    if (lightboxImage) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxImage]);

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

  // Additional body scroll management for lightbox
  useEffect(() => {
    if (lightboxImage) {
      // Ensure body scroll is disabled when lightbox is open
      document.body.style.overflow = "hidden";
    } else if (isOpen) {
      // Keep body scroll disabled when modal is open but lightbox is closed
      document.body.style.overflow = "hidden";
    }
  }, [lightboxImage, isOpen]);

  // Reset share state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUrlCopied(false);
      setLightboxImage(null);
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="pr-8 text-xl font-bold text-gray-800/85">
            {event.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("common.close", "Close")}
          >
            ✕
          </button>
        </div>

        <div className="w-full text-gray-800/85">
          {event.isFeatured && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                <Award className="mr-1 w-3 h-3" />
                {t("events.featured", "Featured")}
              </span>
            </div>
          )}

          <div className="flex overflow-hidden justify-center items-center mb-6 w-full h-full bg-gray-50 rounded-md">
            <img
              src={event.imageUrl || DEFAULT_PLACEHOLDER_IMAGE}
              alt={event.title}
              className={`w-full h-full ${
                !event.imageUrl ? "object-contain p-8" : "object-fill"
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <CalendarDays className="mr-2 w-5 h-5 text-primary" />
              <span>
                {(() => {
                  const startParsed = parseDateString(event.eventDate);
                  const startDate = startParsed
                    ? startParsed.toLocaleDateString(i18n.language, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : event.eventDate;

                  if (event.eventEndDate) {
                    const endParsed = parseDateString(event.eventEndDate);
                    const endDate = endParsed
                      ? endParsed.toLocaleDateString(i18n.language, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : event.eventEndDate;
                    return `${startDate} - ${endDate}`;
                  }

                  return startDate;
                })()}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-2 w-5 h-5 text-primary" />
                <span>{event.location}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <Clock className="mr-2 w-5 h-5 text-primary" />
              <span>
                {t("events.published", "Published")}:{" "}
                {(() => {
                  const parsed = parseDateString(event.publishDate);
                  return parsed
                    ? parsed.toLocaleDateString(i18n.language, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : event.publishDate;
                })()}
              </span>
            </div>
          </div>

          <div className="my-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center px-3 py-1.5 text-sm border border-primary rounded-md hover:bg-primary/10 transition-colors"
              aria-label={
                urlCopied
                  ? t("common.copied", "Copied!")
                  : t("common.copyLink", "Copy Link")
              }
            >
              {urlCopied ? (
                <>
                  <Check className="mr-2 w-4 h-4" />
                  {t("common.copied", "Copied!")}
                </>
              ) : (
                <>
                  <Copy className="mr-2 w-4 h-4" />
                  {t("common.copyLink", "Copy Link")}
                </>
              )}
            </button>
          </div>

          <div className="mb-8 max-w-none prose-sm prose">
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              {t("events.details", "Details")}
            </h3>

            <div className="max-w-3xl prose prose-lg" />
            <ReactQuill
              theme="bubble"
              readOnly={true}
              value={event.content}
              className="px-4 custom-quill markdown-content"
            />
          </div>

          {/* Real gallery (when it exists) */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="flex flex-col items-center px-4 my-6 mb-6 w-full">
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                {t("events.gallery", "Gallery")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.gallery.map((photo, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer group/photo"
                    onClick={() => handleImageClick(photo, index)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.altText}
                      className="object-cover w-16 h-16 rounded-md transition-opacity sm:w-20 sm:h-20 hover:opacity-90"
                    />
                    <div className="flex absolute inset-0 justify-center items-center rounded-md opacity-0 transition-opacity bg-black/50 group-hover/photo:opacity-100">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.links && event.links.length > 0 && (
            <div className="px-4 mt-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                {t("post.relatedLinks", "Related Links")}
              </h3>
              <div className="space-y-2">
                {event.links.map((link, index) => (
                  <div
                    key={index}
                    className="flex gap-3 pl-4 border-l-4 border-primary-600"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-center mt-8">
            {event.formUrl && (
              <a href={event.formUrl} target="_blank">
                <ArrowButton
                  text={t("events.applyNow")}
                  onClick={() => {}}
                  className="px-6 py-2"
                />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox for full-size images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/90"
          onClick={(e) => {
            e.stopPropagation();
            closeLightbox();
          }}
        >
          <div
            className="flex relative justify-center items-center p-4 w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.altText}
              className="object-contain max-w-full max-h-full"
              style={{
                maxWidth: "calc(100vw - 8rem)",
                maxHeight: "calc(100vh - 8rem)",
              }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 p-2 text-white transition-colors hover:text-gray-300"
              aria-label={t("common.close", "Close")}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {event?.gallery && event.gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previousImage();
                  }}
                  className="absolute left-4 top-1/2 p-2 text-white transition-colors transform -translate-y-1/2 hover:text-gray-300"
                  aria-label={t("common.previous", "Previous")}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 p-2 text-white transition-colors transform -translate-y-1/2 hover:text-gray-300"
                  aria-label={t("common.next", "Next")}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 px-3 py-1 text-sm text-white rounded-md transform -translate-x-1/2 bg-black/50">
              {lightboxImage.index + 1} / {event?.gallery?.length || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModal;

import { useState, useEffect, useRef } from "react";
import ArrowButton from "../common/ArrowButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CalendarDays, MapPin } from "lucide-react";
import { Event } from "@/services/interfaces";
import { fetchEventsFromFirebase } from "@/services/api";
import EventModal from "../events/EventModal";

interface EventCarouselProps {
  onEventClick?: (event: Event) => void;
}

const EventCarousel = ({ onEventClick }: EventCarouselProps) => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const timerRef = useRef<number | null>(null);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

  useEffect(() => {
    window.onpopstate = () => {
      setIsModalOpen(false);
      setSelectedEvent(null);
    };
  }, []);

  // Get only featured events for the carousel
  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      const featuredEvents = await fetchEventsFromFirebase({
        lang: i18n.language,
        isFeatured: true,
      });
      setFeaturedEvents(featuredEvents);
    };
    fetchFeaturedEvents();
  }, [i18n.language]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === featuredEvents.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredEvents.length - 1 : prev - 1
    );
  };

  // Handle click on event CTA button
  const handleEventClick = (event: Event) => {
    if (onEventClick) {
      // If we're on the events page, use the provided click handler
      onEventClick(event);
    } else {
      // Get the current language from the path
      const language = i18n.language || "en";
      // Get the events path based on language
      const eventsPath = t("pages.events", { lng: language });
      const newUrl = `/${language}/${eventsPath}?event=${encodeURIComponent(
        event.id
      )}`;
      window.history.pushState({}, "", newUrl);
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  // Setup auto-scroll
  useEffect(() => {
    if (!isPaused && featuredEvents.length > 1) {
      timerRef.current = window.setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, featuredEvents.length]);

  // Calculate slide positions
  const getSlidePosition = (index: number) => {
    // Current slide centered (0), others positioned relatively
    const position = index - currentSlide;

    // Handle wrapping for continuous carousel effect
    if (position < -2) return position + featuredEvents.length;
    if (position > 2) return position - featuredEvents.length;

    return position;
  };

  // If no featured events, don't render the carousel
  if (featuredEvents.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Section Heading */}
      <div className="container px-6 mx-auto mb-12">
        <h2 className="mb-3 text-3xl font-bold text-center md:text-4xl text-primary/85">
          {t("events.upcomingEvents")}
        </h2>
        <p className="max-w-2xl mx-auto text-center text-slate-700/80">
          {t("events.eventsDescription")}
        </p>
        <div className="w-24 h-1 mx-auto mt-4 rounded bg-primary"></div>
      </div>

      {/* Carousel container */}
      <div
        className="relative h-[450px] sm:h-[480px] md:h-[500px] w-full mx-auto max-w-7xl px-4 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides */}
        {featuredEvents.map((event, index) => {
          const position = getSlidePosition(index);
          const eventDate = new Date(event.eventDate);
          const formattedDate = eventDate.toLocaleDateString(i18n.language, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <div
              key={event.id}
              className={`absolute inset-0 mx-auto max-w-6xl transition-all duration-700 ease-in-out ${
                position === 0
                  ? "opacity-100 z-10 transform-none"
                  : "opacity-0 z-0 scale-95"
              }`}
              style={{
                transform: `translateX(${position * 110}%)`, // Increased spacing between slides
                opacity:
                  Math.abs(position) <= 1 ? 1 - Math.abs(position) * 0.7 : 0,
                zIndex: position === 0 ? 10 : 10 - Math.abs(position),
              }}
            >
              <div className="relative h-full mx-4 overflow-hidden bg-white border rounded-sm shadow-lg border-slate-200">
                {/* Background Image */}
                <div
                  className="absolute inset-0 w-full h-full bg-center bg-cover"
                  style={{ backgroundImage: `url(${event.imageUrl})` }}
                ></div>

                {/* Content overlay with blur effect */}
                <div className="absolute inset-0 flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-10">
                  <div className="relative z-10 w-full p-4 text-white border shadow-lg sm:p-6 md:p-8 backdrop-blur-md bg-primary/40 rounded-xl border-white/10 sm:w-4/5 md:max-w-md">
                    <div className="flex flex-wrap gap-3 mb-3 sm:mb-6">
                      <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full sm:text-sm bg-white/20 backdrop-blur-sm w-fit">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        {formattedDate}
                      </div>
                      {event.location && (
                        <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full sm:text-sm bg-white/20 backdrop-blur-sm w-fit">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location.split(",")[0]}
                        </div>
                      )}
                    </div>
                    <h3 className="mb-2 text-xl font-bold tracking-tight sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl">
                      {event.title}
                    </h3>
                    <p className="mb-4 text-sm sm:mb-8 sm:text-base text-slate-100">
                      {event.summary}
                    </p>
                    <div className="mt-auto">
                      <ArrowButton
                        className="text-sm bg-white hover:scale-105 text-primary sm:text-base"
                        text={event.callToAction || t("events.applyNow")}
                        onClick={() => handleEventClick(event)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows - Only show if more than one event */}
        {featuredEvents.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute z-20 p-2 transition-all duration-300 -translate-y-1/2 rounded-full cursor-pointer sm:p-3 md:p-4 left-2 sm:left-4 md:left-8 top-1/2 bg-white/70 hover:bg-white/90 backdrop-blur-sm text-slate-800 hover:shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute z-20 p-2 transition-all duration-300 -translate-y-1/2 rounded-full cursor-pointer sm:p-3 md:p-4 right-2 sm:right-4 md:right-8 top-1/2 bg-white/70 hover:bg-white/90 backdrop-blur-sm text-slate-800 hover:shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Indicator Dots - Only show if more than one event */}
        {featuredEvents.length > 1 && (
          <div className="absolute left-0 right-0 z-20 flex justify-center gap-2 bottom-4">
            {featuredEvents.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          // Remove query parameter when closing modal

          const url = new URL(window.location.href);
          url.searchParams.delete("event");
          window.history.pushState({}, "", url);
        }}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventCarousel;

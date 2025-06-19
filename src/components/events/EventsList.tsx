import { Event } from "@/services/interfaces";
import { CalendarDays, MapPin } from "lucide-react";
import ArrowButton from "../common/ArrowButton";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/consts";
import { useTranslation } from "react-i18next";

interface EventsListProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const EventsList = ({ events, onEventClick }: EventsListProps) => {
  const { i18n, t } = useTranslation();
  const handleEventClick = (event: Event) => {
    if (onEventClick) {
      onEventClick(event);
    } else {
      history.pushState(
        null,
        "",
        `/events?event=${encodeURIComponent(event.id)}`
      );
    }
  };

  return (
    <div className="space-y-6 border ">
      {events.map((event) => (
        <div
          key={event.id}
          className="py-0 max-h-[300px] overflow-clip transition-all duration-300 rounded-sm shadow-md group hover:shadow-lg"
        >
          <div className="flex flex-col sm:flex-row h-fit max-md:h-[220px]">
            <div
              className="relative flex items-center justify-center h-48 cursor-pointer sm:w-1/3 sm:h-full bg-gray-50"
              onClick={() => handleEventClick(event)}
            >
              <img
                src={
                  event.imageUrl ||
                  DEFAULT_PLACEHOLDER_IMAGE
                }
                alt={event.title}
                className={`w-full h-full ${!event.imageUrl
                    ? "object-contain p-6"
                    : "object-cover"
                }`}
              />
              <div className="absolute top-0 right-0 px-3 py-1 m-3 text-sm font-medium text-white rounded bg-primary/90">
                {event.eventDate}
              </div>
              {event.isFeatured && (
                <div className="absolute top-0 left-0 px-3 py-1 m-3 text-xs font-medium text-white transform bg-yellow-500 rounded -rotate-12">
                  {t("events.featured")}
                </div>
              )}
            </div>
            <div className="flex flex-col p-5 h-fit sm:w-2/3">
              <h2 className="mb-2 text-xl font-semibold text-gray-800 line-clamp-2">
                {event.title}
              </h2>

              <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  {event.eventDate}
                </div>
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </div>
                )}
              </div>

              <p className="mb-4 text-gray-600 line-clamp-2">{event.summary}</p>

              <div className="flex items-center justify-end mt-auto">
                <ArrowButton
                  text={
                    event.formUrl
                      ? event.formUrl
                      : i18n.language === "mk"
                      ? "Прочитај повеќе"
                      : "Learn More"
                  }
                  onClick={() => handleEventClick(event)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;

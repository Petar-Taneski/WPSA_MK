import { Event } from "@/services/interfaces";
import { CalendarDays, MapPin } from "lucide-react";
import ArrowButton from "../common/ArrowButton";

interface EventsListProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const EventsList = ({ events, onEventClick }: EventsListProps) => {
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
    <div className="space-y-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="group shadow-md rounded-sm overflow-hidden py-0 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex flex-col sm:flex-row h-fit sm:h-[220px]">
            <div
              className="sm:w-1/3 h-48 sm:h-full relative cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <img
                src={event.thumbnailUrl || event.imageUrl || "/placeholder.jpg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 bg-primary/90 text-white px-3 py-1 m-3 rounded text-sm font-medium">
                {event.eventDate}
              </div>
              {event.isFeatured && (
                <div className="absolute top-0 left-0 bg-yellow-500 text-white px-3 py-1 m-3 rounded text-xs font-medium transform -rotate-12">
                  Featured
                </div>
              )}
            </div>
            <div className="sm:w-2/3 p-5 flex flex-col">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
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

              <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                {event.summary}
              </p>

              <div className="flex justify-end items-center mt-auto">
                <ArrowButton
                  text={event.callToAction || "Learn More"}
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

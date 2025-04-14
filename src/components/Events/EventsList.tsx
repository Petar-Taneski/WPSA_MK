import { useNavigate } from "react-router-dom";
import ArrowButton from "../common/ArrowButton";
import { EventSlide } from "../Home/EventCarousel";

interface EventsListProps {
  events: EventSlide[];
}

const EventsList = ({ events }: EventsListProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="group shadow-md rounded-sm overflow-hidden py-0 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex flex-col sm:flex-row h-fit sm:h-[200px]">
            <div className="sm:w-1/3 h-48 sm:h-full relative">
              <img
                src={event.image || "/placeholder.jpg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 bg-primary/90 text-white px-3 py-1 m-3 rounded text-sm font-medium">
                {formatDate(event.date)}
              </div>
            </div>
            <div className="sm:w-2/3 p-5 flex flex-col">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                {event.title}
              </h2>

              <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                {event.description}
              </p>

              <div className="flex justify-end items-center mt-auto">
                <ArrowButton
                  text={event.ctaText}
                  onClick={() => navigate(event.ctaLink)}
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

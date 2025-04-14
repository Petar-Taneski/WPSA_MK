import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EventSlide } from "../Home/EventCarousel";
import ArrowButton from "../common/ArrowButton";

interface EventCardProps {
  event: EventSlide;
  isPast?: boolean;
}

const EventCard = ({ event }: EventCardProps) => {
  const { id, title, description, date, image, ctaText, ctaLink } = event;
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const getEventUrl = () => {
    const currentLanguage = i18n.language;
    return currentLanguage === "mk" ? `/mk/настани/${id}` : `/en/events/${id}`;
  };

  const displayImageUrl = image || "/placeholder.jpg";
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="block h-full focus:outline-none focus:ring-2 focus:ring-primary/50"
      tabIndex={0}
      role="link"
      aria-label={`View event: ${title}`}
    >
      <div className="group bg-white h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div
          onClick={() => navigate(getEventUrl())}
          className="relative h-48 max-md:h-80 overflow-hidden cursor-pointer"
        >
          <img
            src={displayImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
          />
          <div className="absolute top-0 right-0 bg-primary/90 text-white px-3 py-1 m-3 rounded text-sm font-medium">
            {formattedDate}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800/85 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600/80 line-clamp-3 flex-grow mb-4 leading-relaxed">
            {description}
          </p>
          <div className="mt-auto pt-3 flex justify-end">
            <ArrowButton
              text={ctaText}
              onClick={() => navigate(ctaLink)}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

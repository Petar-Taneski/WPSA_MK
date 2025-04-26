import { Event } from "@/services/interfaces";
import { useTranslation } from "react-i18next";
import EmptyState from "../News/EmptyState";
import EventsList from "./EventsList";

interface EventsListContainerProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  filter: "all" | "upcoming" | "past";
  setFilter: (filter: "all" | "upcoming" | "past") => void;
}

const EventsListContainer = ({ events, filter, setFilter, onEventClick }: EventsListContainerProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Filter Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 sm:justify-start">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          {t("events.filterAll")}
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "upcoming"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilter("upcoming")}
        >
          {t("events.filterUpcoming")}
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "past"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilter("past")}
        >
          {t("events.filterPast")}
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <EventsList events={events} onEventClick={onEventClick} />
      )}
    </div>
  );
};

export default EventsListContainer;

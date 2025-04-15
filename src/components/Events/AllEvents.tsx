import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Event } from "../../data/eventData";
import EventsList from "./EventsList";
import {
  getUpcomingEvents,
  getPastEvents,
  sortEventsByDate,
} from "../../data/eventData";
import EmptyState from "../News/EmptyState";

interface AllEventsProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const AllEvents = ({ events, onEventClick }: AllEventsProps) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const upcomingEvents = sortEventsByDate(getUpcomingEvents(events));
  const pastEvents = sortEventsByDate(getPastEvents(events));

  const filteredEvents =
    filter === "all"
      ? sortEventsByDate(events)
      : filter === "upcoming"
      ? upcomingEvents
      : pastEvents;

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
      {filteredEvents.length === 0 ? (
        <EmptyState />
      ) : (
        <EventsList events={filteredEvents} onEventClick={onEventClick} />
      )}
    </div>
  );
};

export default AllEvents;

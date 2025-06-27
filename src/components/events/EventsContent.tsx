import { useTranslation } from "react-i18next";
import EventCarousel from "../home/EventCarousel";
import { useState, useEffect } from "react";
import LoadingState from "../news/LoadingState";
import { useLocation } from "react-router-dom";
import { fetchEventFromFirebase, fetchEventsChunk } from "../../services/api";
import EventsListContainer from "./EventsListContainer";
import EventModal from "./EventModal";
import { Event } from "@/services/interfaces";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

const EventsContent = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const location = useLocation();

  const PAGE_SIZE = 5; // 5 events per page

  useEffect(() => {
    window.onpopstate = () => {
      setIsModalOpen(false);
      setSelectedEvent(null);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventId = params.get("event");

    if (eventId) {
      const fetchModalEvent = async () => {
        try {
          setIsModalOpen(true);
          const modalEvent = await fetchEventFromFirebase(
            eventId,
            i18n.language
          );

          if (modalEvent) {
            setSelectedEvent(modalEvent);
          }
        } catch (error) {
          setIsModalOpen(false);
          setSelectedEvent(null);
          console.error("Error fetching modal event:", error);
          setError(t("events.errorLoading"));
        }
      };

      fetchModalEvent();
    }
  }, []);

  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);

    const params = new URLSearchParams(location.search);
    params.set("event", encodeURIComponent(event.id));
    window.history.pushState(
      {},
      "",
      `${location.pathname}?${params.toString()}`
    );
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);

    const params = new URLSearchParams(location.search);
    params.delete("event");
    window.history.pushState(
      {},
      "",
      `${location.pathname}?${params.toString()}`
    );
  };

  // Function to fetch initial events (reset pagination)
  const fetchInitialEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchEventsChunk(i18n.language, PAGE_SIZE);

      // Filter events based on current filter
      const filteredEvents = filterEventsByType(result.items, filter);

      setEvents(filteredEvents);
      setLastDoc(result.lastDoc || null);
      setHasMoreEvents(result.items.length === PAGE_SIZE);

      // Handle modal event from URL
      const params = new URLSearchParams(location.search);
      const eventTitle = params.get("event");

      if (eventTitle) {
        const foundEvent = filteredEvents.find(
          (event) =>
            event.title.toLowerCase() ===
            decodeURIComponent(eventTitle).toLowerCase()
        );

        if (foundEvent) {
          setSelectedEvent(foundEvent);
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(t("events.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  // Function to load more events
  const loadMoreEvents = async () => {
    if (!lastDoc || loadingMore) return;

    try {
      setLoadingMore(true);

      const result = await fetchEventsChunk(i18n.language, PAGE_SIZE, lastDoc);

      // Filter new events based on current filter
      const filteredNewEvents = filterEventsByType(result.items, filter);

      setEvents((prev) => [...prev, ...filteredNewEvents]);
      setLastDoc(result.lastDoc || null);
      setHasMoreEvents(result.items.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error loading more events:", error);
      setError(t("events.errorLoading"));
    } finally {
      setLoadingMore(false);
    }
  };

  // Helper function to filter events by type
  const filterEventsByType = (
    eventsList: Event[],
    filterType: "all" | "upcoming" | "past"
  ): Event[] => {
    if (filterType === "all") return eventsList;

    const now = new Date();

    return eventsList.filter((event) => {
      const eventDate = new Date(event.eventDate);

      if (filterType === "upcoming") {
        return eventDate >= now;
      } else if (filterType === "past") {
        return eventDate < now;
      }

      return true;
    });
  };

  // Reset pagination when language or filter changes
  useEffect(() => {
    setEvents([]);
    setLastDoc(null);
    setHasMoreEvents(true);
    fetchInitialEvents();
  }, [i18n.language, filter]);

  return (
    <div className="pt-8 pb-16 events-page">
      <EventCarousel onEventClick={openEventModal} />

      <div className="pt-12">
        <div className="w-full px-4 lg:px-20 sm:px-10">
          <h2 className="mb-8 text-3xl font-bold text-slate-800/90">
            {t("events.allEvents")}
          </h2>

          {loading && <LoadingState />}

          {error && !loading && (
            <div className="p-4 text-red-700 border border-red-200 rounded-md bg-red-50">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <EventsListContainer
                events={events}
                filter={filter}
                setFilter={setFilter}
                onEventClick={openEventModal}
              />

              {/* Load More Button */}
              {hasMoreEvents && events.length > 0 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMoreEvents}
                    disabled={loadingMore}
                    className="px-6 py-3 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {t("common.loading")}
                      </span>
                    ) : (
                      t("events.loadMore")
                    )}
                  </button>
                </div>
              )}

              {/* No more events message */}
              {!hasMoreEvents && events.length > 0 && (
                <div className="text-center mt-8 text-gray-500">
                  {t("events.noMoreEvents")}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={closeEventModal}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventsContent;

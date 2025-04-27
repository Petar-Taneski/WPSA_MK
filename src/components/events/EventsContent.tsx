import { useTranslation } from "react-i18next";
import EventCarousel from "../home/EventCarousel";
import { useState, useEffect } from "react";
import LoadingState from "../news/LoadingState";
import { useLocation } from "react-router-dom";
import {
  fetchEventFromFirebase,
  fetchEventsFromFirebase,
} from "../../services/api";
import EventsListContainer from "./EventsListContainer";
import EventModal from "./EventModal";
import { Event } from "@/services/interfaces";

const EventsContent = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const location = useLocation();

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
          const modalEvent = await fetchEventFromFirebase(eventId, i18n.language);

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await fetchEventsFromFirebase({
          lang: i18n.language,
          filter: filter,
        });
        setEvents(fetchedEvents);

        const params = new URLSearchParams(location.search);
        const eventTitle = params.get("event");

        if (eventTitle) {
          const foundEvent = fetchedEvents.find(
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

    fetchEvents();
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
            <EventsListContainer
              events={events}
              filter={filter}
              setFilter={setFilter}
              onEventClick={openEventModal}
            />
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

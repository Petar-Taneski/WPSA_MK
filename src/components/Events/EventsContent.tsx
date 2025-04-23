import { useTranslation } from "react-i18next";
import EventCarousel from "../Home/EventCarousel";
import { useState, useEffect } from "react";
import LoadingState from "../News/LoadingState";
import { useNavigate, useLocation } from "react-router-dom";

// Get events from the data file
import { events as eventData, Event } from "../../data/eventData";
import AllEvents from "./AllEvents";
import EventModal from "./EventModal";

const EventsContent = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if there's an event in the URL that should open a modal
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventTitle = params.get("event");

    if (eventTitle && loading) {
      // If we have an event in URL but data is still loading, show modal loading state
      setModalLoading(true);
    } else {
      setModalLoading(false);
    }
  }, [location.search, loading]);

  // Helper function to find event by title
  const findEventByTitle = (title: string): Event | undefined => {
    return events.find(
      (event) =>
        event.title.toLowerCase() === decodeURIComponent(title).toLowerCase()
    );
  };

  // Check for event title in URL params on component mount
  useEffect(() => {
    if (events.length > 0) {
      const params = new URLSearchParams(location.search);
      const eventTitle = params.get("event");

      if (eventTitle) {
        const foundEvent = findEventByTitle(eventTitle);
        if (foundEvent) {
          setSelectedEvent(foundEvent);
          setIsModalOpen(true);
        }
      }
    }
  }, [location.search, events]);

  // Function to open the modal with specific event
  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);

    // Update URL with event title as query parameter
    const params = new URLSearchParams(location.search);
    params.set("event", encodeURIComponent(event.title));
    navigate({ search: params.toString() }, { replace: true });
  };

  // Function to close the modal
  const closeEventModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);

    // Remove event query parameter from URL
    const params = new URLSearchParams(location.search);
    params.delete("event");
    navigate({ search: params.toString() }, { replace: true });
  };

  // Simulate fetching events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // In a real application, this would be an API call
        // For now, we're just using the hardcoded events with a simulated delay
        setTimeout(() => {
          setEvents(eventData);
          setLoading(false);

          // Check for event in URL after loading events
          const params = new URLSearchParams(location.search);
          const eventTitle = params.get("event");

          if (eventTitle) {
            const foundEvent = eventData.find(
              (event) =>
                event.title.toLowerCase() ===
                decodeURIComponent(eventTitle).toLowerCase()
            );

            if (foundEvent) {
              setSelectedEvent(foundEvent);
              setIsModalOpen(true);
            }
          }
        }, 800);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Error loading events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, [location.search]);

  return (
    <div className="events-page pt-8 pb-16">
      {/* Featured Events Carousel */}
      <EventCarousel onEventClick={openEventModal} />

      {/* All Events Section */}
      <div className="pt-12">
        <div className="w-full lg:px-20 sm:px-10 px-4">
          <h2 className="text-3xl font-bold text-slate-800/90 mb-8">
            {t("events.allEvents")}
          </h2>

          {loading && <LoadingState />}

          {error && !loading && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <AllEvents events={events} onEventClick={openEventModal} />
          )}
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={closeEventModal}
        event={selectedEvent}
      />

      {/* Modal Loading Overlay */}
      {modalLoading && (
        <div className="fixed inset-0 z-[1002] flex items-center justify-center bg-gray-800/50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 font-medium">
              {t("events.loadingEvent")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsContent;

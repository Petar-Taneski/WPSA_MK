import { useTranslation } from "react-i18next";
import EventCarousel from "../Home/EventCarousel";
import { useState, useEffect } from "react";
import { EventSlide } from "../Home/EventCarousel";
import LoadingState from "../News/LoadingState";

// Get events from the carousel for now - in a real app these would come from an API
import { eventSlides } from "../../data/eventData";
import AllEvents from "./AllEvents";

const EventsContent = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventSlide[]>([]);

  // Simulate fetching events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // In a real application, this would be an API call
        // For now, we're just using the hardcoded event slides with a simulated delay
        setTimeout(() => {
          setEvents(eventSlides);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Error loading events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      {/* Featured Events Carousel */}
      <EventCarousel />

      {/* All Events Section */}
      <div className="bg-slate-50 py-12">
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

          {!loading && !error && <AllEvents events={events} />}
        </div>
      </div>
    </div>
  );
};

export default EventsContent;

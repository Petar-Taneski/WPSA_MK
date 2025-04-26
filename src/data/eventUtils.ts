import { Event } from "@/services/interfaces";

// Helper function to sort events by date (newest first)
export const sortEventsByDate = (events: Event[]): Event[] => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.eventDate);
    const dateB = new Date(b.eventDate);
    return dateB.getTime() - dateA.getTime();
  });
};

// Helper function to get upcoming events
export const getUpcomingEvents = (events: Event[]): Event[] => {
  const today = new Date();
  return events.filter((event) => new Date(event.eventDate) >= today);
};

// Helper function to get past events
export const getPastEvents = (events: Event[]): Event[] => {
  const today = new Date();
  return events.filter((event) => new Date(event.eventDate) < today);
};

// Helper function to get featured events
export const getFeaturedEvents = (events: Event[]): Event[] => {
  return events.filter((event) => event.isFeatured);
};

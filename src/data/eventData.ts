import { EventSlide } from "../components/Home/EventCarousel";

export const eventSlides: EventSlide[] = [
  {
    id: 1,
    title: "Seasonal Harvest Festival",
    description:
      "Join us for our annual celebration of sustainable farming with local produce and activities.",
    date: "June 15, 2024",
    image: "/images/header.png",
    ctaText: "Learn More",
    ctaLink: "/events/harvest-festival",
  },
  {
    id: 2,
    title: "Farm-to-Table Workshop",
    description:
      "Learn how to prepare delicious meals using fresh ingredients straight from our farm.",
    date: "July 8, 2024",
    image: "/images/header.png",
    ctaText: "Register Now",
    ctaLink: "/events/farm-to-table",
  },
  {
    id: 3,
    title: "Sustainable Farming Tour",
    description:
      "Experience our ethical farming practices and see how we maintain a balanced ecosystem.",
    date: "August 12, 2024",
    image: "/images/header.png",
    ctaText: "Book Tour",
    ctaLink: "/events/farm-tour",
  },
  {
    id: 4,
    title: "Children's Day on the Farm",
    description:
      "A family-friendly day where kids can learn about animals and sustainable farming.",
    date: "September 5, 2024",
    image: "/images/header.png",
    ctaText: "Family Tickets",
    ctaLink: "/events/kids-day",
  },
  {
    id: 5,
    title: "Organic Cooking Class",
    description:
      "Master the art of cooking with organic ingredients in this hands-on culinary experience.",
    date: "October 20, 2024",
    image: "/images/header.png",
    ctaText: "Join Class",
    ctaLink: "/events/cooking-class",
  },
  // Past events
  {
    id: 6,
    title: "Poultry Science Symposium",
    description:
      "A gathering of researchers and industry professionals to discuss the latest advancements in poultry science.",
    date: "April 10, 2024",
    image: "/images/header.png",
    ctaText: "View Details",
    ctaLink: "/events/symposium",
  },
  {
    id: 7,
    title: "Annual WPSA Conference",
    description:
      "Our yearly conference bringing together members from across the region to share knowledge and network.",
    date: "March 22, 2024",
    image: "/images/header.png",
    ctaText: "See Highlights",
    ctaLink: "/events/annual-conference",
  },
  {
    id: 8,
    title: "Poultry Health Workshop",
    description:
      "An educational workshop on maintaining optimal health in poultry flocks through natural methods.",
    date: "February 15, 2024",
    image: "/images/header.png",
    ctaText: "Workshop Materials",
    ctaLink: "/events/health-workshop",
  },
];

// Helper function to sort events by date (newest first)
export const sortEventsByDate = (events: EventSlide[]): EventSlide[] => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

// Helper function to get upcoming events
export const getUpcomingEvents = (events: EventSlide[]): EventSlide[] => {
  const today = new Date();
  return events.filter((event) => new Date(event.date) >= today);
};

// Helper function to get past events
export const getPastEvents = (events: EventSlide[]): EventSlide[] => {
  const today = new Date();
  return events.filter((event) => new Date(event.date) < today);
};

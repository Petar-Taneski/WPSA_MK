import { useState, useEffect, useRef } from "react";

export type EventSlide = {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  ctaText: string;
  ctaLink: string;
};

const eventSlides: EventSlide[] = [
  {
    id: 1,
    title: "Seasonal Harvest Festival",
    description:
      "Join us for our annual celebration of sustainable farming with local produce and activities.",
    date: "June 15, 2024",
    image: "/images/hero-bg.jpg",
    ctaText: "Learn More",
    ctaLink: "/events/harvest-festival",
  },
  {
    id: 2,
    title: "Farm-to-Table Workshop",
    description:
      "Learn how to prepare delicious meals using fresh ingredients straight from our farm.",
    date: "July 8, 2024",
    image: "/images/hero-bg.jpg",
    ctaText: "Register Now",
    ctaLink: "/events/farm-to-table",
  },
  {
    id: 3,
    title: "Sustainable Farming Tour",
    description:
      "Experience our ethical farming practices and see how we maintain a balanced ecosystem.",
    date: "August 12, 2024",
    image: "/images/hero-bg.jpg",
    ctaText: "Book Tour",
    ctaLink: "/events/farm-tour",
  },
  {
    id: 4,
    title: "Children's Day on the Farm",
    description:
      "A family-friendly day where kids can learn about animals and sustainable farming.",
    date: "September 5, 2024",
    image: "/images/hero-bg.jpg",
    ctaText: "Family Tickets",
    ctaLink: "/events/kids-day",
  },
  {
    id: 5,
    title: "Organic Cooking Class",
    description:
      "Master the art of cooking with organic ingredients in this hands-on culinary experience.",
    date: "October 20, 2024",
    image: "/images/hero-bg.jpg",
    ctaText: "Join Class",
    ctaLink: "/events/cooking-class",
  },
];

const EventCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === eventSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? eventSlides.length - 1 : prev - 1));
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  // Setup auto-scroll
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = window.setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused]);

  // Calculate slide positions
  const getSlidePosition = (index: number) => {
    // Current slide centered (0), others positioned relatively
    const position = index - currentSlide;

    // Handle wrapping for continuous carousel effect
    if (position < -2) return position + eventSlides.length;
    if (position > 2) return position - eventSlides.length;

    return position;
  };

  return (
    <div className="relative py-20 bg-white overflow-hidden">
      {/* Section Heading */}
      <div className="container mx-auto mb-12 px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Upcoming Events
        </h2>
        <p className="text-center text-slate-700 max-w-2xl mx-auto">
          Discover our seasonal activities and workshops dedicated to
          sustainable farming
        </p>
        <div className="mx-auto mt-4 h-1 w-24 bg-slate-400 rounded"></div>
      </div>

      {/* Carousel container */}
      <div
        className="relative h-[500px] md:h-[480px] w-full mx-auto max-w-7xl px-4 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides */}
        {eventSlides.map((slide, index) => {
          const position = getSlidePosition(index);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 mx-auto max-w-6xl transition-all duration-700 ease-in-out ${
                position === 0
                  ? "opacity-100 z-10 transform-none"
                  : "opacity-0 z-0 scale-95"
              }`}
              style={{
                transform: `translateX(${position * 110}%)`, // Increased spacing between slides
                opacity:
                  Math.abs(position) <= 1 ? 1 - Math.abs(position) * 0.7 : 0,
                zIndex: position === 0 ? 10 : 10 - Math.abs(position),
              }}
            >
              <div className="mx-4 h-full overflow-hidden rounded-xl shadow-lg relative bg-white border border-slate-200">
                {/* Background Image */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>

                {/* Content overlay with blur effect */}
                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-10">
                  <div className="relative z-10 max-w-md backdrop-blur-md bg-slate-900/50 p-8 rounded-xl text-white shadow-lg border border-white/10">
                    <div className="inline-block px-4 py-1.5 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full mb-6 text-white w-fit">
                      {slide.date}
                    </div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                      {slide.title}
                    </h3>
                    <p className="text-slate-100 text-base mb-8">
                      {slide.description}
                    </p>
                    <div className="mt-auto">
                      <a
                        href={slide.ctaLink}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all hover:shadow-md"
                      >
                        {slide.ctaText}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 backdrop-blur-sm text-slate-800 rounded-full p-3 md:p-4 transition-all duration-300 hover:shadow-md"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 backdrop-blur-sm text-slate-800 rounded-full p-3 md:p-4 transition-all duration-300 hover:shadow-md"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute -bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
          {eventSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-primary-600 scale-125 shadow-sm"
                  : "bg-slate-400 hover:bg-slate-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;

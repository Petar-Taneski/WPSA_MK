import { useState, useEffect, useRef } from "react";
import ArrowButton from "../common/ArrowButton";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { eventSlides } from "../../data/eventData";
import { useTranslation } from "react-i18next";

export type EventSlide = {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  ctaText: string;
  ctaLink: string;
};

const EventCarousel = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

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
    <div className="relative py-20 overflow-hidden bg-white">
      {/* Section Heading */}
      <div className="container px-6 mx-auto mb-12">
        <h2 className="mb-3 text-3xl font-bold text-center md:text-4xl text-primary/85">
          {t("events.upcomingEvents")}
        </h2>
        <p className="max-w-2xl mx-auto text-center text-slate-700/80">
          {t("events.eventsDescription")}
        </p>
        <div className="w-24 h-1 mx-auto mt-4 rounded bg-primary"></div>
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
              <div className="relative h-full mx-4 overflow-hidden bg-white border rounded-sm shadow-lg border-slate-200">
                {/* Background Image */}
                <div
                  className="absolute inset-0 w-full h-full bg-center bg-cover"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>

                {/* Content overlay with blur effect */}
                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-10">
                  <div className="relative z-10 max-w-md p-8 text-white border shadow-lg backdrop-blur-md bg-primary/40 rounded-xl border-white/10">
                    <div className="inline-block px-4 py-1.5 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full mb-6 text-white w-fit">
                      {slide.date}
                    </div>
                    <h3 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                      {slide.title}
                    </h3>
                    <p className="mb-8 text-base text-slate-100">
                      {slide.description}
                    </p>
                    <div className="mt-auto">
                      <ArrowButton
                        className="bg-white hover:scale-105 text-primary"
                        text={slide.ctaText}
                        onClick={() => navigate(slide.ctaLink)}
                      />
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
          className="absolute z-20 p-3 transition-all duration-300 -translate-y-1/2 rounded-full cursor-pointer left-4 md:left-8 top-1/2 bg-white/70 hover:bg-white/90 backdrop-blur-sm text-slate-800 md:p-4 hover:shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute z-20 p-3 transition-all duration-300 -translate-y-1/2 rounded-full cursor-pointer right-4 md:right-8 top-1/2 bg-white/70 hover:bg-white/90 backdrop-blur-sm text-slate-800 md:p-4 hover:shadow-md"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute left-0 right-0 z-20 flex justify-center space-x-3 -bottom-10">
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

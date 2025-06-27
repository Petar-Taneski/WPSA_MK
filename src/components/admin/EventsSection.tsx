import React, { useEffect, useRef } from "react";
import { useInfiniteEvents } from "../../hooks/useInfiniteEvents";
import { AdminCard } from "./AdminCard";
import { Event } from "../../services/interfaces";

interface EventsSectionProps {
  onEdit: (item: Event) => void;
  onDelete: (id: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  onEdit,
  onDelete,
}) => {
  const { flat, error, size, setSize, isEnd, isLoading } =
    useInfiniteEvents("en");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isEnd) {
          setSize(size + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [size, setSize, isLoading, isEnd]);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600">Error loading events</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flat.length === 0 && !isLoading ? (
        <div className="text-center py-8 text-gray-500">No events found</div>
      ) : (
        <>
          {flat.map((event) => (
            <AdminCard
              key={event.id}
              item={event}
              type="events"
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {/* Load more trigger */}
          <div
            ref={loadMoreRef}
            className="h-10 flex items-center justify-center"
          >
            {isLoading && (
              <div className="text-gray-500 text-sm">
                Loading more events...
              </div>
            )}
            {isEnd && flat.length > 0 && (
              <div className="text-gray-400 text-sm">No more events</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

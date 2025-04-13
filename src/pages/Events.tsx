import EventsComponent from "../components/Events/EventsComponent";

const Events = () => {
  return (
    <div className="page events-page">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Events
        </h1>
        <EventsComponent />
      </div>
    </div>
  );
};

export default Events;

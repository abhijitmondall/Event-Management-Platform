import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router";

const eventsData = [
  {
    id: 1,
    name: "Tech Conference 2025",
    description: "A conference about the latest in tech.",
    date: "2025-03-25",
    attendees: 120,
    category: "Technology",
    image: "https://i.ibb.co.com/M0XH0zS/pexels-divinetechygirl-1181406.jpg",
  },
  {
    id: 2,
    name: "Music Festival 2025",
    description: "A grand music festival for all music lovers.",
    date: "2025-05-15",
    attendees: 200,
    category: "Music",
    image:
      "https://i.ibb.co.com/N6TMJg5T/pexels-sebastian-ervi-866902-1763075.jpg",
  },
  {
    id: 3,
    name: "Startup Summit 2025",
    description: "A summit for budding entrepreneurs.",
    date: "2025-04-10",
    attendees: 80,
    category: "Business",
    image: "https://i.ibb.co.com/Mxb9sM0S/pexels-fauxels-3184360.jpg",
  },
  {
    id: 4,
    name: "AI Conference 2024",
    description: "Discussing the future of Artificial Intelligence.",
    date: "2024-11-10",
    attendees: 250,
    category: "Technology",
    image:
      "https://i.ibb.co.com/v4pcjzC6/pexels-bertellifotografia-2608517.jpg",
  },
  {
    id: 5,
    name: "Cooking Workshop",
    description: "A hands-on cooking experience.",
    date: "2024-09-20",
    attendees: 30,
    category: "Workshop",
    image: "https://i.ibb.co.com/dwGjMRtV/pexels-kampus-8511799.jpg",
  },
  {
    id: 6,
    name: "Web Development Bootcamp",
    description: "Learn to build web apps in 5 days.",
    date: "2025-02-10",
    attendees: 50,
    category: "Education",
    image: "https://i.ibb.co.com/Wv2dqjRn/pexels-divinetechygirl-1181243.jpg",
  },
  {
    id: 7,
    name: "Health and Wellness Expo",
    description: "An expo for health enthusiasts.",
    date: "2024-12-01",
    attendees: 180,
    category: "Health",
    image: "https://i.ibb.co.com/ycWdPrpZ/pexels-kampus-8511799.jpg",
  },
  {
    id: 8,
    name: "Digital Marketing Conference",
    description: "Insights into the future of digital marketing.",
    date: "2025-06-05",
    attendees: 300,
    category: "Marketing",
    image:
      "https://i.ibb.co.com/R4zDfx2m/pexels-wildlittlethingsphoto-933964.jpg",
  },
];

function Events() {
  const [events, setEvents] = useState(eventsData);
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    filterEvents();
  }, [categoryFilter, dateFilter]);

  const filterEvents = () => {
    let filtered = events;

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    // Date filter
    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date(dateFilter);
      if (dateFilter === "upcoming") {
        filtered = filtered.filter((event) => new Date(event.date) > today);
      } else if (dateFilter === "past") {
        filtered = filtered.filter((event) => new Date(event.date) < today);
      }
    }

    setFilteredEvents(filtered);
  };

  // Handle attending an event and updating the attendee count
  const handleAttendEvent = (id) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, attendees: event.attendees + 1 } : event
    );
    setEvents(updatedEvents);
  };

  return (
    <section className="container">
      <div className="py-[90px]">
        <h2 className="text-3xl font-bold mb-6 text-center">Event Dashboard</h2>

        {/* Filters Section */}
        <div className="flex justify-between mb-6">
          {/* Category Filter */}
          <div>
            <label className="mr-2">Category</label>
            <select
              className="p-2 border rounded-lg shadow-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Music">Music</option>
              <option value="Business">Business</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="mr-2">Date</label>
            <select
              className="p-2 border rounded-lg shadow-sm"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        {/* Event Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[26px]">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="relative bg-gradient rounded-lg border border-gray-300 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out p-4 flex flex-col justify-between group"
            >
              {/* Edit & Delete Icons (Hidden by default, shown on hover) */}
              <div className="absolute bg-white shadow-md p-[10px] rounded-[3px] top-[20px] right-[20px] flex flex-col gap-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => {}}
                  className="text-green-600 hover:text-green-800 cursor-pointer"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => {}}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <FaTrash size={18} />
                </button>
              </div>

              {/* Event Image */}
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h4 className="text-xl font-semibold text-gray-800">
                {event.name}
              </h4>
              <p className="mt-2 text-gray-600 text-sm">{event.description}</p>
              <p className="mt-2 text-gray-500 text-xs">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-700">
                {event.attendees} Attendees
              </p>

              {/* Attend Event Button */}
              <button
                onClick={() => handleAttendEvent(event.id)}
                className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-2 cursor-pointer"
              >
                Attend Event
              </button>

              {/* View Details Button */}
              <Link
                to={`/event/${event.id}`}
                className="block text-center text-blue-500 hover:text-blue-600 font-semibold"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Events;

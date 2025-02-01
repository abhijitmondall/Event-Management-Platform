import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import { BASE_URL } from "../../helpers/settings";
import { useAuthContext } from "../../context/AuthProvider";
import { useSocketContext } from "../../context/SocketProvider";

function Events() {
  const { token, authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const [events, setEvents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filterByCategory = categoryFilter && `eventCategory=${categoryFilter}`;

  let filterByDate = "";

  const today = new Date().toISOString().split("T")[0];

  if (dateFilter && dateFilter === "upcoming") {
    filterByDate += `date[gte]=${today}`;
  }
  if (dateFilter && dateFilter === "past") {
    filterByDate += `date[lte]=${today}`;
  }

  const handleAttendEvent = async (event) => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/events/${event._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attendees: event?.attendees + 1,
          bookedSeats: {
            ...event.bookedSeats,
            [authUser._id]: true,
          },
        }),
      });
      if (!res.ok) throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/api/v1/events?${filterByCategory}&${filterByDate}`
        );

        if (!res.ok) throw new Error(res.message);

        const data = await res.json();
        setEvents(data?.data?.events);

        // console.log(data?.data?.events);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [filterByCategory, filterByDate]);

  // Real Time Event Attendance Update With Socket.io
  useEffect(() => {
    if (socket) {
      socket.on("eventUpdated", (updatedEvent) => {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === updatedEvent.eventId
              ? { ...event, ...updatedEvent }
              : event
          )
        );
      });

      return () => {
        socket.off("eventUpdated");
      };
    }
  }, [socket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-[90px] min-h-screen">
        <p className="text-xl font-bold text-blue-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="container">
      <div className="py-[90px]">
        <h2 className="text-3xl font-bold mb-6 text-center">Event Dashboard</h2>

        {/* Filters Section */}
        <div className="flex justify-between mb-6">
          {/* Category Filter */}
          <div>
            <label className="mr-2">Filter By Category:</label>
            <select
              className="p-2 border rounded-lg shadow-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Music">Music</option>
              <option value="Business">Business</option>
              <option value="Workshop">Workshop</option>
              <option value="Health">Health</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="mr-2">Filter By Date:</label>
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
          {events?.map((event) => (
            <div
              key={event._id}
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
                src={event.eventImage}
                alt={event.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h4 className="text-xl font-semibold text-gray-800">
                {event.name}
              </h4>
              <p className="mt-2 text-gray-600 text-sm">{event.summary}</p>
              <p className="mt-2 text-gray-500 text-xs">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-700">
                {event.attendees} Attendees
              </p>

              {/* Attend Event Button */}
              <button
                onClick={() => handleAttendEvent(event)}
                disabled={event?.bookedSeats?.[authUser?._id]}
                className={`mt-4 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-2 cursor-pointer ${
                  event?.bookedSeats?.[authUser?._id] && "disabled"
                }`}
              >
                {`${
                  event?.bookedSeats?.[authUser?._id]
                    ? "Seat Booked"
                    : "Attend Event"
                }`}
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

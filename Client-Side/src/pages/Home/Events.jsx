import { useEffect, useState } from "react";

import { BASE_URL } from "../../helpers/settings";
import { useAuthContext } from "../../context/AuthProvider";
import { useSocketContext } from "../../context/SocketProvider";
import EventCard from "../../UI/EventCard/EventCard";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function Events() {
  const { token, authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const [events, setEvents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadAttendance, setLoadAttendance] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
    if (!authUser) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "You need to be logged in to attend an event",
      });
      navigate("/login", { replace: true });
      return;
    }
    try {
      setLoadAttendance(true);
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
          author: JSON.stringify({
            name: authUser.name,
            email: authUser.email,
          }),
        }),
      });

      const data = await res.json();

      if (!res.ok && data.status !== "success") throw new Error(data.message);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.message,
      });
    } finally {
      setLoadAttendance(false);
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
              ? { ...event, ...updatedEvent?._doc }
              : event
          )
        );
      });

      return () => {
        socket.off("eventUpdated");
      };
    }
  }, [socket]);

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
        <h2 className="text-3xl font-bold mb-[30px] text-center">
          Explore Events
        </h2>

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
        {loading ? (
          <div className="flex items-center justify-center p-[90px]">
            <p className="text-xl font-bold text-blue-500">Loading...</p>
          </div>
        ) : (
          <EventCard
            events={events}
            onHandleSubmit={handleAttendEvent}
            loadAttendance={loadAttendance}
            showBtns={true}
          />
        )}
      </div>
    </section>
  );
}

export default Events;

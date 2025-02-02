import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { BASE_URL } from "../../helpers/settings";
import { useAuthContext } from "../../context/AuthProvider";
import { useSocketContext } from "../../context/SocketProvider";

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadAttendance, setLoadAttendance] = useState(false);
  const [error, setError] = useState(null);
  const { socket } = useSocketContext();

  const { token, authUser } = useAuthContext();
  const { id } = useParams();

  const handleAttendEvent = async (e, id) => {
    e.preventDefault();

    try {
      setLoadAttendance(true);
      const res = await fetch(`${BASE_URL}/api/v1/events/${id}`, {
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

      if (!res.ok) throw new Error(res.message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadAttendance(false);
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/v1/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch event details");

        const data = await res.json();
        setEvent(data?.data?.event);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, token]);

  // Real Time Event Attendance Update With Socket.io
  useEffect(() => {
    if (socket) {
      socket.on("eventUpdated", (updatedEvent) => {
        setEvent((prevEvent) => ({ ...prevEvent, ...updatedEvent._doc }));
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-bold text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="container">
      <div className="min-h-screen pb-[90px]">
        {/* Event Header */}
        <div className="relative">
          <img
            src={event?.eventImage}
            alt="Event Banner"
            className="w-full h-[400px] object-cover rounded-b-2xl"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-50 rounded-b-2xl"></div>
          <div className="absolute bottom-10 left-10 text-white">
            <h1 className="text-4xl font-semibold">{event?.name}</h1>
            <p className="text-xl mt-2">
              {event?.date} | {event?.time}
            </p>
          </div>
        </div>

        {/* Event Info Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-4">Event Details</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">Description</h3>
                <p className="text-gray-700">{event?.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Speaker</h3>
                <p className="text-gray-700">{event?.author?.name}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Location</h3>
                <p className="text-gray-700">{event?.location}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Attendees</h3>
                <p className="text-gray-700">{event?.attendees}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Max Attendees</h3>
                <p className="text-gray-700">{event?.maxAttendees}</p>
              </div>
            </div>

            {/* RSVP Button */}
            <div className="mt-6 text-center">
              <button
                onClick={(e) => {
                  handleAttendEvent(e, event?._id);
                }}
                disabled={event?.bookedSeats?.[authUser?._id] || loadAttendance}
                className={`mt-4 w-full md:w-[20%] p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-2 cursor-pointer ${
                  event?.bookedSeats?.[authUser?._id] && "disabled"
                }`}
              >
                {`${
                  event?.bookedSeats?.[authUser?._id]
                    ? "Seat Booked"
                    : "RSVP Now"
                }`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventDetails;

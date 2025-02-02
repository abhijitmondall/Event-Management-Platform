import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { BASE_URL } from "../../helpers/settings";
import { useAuthContext } from "../../context/AuthProvider";

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token, authUser } = useAuthContext();
  const { id } = useParams();

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
      <div className="min-h-screen">
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
                <h3 className="text-xl font-semibold">Max Attendees</h3>
                <p className="text-gray-700">{event?.maxAttendees}</p>
              </div>
            </div>

            {/* RSVP Button */}
            <div className="mt-6 text-center">
              <button className="bg-blue-600 text-white py-2 px-6 rounded-lg text-xl hover:bg-blue-700 transition duration-300">
                RSVP Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventDetails;

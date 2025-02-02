import { useState, useEffect, useReducer } from "react";
import { FaCross, FaEdit, FaTrash } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthProvider";
import { BASE_URL } from "../../helpers/settings";
import EventCard from "../../UI/EventCard/EventCard";
import EventForm from "../../UI/EventForm/EventForm";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import { useSocketContext } from "../../context/SocketProvider";

const initialState = {
  name: "",
  summary: "",
  description: "",
  date: "",
  time: "",
  location: "",
  maxAttendees: "",
  eventCategory: "",
  eventImage: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "summary":
      return { ...state, summary: action.payload };
    case "description":
      return { ...state, description: action.payload };
    case "date":
      return { ...state, date: action.payload };
    case "time":
      return { ...state, time: action.payload };
    case "location":
      return { ...state, location: action.payload };
    case "maxAttendees":
      return { ...state, maxAttendees: action.payload };
    case "eventCategory":
      return { ...state, eventCategory: action.payload };
    case "eventImage":
      return { ...state, eventImage: action.payload };
    case "reset":
      return initialState;
    default:
      return state;
  }
};

function Dashboard() {
  const { token, authUser } = useAuthContext();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const [reFetch, setReFetch] = useState(false);

  // Open modal and set event to edit
  const handleEditEvent = (e, event) => {
    e.preventDefault();
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  // Delete event handler
  const handleDeleteEvent = async (e, eventId) => {
    e.preventDefault();

    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/events/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // if (!res.ok) throw new Error("Failed to delete event.");

        // Re-fetch events after deletion
        setReFetch((re) => !re);

        Swal.fire({
          title: "Deleted!",
          text: "Your event has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        setError(err.message);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete event. Please try again later.",
          icon: "error",
        });
      }
    }
  };

  const handleUpdateEvent = async (e, validateForm) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      formData.append("name", state.name);
      formData.append("summary", state.summary);
      formData.append("description", state.description);
      formData.append("date", state.date);
      formData.append("time", state.time);
      formData.append("location", state.location);
      formData.append("maxAttendees", state.maxAttendees);
      formData.append("eventCategory", state.eventCategory);

      if (state.eventImage) {
        formData.append("eventImage", state.eventImage);
      }

      formData.append(
        "author",
        JSON.stringify({ name: authUser.name, email: authUser.email })
      );

      try {
        setLoading(true);
        console.log(selectedEvent._id);
        const res = await fetch(
          `${BASE_URL}/api/v1/events/${selectedEvent._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Failed to Update event!");

        Swal.fire({
          icon: "success",
          title: "Event Updated!",
          text: "Your event has been Updated successfully.",
        });
        setReFetch((re) => !re);
        setIsModalOpen(false);
        dispatch({ type: "reset" });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to Update Event",
          text: "There was an issue Updating your event. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Update Form Value For Event
  useEffect(() => {
    if (selectedEvent) {
      dispatch({ type: "reset" });
      Object.entries(selectedEvent).forEach(([key, value]) => {
        dispatch({ type: key, payload: value });
      });
    }
  }, [selectedEvent]);

  // Fetch user events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/events/userEvents`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch events.");
        const data = await res.json();
        setEvents(data?.data?.userEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [authUser._id, token, reFetch]);

  return (
    <section className="container">
      <div className="py-[90px] relative min-h-[90vh]">
        <h2 className="text-3xl font-bold mb-6 text-center">
          My Events Dashboard
        </h2>

        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-gradient bg-opacity-50 backdrop-blur-sm z-50 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl transform transition-all scale-95 sm:scale-100">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Edit Event</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-[26px] text-black hover:text-red-500 transition-colors duration-300 cursor-pointer"
                >
                  <IoClose />
                </button>
              </div>

              <EventForm
                onFormSubmit={handleUpdateEvent}
                state={state}
                dispatch={dispatch}
                loading={loading}
              >
                Edit Event
              </EventForm>
            </div>
          </div>
        )}

        <EventCard
          onHandleEdit={handleEditEvent}
          onHandleDelete={handleDeleteEvent}
          events={events}
          showBtns={false}
        />

        <h1 className="text-[26px] text-center font-bold">
          {events.length === 0 && "You have not created any Event yet!"}
        </h1>
      </div>
    </section>
  );
}

export default Dashboard;

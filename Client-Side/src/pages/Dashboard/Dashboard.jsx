import { useState, useEffect, useReducer } from "react";

import { useAuthContext } from "../../context/AuthProvider";
import { BASE_URL } from "../../helpers/settings";
import EventCard from "../../UI/EventCard/EventCard";
import EventForm from "../../UI/EventForm/EventForm";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";

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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token, authUser } = useAuthContext();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reFetch, setReFetch] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filterByCategory = categoryFilter && `eventCategory=${categoryFilter}`;

  let filterByDate = "";

  const today = new Date().toISOString().split("T")[0];

  if (dateFilter && dateFilter === "upcoming") {
    filterByDate += `date[gte]=${today}`;
  }
  if (dateFilter && dateFilter === "past") {
    filterByDate += `date[lte]=${today}`;
  }

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
        await fetch(`${BASE_URL}/api/v1/events/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        console.log(err);
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
        const res = await fetch(
          `${BASE_URL}/api/v1/events/userEvents?${filterByCategory}&${filterByDate}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch events.");
        const data = await res.json();
        setEvents(data?.data?.userEvents);
      } catch (err) {
        // setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [authUser._id, token, reFetch, filterByCategory, filterByDate]);

  return (
    <section className="container">
      <div className="py-[90px] relative min-h-[90vh]">
        <h2 className="text-3xl font-bold mb-[30px] text-center">
          My Events Dashboard
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
          {events.length === 0 && "No Events Found!"}
        </h1>
      </div>
    </section>
  );
}

export default Dashboard;

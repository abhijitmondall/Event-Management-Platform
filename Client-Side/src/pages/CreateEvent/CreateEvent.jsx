import { useReducer, useState } from "react";
import { BASE_URL } from "../../helpers/settings";
import { useAuthContext } from "../../context/AuthProvider";
import Swal from "sweetalert2";
import EventForm from "../../UI/EventForm/EventForm";

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

function CreateEvent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token, authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e, validateForm) => {
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
        const res = await fetch(`${BASE_URL}/api/v1/events`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to create event!");

        Swal.fire({
          icon: "success",
          title: "Event Created!",
          text: "Your event has been created successfully.",
        });

        dispatch({ type: "reset" });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to Create Event",
          text: "There was an issue creating your event. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-[60px]">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full md:max-w-[36%] max-w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create a New Event
        </h2>
        {/* <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Event Name
            </label>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter event name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Summary</label>
            <input
              type="text"
              name="summary"
              value={state.summary}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter event summary"
            />
            {errors.summary && (
              <p className="text-red-500 text-sm">{errors.summary}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={state.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter event description"
              rows="3"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={state.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={state.time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={state.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter event location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Max Attendees
            </label>
            <input
              type="number"
              name="maxAttendees"
              value={state.maxAttendees}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter max attendees"
            />
            {errors.maxAttendees && (
              <p className="text-red-500 text-sm">{errors.maxAttendees}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Category</label>
            <select
              name="category"
              value={state.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Event Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.eventImage && (
              <p className="text-red-500 text-sm">{errors.eventImage}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer ${
              loading && "disabled"
            }`}
          >
            Create Event
          </button>
        </form> */}
        <EventForm
          onFormSubmit={handleSubmit}
          state={state}
          loading={loading}
          dispatch={dispatch}
        >
          Create Event
        </EventForm>
      </div>
    </div>
  );
}

export default CreateEvent;

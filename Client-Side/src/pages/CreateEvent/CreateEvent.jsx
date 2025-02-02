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

        const data = await res.json();
        if (!res.ok && data.status !== "success") throw new Error(data.message);

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
          title: "Failed to Create Event!",
          text: err.message,
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

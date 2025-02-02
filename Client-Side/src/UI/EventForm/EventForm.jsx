import { useState } from "react";

function EventForm({ children, state, dispatch, onFormSubmit, loading }) {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: name, payload: value });
  };

  const handleFileChange = (e) => {
    dispatch({ type: "eventImage", payload: e.target.files[0] });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!state.name.trim()) newErrors.name = "Event name is required.";
    if (!state.summary.trim()) newErrors.summary = "Summary is required.";
    if (!state.description.trim())
      newErrors.description = "Description is required.";
    if (!state.date) newErrors.date = "Please select a date.";
    if (!state.time) newErrors.time = "Please select a time.";
    if (!state.location.trim()) newErrors.location = "Location is required.";
    if (!state.maxAttendees || state.maxAttendees <= 0)
      newErrors.maxAttendees = "Max attendees must be greater than 0.";
    if (!state.eventCategory)
      newErrors.eventCategory = "Please select a category.";
    if (!state.eventImage)
      newErrors.eventImage = "Please upload an event image.";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <form
      onSubmit={(e) => onFormSubmit(e, validateForm)}
      className="mt-6 space-y-4"
    >
      <div>
        <label className="block text-gray-700 text-sm mb-1">Event Name</label>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter event name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
        <label className="block text-gray-700 text-sm mb-1">Description</label>
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
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
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
          {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
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
          name="eventCategory"
          value={state.eventCategory}
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
        <label className="block text-gray-700 text-sm mb-1">Event Image</label>
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
        {children}
      </button>
    </form>
  );
}

export default EventForm;

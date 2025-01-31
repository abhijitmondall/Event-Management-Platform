import { useState } from "react";

function CreateEvent() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: "",
    eventImage: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, eventImage: e.target.files[0] });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Event name is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.date) newErrors.date = "Please select a date.";
    if (!formData.time) newErrors.time = "Please select a time.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.maxAttendees || formData.maxAttendees <= 0)
      newErrors.maxAttendees = "Max attendees must be greater than 0.";
    if (!formData.eventImage)
      newErrors.eventImage = "Please upload an event image.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO
      console.log(formData);
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        location: "",
        maxAttendees: "",
        eventImage: null,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create a New Event
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Event Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter event name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter event description"
              rows="3"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
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
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter event location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Max Attendees */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Max Attendees
            </label>
            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter max attendees"
            />
            {errors.maxAttendees && (
              <p className="text-red-500 text-sm">{errors.maxAttendees}</p>
            )}
          </div>

          {/* Upload Image */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;

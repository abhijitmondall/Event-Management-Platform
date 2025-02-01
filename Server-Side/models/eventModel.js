const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    attendees: {
      type: Number,
      default: 0,
    },
    maxAttendees: {
      type: Number,
      required: true,
    },
    eventCategory: {
      type: String,
      enum: [
        "Technology",
        "Education",
        "Music",
        "Business",
        "Workshop",
        "Health",
        "Marketing",
      ],
      required: true,
    },
    eventImage: {
      type: String,
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    bookedSeats: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },

  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;

import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import { useAuthContext } from "../../context/AuthProvider";

function EventCard({
  events,
  onHandleSubmit,
  onHandleEdit,
  onHandleDelete,
  loadAttendance,
  showBtns,
}) {
  const { authUser } = useAuthContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[26px]">
      {events?.map((event) => (
        <div
          key={event._id}
          className={`relative bg-gradient rounded-lg border border-gray-300 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out p-4 flex flex-col justify-between`}
        >
          {event?.author?.email === authUser?.email && !showBtns && (
            <div className="absolute bg-white shadow-md p-[10px] rounded-[3px] top-[20px] right-[20px] flex flex-col gap-[10px]">
              <button
                onClick={(e) => {
                  onHandleEdit(e, event);
                }}
                className="text-green-600 hover:text-green-800 cursor-pointer"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={(e) => {
                  onHandleDelete(e, event._id);
                }}
                className="text-red-600 hover:text-red-800 cursor-pointer"
              >
                <FaTrash size={18} />
              </button>
            </div>
          )}

          {/* Event Image */}
          <img
            src={event.eventImage}
            alt={event.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <h4 className="text-xl font-semibold text-gray-800">{event.name}</h4>
          <p className="mt-2 text-gray-600 text-sm">{event.summary}</p>
          <p className="mt-2 text-gray-500 text-xs">
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            {event.attendees} Attendees
          </p>

          {showBtns && (
            <>
              <button
                onClick={() => onHandleSubmit(event)}
                disabled={event?.bookedSeats?.[authUser?._id] || loadAttendance}
                className={`mt-4 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-2 cursor-pointer ${
                  event?.bookedSeats?.[authUser?._id] && "disabled"
                }`}
              >
                {`${
                  event?.bookedSeats?.[authUser?._id]
                    ? "Seat Booked"
                    : "Attend Event"
                }`}
              </button>
              <Link
                to={`/event/${event._id}`}
                className="block text-center text-blue-500 hover:text-blue-600 font-semibold"
              >
                View Details
              </Link>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default EventCard;

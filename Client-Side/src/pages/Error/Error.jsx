import { Link } from "react-router";
import ErrorImg from "./../../assets/error.svg";

function Error() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold tracking-widest">404</h1>
        <p className="text-2xl mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="mt-2 text-lg text-gray-400">
          It might have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Go Back Home
        </Link>
      </div>
      <div className="mt-10">
        <img
          src={ErrorImg}
          alt="404 Illustration"
          className="max-w-full h-auto sm:max-w-md"
        />
      </div>
    </div>
  );
}

export default Error;

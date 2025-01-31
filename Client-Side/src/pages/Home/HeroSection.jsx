import { Link } from "react-router";
import heroImg from "../../assets/Img/Hero-Img.png";

function HeroSection() {
  return (
    <section className="relative bg-gradient py-[90px]">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side (Text) */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl mb-4">
              Discover Your Next Event
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Join thousands of attendees at exciting events happening near you.
              From technology to music festivals, we have it all!
            </p>
            <a
              href="#events"
              className="inline-block bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Explore Events
            </a>
          </div>

          {/* Right Side (Image) */}
          <div className="relative">
            <img
              src={heroImg}
              alt="Event Hero"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {/* Optional: You can add a blur effect or overlay */}
            <div className="absolute inset-0 bg-black opacity-25 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

import { useState } from "react";
import { NavLink } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthProvider";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { authUser, logout } = useAuthContext();

  return (
    <header className="py-[18px] shadow-sm">
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-500">EventHub</h1>

        {/* Hamburger Icon */}
        <div className="md:hidden flex items-center absolute top-[16px] right-[20px]">
          <button onClick={toggleMenu}>
            {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          className={`w-full md:w-auto ${isOpen ? "block" : "hidden"} md:block`}
        >
          <ul
            className={`w-full flex items-center md:gap-[50px] gap-[20px] text-sm md:text-base font-medium text-white justify-center md:justify-end md:relative absolute md:top-0 top-[60px] left-0 bg-[#333] z-10 md:bg-transparent py-[20px] md:py-0 ${
              isOpen ? "flex-col" : "flex-row"
            }`}
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-medium underline"
                    : "md:text-black text-white hover:text-blue-500 transition"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/createEvent"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-medium underline"
                    : "md:text-black text-white hover:text-blue-500 transition"
                }
              >
                Create Event
              </NavLink>
            </li>
            <li>
              {authUser && (
                <div className="flex items-center gap-3">
                  <div className="flex gap-[6px] items-center">
                    <p className="text-[#81c5d8]">{authUser?.name}</p>
                    <img
                      title={authUser?.name || ""}
                      src={authUser?.photo || "./default.png"}
                      alt={authUser?.name || ""}
                      className="h-[45px] rounded-[50%] border border-[#ddd] object-cover cursor-pointer"
                    />
                  </div>

                  <div>
                    <button
                      onClick={async () => {
                        await logout();
                      }}
                      className="text-blue-500 cursor-pointer border-2 px-[12px] py-[6px] rounded-[10px]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {!authUser && (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-medium underline"
                      : "md:text-black text-white hover:text-blue-500 transition"
                  }
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

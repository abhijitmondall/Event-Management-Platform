import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login action
    // handleLogin(formData);
  };

  return (
    <section className="">
      <div className="flex justify-center items-center min-h-[90vh] bg-gray-100 px-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="mt-6">
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your password"
              />
              {/* Show/Hide Password Button */}
              <button
                type="button"
                className="absolute right-3 top-[56%] text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Login
            </button>
          </form>

          {/* Sign-up Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;

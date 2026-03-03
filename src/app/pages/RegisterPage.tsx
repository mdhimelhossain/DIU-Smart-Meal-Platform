import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { User, Building2 } from "lucide-react";

export function RegisterPage() {
  const [role, setRole] = useState<"student" | "hotel-owner">("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    studentId: "",
    department: "",
    hotelName: "",
    location: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration - redirect to respective dashboard
    if (role === "student") {
      navigate("/student/dashboard");
    } else {
      navigate("/hotel-owner/dashboard");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
           <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Create Account</h1>
          <p className="text-gray-600 text-center mb-8">Join DIU Smart Food Portal</p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`p-4 rounded-2xl border-2 transition-all ${
                role === "student"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <User className={`mx-auto mb-2 ${role === "student" ? "text-green-600" : "text-gray-400"}`} size={32} />
              <span className={`font-semibold ${role === "student" ? "text-green-600" : "text-gray-600"}`}>
                Student
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole("hotel-owner")}
              className={`p-4 rounded-2xl border-2 transition-all ${
                role === "hotel-owner"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <Building2 className={`mx-auto mb-2 ${role === "hotel-owner" ? "text-green-600" : "text-gray-400"}`} size={32} />
              <span className={`font-semibold ${role === "hotel-owner" ? "text-green-600" : "text-gray-600"}`}>
                Hotel Owner
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                  placeholder="Mr. X"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                  placeholder="xyz@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                  placeholder="+880 1*********"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Student-specific Fields */}
            {role === "student" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                    placeholder="231-35-3456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                    placeholder="Software Engineering"
                    required
                  />
                </div>
              </div>
            )}

            {/* Hotel Owner-specific Fields */}
            {role === "hotel-owner" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hotel Name
                  </label>
                  <input
                    type="text"
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                    placeholder="Campus Canteen"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                    placeholder="DIU Campus, Ashulia"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-colors"
            >
              Register as {role === "student" ? "Student" : "Hotel Owner"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">
              
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

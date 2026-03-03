import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { User, Building2 } from "lucide-react";

export function LoginPage() {
  const [role, setRole] = useState<"student" | "hotel-owner">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect to respective dashboard
    if (role === "student") {
      navigate("/student/dashboard");
    } else {
      navigate("/hotel-owner/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-center mb-8">Login to your account</p>

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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-colors"
            >
              Login as {role === "student" ? "Student" : "Hotel Owner"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

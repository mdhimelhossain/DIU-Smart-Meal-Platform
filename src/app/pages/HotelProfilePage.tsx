import { useParams, Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { hotels, menuItems } from "../data/mockData";
import { MapPin, Phone, Mail, Star, Users, Check } from "lucide-react";
import { useState } from "react";

export function HotelProfilePage() {
  const { id } = useParams();
  const hotel = hotels.find((h) => h.id === id);
  const hotelMenu = menuItems.filter((item) => item.hotelId === id);
  const [isJoined, setIsJoined] = useState(false);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Hotel not found</h1>
          <Link to="/hotels" className="text-green-600 hover:underline mt-4 inline-block">
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(hotelMenu.map((item) => item.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hotel Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-64 overflow-hidden">
            <img
              src={hotel.logo}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Star size={20} className="text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="font-semibold">{hotel.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={20} className="mr-1 text-green-600" />
                    <span>{hotel.totalStudents} Students Joined</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsJoined(!isJoined)}
                className={`px-8 py-3 rounded-2xl font-semibold transition-all ${
                  isJoined
                    ? "bg-green-100 text-green-700 border-2 border-green-600"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isJoined ? (
                  <span className="flex items-center gap-2">
                    <Check size={20} />
                    Joined Postpaid System
                  </span>
                ) : (
                  "Join Postpaid System"
                )}
              </button>
            </div>

            <p className="text-gray-600 mb-6">{hotel.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-700">
                <MapPin size={20} className="mr-2 text-green-600" />
                <span>{hotel.location}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone size={20} className="mr-2 text-green-600" />
                <span>{hotel.contact}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail size={20} className="mr-2 text-green-600" />
                <span>{hotel.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Full Menu</h2>

          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-green-200">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotelMenu
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        item.available
                          ? "border-green-200 bg-white hover:border-green-400"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <span className="text-green-600 font-bold">৳{item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          item.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.available ? "Available" : "Out of Stock"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

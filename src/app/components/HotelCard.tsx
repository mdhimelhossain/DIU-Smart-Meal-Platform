import { Link } from "react-router";
import { MapPin, Star, Users } from "lucide-react";
import { Hotel } from "../data/mockData";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="h-48 overflow-hidden">
        <img
          src={hotel.logo}
          alt={hotel.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-2 text-green-600" />
          <span className="text-sm">{hotel.location}</span>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-500 mr-1 fill-yellow-500" />
            <span className="text-sm font-semibold">{hotel.rating}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users size={16} className="mr-1 text-green-600" />
            <span className="text-sm">{hotel.totalStudents} Students</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>

        <Link
          to={`/hotel/${hotel.id}`}
          className="block w-full text-center py-2.5 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}

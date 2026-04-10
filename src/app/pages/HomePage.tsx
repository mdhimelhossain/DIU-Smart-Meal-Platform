import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { HotelCard } from "../components/HotelCard";
import { hotels } from "../data/mockData";
import { ChevronLeft, ChevronRight, Utensils, CreditCard, TrendingUp } from "lucide-react";

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const hotelsPerSlide = 3;
  const totalSlides = Math.ceil(hotels.length / hotelsPerSlide);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentHotels = () => {
    const start = currentSlide * hotelsPerSlide;
    return hotels.slice(start, start + hotelsPerSlide);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              DIU Smart Food Portal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              Your trusted postpaid meal system. Eat now, pay later! Connect with nearby hotels and manage your meals effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-green-600 rounded-2xl font-semibold hover:bg-green-50 transition-all text-center"
              >
                Get Started
              </Link>
              <Link
                to="/hotels"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold hover:bg-white/10 transition-all text-center"
              >
                Browse Hotels
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <Utensils className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Meal Tracking</h3>
              <p className="text-gray-600">
                Track all your meals automatically. Add entries with a single click and view detailed history.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <CreditCard className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Postpaid System</h3>
              <p className="text-gray-600">
                Eat first, pay later! No need to carry cash. Monthly billing made simple and transparent.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">
                View detailed analytics of your spending. Track monthly totals and manage your budget effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Featured Hotels
          </h2>

          <div className="relative">
            {/* Hotels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {getCurrentHotels().map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={prevSlide}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-green-50 transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="text-green-600" size={24} />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? "bg-green-600 w-8" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-green-50 transition-all"
                aria-label="Next"
              >
                <ChevronRight className="text-green-600" size={24} />
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/hotels"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all"
            >
              View All Hotels
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2026 DIU Smart Food Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

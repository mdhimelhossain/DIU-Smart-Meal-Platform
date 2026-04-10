import { Navbar } from "../components/Navbar";
import { Target, Users, Heart, TrendingUp } from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About DIU Smart Food Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing campus dining with our innovative postpaid meal system
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <Target className="text-green-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            DIU Smart Food Portal aims to simplify meal management for university students and nearby hotels. 
            We believe students should focus on their studies, not worry about carrying cash for every meal. 
            Our postpaid system creates a seamless experience where students can enjoy their meals and settle 
            payments at the end of the month, while hotels get access to a larger customer base and efficient 
            payment tracking.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <Users className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">For Students</h3>
            <p className="text-gray-600">
              Track your meals, manage your budget, and enjoy hassle-free dining with our postpaid system. 
              No more cash worries!
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <Heart className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">For Hotels</h3>
            <p className="text-gray-600">
              Expand your customer base, manage menus digitally, and track revenue efficiently with our 
              comprehensive dashboard.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Analytics</h3>
            <p className="text-gray-600">
              Get detailed insights into spending patterns, meal preferences, and revenue trends with 
              real-time analytics.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h4 className="font-bold mb-2">Register</h4>
              <p className="text-green-50 text-sm">
                Sign up as a student or hotel owner
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h4 className="font-bold mb-2">Join Hotels</h4>
              <p className="text-green-50 text-sm">
                Students join their preferred hotels' postpaid system
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h4 className="font-bold mb-2">Eat & Track</h4>
              <p className="text-green-50 text-sm">
                Enjoy meals and add entries to track spending
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h4 className="font-bold mb-2">Pay Monthly</h4>
              <p className="text-green-50 text-sm">
                Settle all payments at the end of the month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
